import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoMeetingLobby from './VideoMeetingLobby';
import VideoGrid from './VideoGrid';
import ChatModal from './ChatModal';
import ControlBar from './ControlBar';
import { useWebRTC } from '../../hooks/useWebRTC';
import { useMediaDevices } from '../../hooks/useMediaDevices';
import server from '../../environment';

const VideoMeetingMain = () => {
    const navigate = useNavigate();
    const localVideoRef = useRef();

    // Add refs to prevent unnecessary re-renders
    const permissionsRef = useRef();
    const streamInitializedRef = useRef(false);

    // Custom hooks
    const {
        videos,
        connectToSocket,
        updateStreamForConnections,
        sendChatMessage,
        disconnect,
        createBlackSilenceStream
    } = useWebRTC(server);

    const { permissions, getPermissions, getUserMedia, getDisplayMedia } = useMediaDevices();

    // Update permissions ref when permissions change
    useEffect(() => {
        permissionsRef.current = permissions;
    }, [permissions]);

    // UI states
    const [askForUsername, setAskForUsername] = useState(true);
    const [username, setUsername] = useState("");
    const [showModal, setShowModal] = useState(false);

    // Media control states with initial values to prevent undefined checks
    const [mediaControls, setMediaControls] = useState({
        video: false,
        audio: false,
        screen: false
    });

    // Chat states
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [newMessages, setNewMessages] = useState(0);

    // Memoized chat message handler to prevent re-renders
    const addMessage = useCallback((data, sender, socketIdSender) => {
        setMessages(prevMessages => [
            ...prevMessages,
            { sender, data, timestamp: new Date() }
        ]);

        if (socketIdSender !== localVideoRef.current?.socketId) {
            setNewMessages(prev => prev + 1);
        }
    }, []); // Empty dependency array since we only use prev values

    // Initialize permissions only once on mount
    useEffect(() => {
        if (streamInitializedRef.current) return;

        const initializePermissions = async () => {
            try {
                const perms = await getPermissions();

                if (perms.video || perms.audio) {
                    const stream = await getUserMedia({
                        video: perms.video,
                        audio: perms.audio
                    });

                    window.localStream = stream;
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = stream;
                    }
                    streamInitializedRef.current = true;
                }
            } catch (error) {
                console.error('Error initializing media:', error);
            }
        };

        initializePermissions();
    }, []); // Run only once on mount

    // Memoized media change handler
    const handleMediaChange = useCallback(async () => {
        const { video, audio } = mediaControls;

        try {
            if ((video && permissionsRef.current?.video) || (audio && permissionsRef.current?.audio)) {
                const stream = await getUserMedia({
                    video: video && permissionsRef.current?.video,
                    audio: audio && permissionsRef.current?.audio
                });

                // Stop previous tracks
                if (window.localStream) {
                    window.localStream.getTracks().forEach(track => track.stop());
                }

                window.localStream = stream;
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
                updateStreamForConnections(stream);

                // Handle track ended events
                stream.getTracks().forEach(track => {
                    track.onended = () => {
                        setMediaControls(prev => ({
                            ...prev,
                            video: false,
                            audio: false
                        }));

                        const blackSilentStream = createBlackSilenceStream();
                        window.localStream = blackSilentStream;
                        if (localVideoRef.current) {
                            localVideoRef.current.srcObject = blackSilentStream;
                        }
                        updateStreamForConnections(blackSilentStream);
                    };
                });
            } else {
                // Stop current tracks and use black/silent stream
                if (window.localStream) {
                    window.localStream.getTracks().forEach(track => track.stop());
                }

                const blackSilentStream = createBlackSilenceStream();
                window.localStream = blackSilentStream;
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = blackSilentStream;
                }
                updateStreamForConnections(blackSilentStream);
            }
        } catch (error) {
            console.error('Error handling media change:', error);
        }
    }, [mediaControls.video, mediaControls.audio, getUserMedia, createBlackSilenceStream, updateStreamForConnections]);

    // Handle screen sharing with better error handling
    const handleScreenShare = useCallback(async () => {
        if (!mediaControls.screen) return;

        try {
            const stream = await getDisplayMedia();

            // Stop previous tracks
            if (window.localStream) {
                window.localStream.getTracks().forEach(track => track.stop());
            }

            window.localStream = stream;
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
            updateStreamForConnections(stream);

            // Handle screen share end
            stream.getTracks().forEach(track => {
                track.onended = () => {
                    setMediaControls(prev => ({ ...prev, screen: false }));
                    // Don't call handleMediaChange directly to avoid loops
                    setTimeout(() => {
                        handleMediaChange();
                    }, 100);
                };
            });
        } catch (error) {
            console.error('Error getting display media:', error);
            setMediaControls(prev => ({ ...prev, screen: false }));
        }
    }, [mediaControls.screen, getDisplayMedia, updateStreamForConnections, handleMediaChange]);

    // Separate useEffect for media controls to avoid multiple triggers
    useEffect(() => {
        if (!askForUsername && streamInitializedRef.current) {
            handleMediaChange();
        }
    }, [mediaControls.video, mediaControls.audio, askForUsername, handleMediaChange]);

    useEffect(() => {
        if (!askForUsername && mediaControls.screen) {
            handleScreenShare();
        }
    }, [mediaControls.screen, askForUsername, handleScreenShare]);

    // Memoized event handlers
    const handleConnect = useCallback(() => {
        if (!username.trim()) return;

        setAskForUsername(false);
        setMediaControls({
            video: permissionsRef.current?.video || false,
            audio: permissionsRef.current?.audio || false,
            screen: false
        });
        connectToSocket(addMessage);
    }, [username, connectToSocket, addMessage]);

    const handleVideoToggle = useCallback(() => {
        setMediaControls(prev => ({ ...prev, video: !prev.video }));
    }, []);

    const handleAudioToggle = useCallback(() => {
        setMediaControls(prev => ({ ...prev, audio: !prev.audio }));
    }, []);

    const handleScreenToggle = useCallback(() => {
        setMediaControls(prev => ({ ...prev, screen: !prev.screen }));
    }, []);

    const handleChatToggle = useCallback(() => {
        setShowModal(prev => {
            if (!prev) {
                setNewMessages(0);
            }
            return !prev;
        });
    }, []);

    const handleSendMessage = useCallback(() => {
        if (!message.trim()) return;
        sendChatMessage(message, username);
        setMessage("");
    }, [message, username, sendChatMessage]);

    const handleEndCall = useCallback(() => {
        // Clean up before leaving
        if (window.localStream) {
            window.localStream.getTracks().forEach(track => track.stop());
        }
        disconnect();
        navigate("/home");
    }, [disconnect, navigate]);

    const handleCloseChat = useCallback(() => {
        setShowModal(false);
        setNewMessages(0);
    }, []);

    // Optimized remote video handling with ref tracking
    const processedVideosRef = useRef(new Set());

    useEffect(() => {
        videos.forEach(video => {
            const videoKey = `${video.socketId}-${video.stream?.id || 'no-stream'}`;

            // Skip if already processed
            if (processedVideosRef.current.has(videoKey)) return;

            const element = document.querySelector(`video[data-socket='${video.socketId}']`);
            if (element && video.stream) {
                element.srcObject = video.stream;
                element.play().catch(error =>
                    console.error("Remote video play error:", error)
                );
                processedVideosRef.current.add(videoKey);
            }
        });

        // Cleanup processed videos that are no longer present
        const currentVideoKeys = new Set(videos.map(v => `${v.socketId}-${v.stream?.id || 'no-stream'}`));
        processedVideosRef.current.forEach(key => {
            if (!currentVideoKeys.has(key)) {
                processedVideosRef.current.delete(key);
            }
        });
    }, [videos]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (window.localStream) {
                window.localStream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    if (askForUsername) {
        return (
            <VideoMeetingLobby
                username={username}
                setUsername={setUsername}
                onConnect={handleConnect}
                localVideoRef={localVideoRef}
            />
        );
    }

    return (
        <div>
            <ChatModal
                showModal={showModal}
                onClose={handleCloseChat}
                messages={messages}
                message={message}
                setMessage={setMessage}
                onSendMessage={handleSendMessage}
                username={username}
            />

            <VideoGrid
                videos={videos}
                localVideoRef={localVideoRef}
                username={username}
                mediaControls={mediaControls}
            />

            <ControlBar
                mediaControls={mediaControls}
                permissions={permissions}
                newMessages={newMessages}
                showModal={showModal}
                videos={videos}
                onAudioToggle={handleAudioToggle}
                onVideoToggle={handleVideoToggle}
                onScreenToggle={handleScreenToggle}
                onChatToggle={handleChatToggle}
                onEndCall={handleEndCall}
            />
        </div>
    );
};

export default VideoMeetingMain;