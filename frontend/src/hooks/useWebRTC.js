import { useState, useRef, useCallback } from 'react';
import { io } from "socket.io-client";

const PEER_CONFIG = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};

export const useWebRTC = (serverUrl) => {
    const socketRef = useRef();
    const socketIdRef = useRef();
    const connections = useRef({});

    const [videos, setVideos] = useState([]);

    // Utility functions
    const createSilentAudioTrack = useCallback(() => {
        const ctx = new AudioContext();
        const oscillator = ctx.createOscillator();
        const destination = oscillator.connect(ctx.createMediaStreamDestination());
        oscillator.start();
        ctx.resume();
        return Object.assign(destination.stream.getAudioTracks()[0], { enabled: false });
    }, []);

    const createBlackVideoTrack = useCallback(({ width = 640, height = 480 } = {}) => {
        const canvas = Object.assign(document.createElement("canvas"), { width, height });
        canvas.getContext('2d').fillRect(0, 0, width, height);
        const stream = canvas.captureStream();
        return Object.assign(stream.getVideoTracks()[0], { enabled: false });
    }, []);

    const createBlackSilenceStream = useCallback((...args) => {
        return new MediaStream([createBlackVideoTrack(...args), createSilentAudioTrack()]);
    }, [createBlackVideoTrack, createSilentAudioTrack]);

    // Socket message handler
    const handleSocketMessage = useCallback((fromId, message) => {
        try {
            const signal = JSON.parse(message);
            if (fromId === socketIdRef.current) return;

            const connection = connections.current[fromId];
            if (!connection) return;

            if (signal.sdp) {
                connection.setRemoteDescription(new RTCSessionDescription(signal.sdp))
                    .then(() => {
                        if (signal.sdp.type === 'offer') {
                            return connection.createAnswer();
                        }
                    })
                    .then(description => {
                        if (description) {
                            return connection.setLocalDescription(description);
                        }
                    })
                    .then(() => {
                        if (signal.sdp.type === 'offer') {
                            socketRef.current.emit('signal', fromId, JSON.stringify({
                                sdp: connection.localDescription
                            }));
                        }
                    })
                    .catch(error => console.error('Error handling SDP:', error));
            }

            if (signal.ice) {
                connection.addIceCandidate(new RTCIceCandidate(signal.ice))
                    .catch(error => console.error('Error adding ICE candidate:', error));
            }
        } catch (error) {
            console.error('Error parsing socket message:', error);
        }
    }, []);

    // Connect to socket server
    const connectToSocket = useCallback((onMessage) => {
        socketRef.current = io.connect(serverUrl, { secure: false });

        socketRef.current.on('signal', handleSocketMessage);
        socketRef.current.on('chat-message', onMessage);

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-call', window.location.href);
            socketIdRef.current = socketRef.current.id;

            socketRef.current.on('user-left', (id) => {
                setVideos(videos => videos.filter(video => video.socketId !== id));
                if (connections.current[id]) {
                    connections.current[id].close();
                    delete connections.current[id];
                }
            });

            socketRef.current.on('user-joined', (id, clients) => {
                clients.forEach(socketListId => {
                    const connection = new RTCPeerConnection(PEER_CONFIG);
                    connections.current[socketListId] = connection;

                    // ICE candidate handler
                    connection.onicecandidate = (event) => {
                        if (event.candidate) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({
                                ice: event.candidate
                            }));
                        }
                    };

                    // Stream handler - Fixed blinking issue
                    connection.onaddstream = (event) => {
                        setVideos(prevVideos => {
                            const existingIndex = prevVideos.findIndex(video => video.socketId === socketListId);

                            if (existingIndex >= 0) {
                                // Update existing video without recreating
                                const updatedVideos = [...prevVideos];
                                updatedVideos[existingIndex] = {
                                    ...updatedVideos[existingIndex],
                                    stream: event.stream
                                };
                                return updatedVideos;
                            } else {
                                return [...prevVideos, {
                                    socketId: socketListId,
                                    stream: event.stream,
                                    autoplay: true,
                                    playsinline: true
                                }];
                            }
                        });
                    };

                    // Add local stream
                    if (window.localStream) {
                        connection.addStream(window.localStream);
                    } else {
                        window.localStream = createBlackSilenceStream();
                        connection.addStream(window.localStream);
                    }
                });

                // Create offers for existing connections
                if (id === socketIdRef.current) {
                    Object.keys(connections.current).forEach(id2 => {
                        if (id2 === socketIdRef.current) return;

                        const connection = connections.current[id2];
                        try {
                            connection.addStream(window.localStream);
                            connection.createOffer()
                                .then(description => connection.setLocalDescription(description))
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({
                                        sdp: connection.localDescription
                                    }));
                                })
                                .catch(error => console.error('Error creating initial offer:', error));
                        } catch (error) {
                            console.error('Error setting up initial connection:', error);
                        }
                    });
                }
            });
        });
    }, [serverUrl, handleSocketMessage, createBlackSilenceStream]);

    // Fixed stream update function - replaces tracks instead of adding new stream
    const updateStreamForConnections = useCallback(async (newStream) => {
        window.localStream = newStream;

        const promises = Object.keys(connections.current).map(async (id) => {
            if (id === socketIdRef.current) return;

            const connection = connections.current[id];
            const sender = connection.getSenders();

            try {
                // Replace video track
                const videoTrack = newStream.getVideoTracks()[0];
                const videoSender = sender.find(s =>
                    s.track && s.track.kind === 'video'
                );

                if (videoSender && videoTrack) {
                    await videoSender.replaceTrack(videoTrack);
                }

                // Replace audio track
                const audioTrack = newStream.getAudioTracks()[0];
                const audioSender = sender.find(s =>
                    s.track && s.track.kind === 'audio'
                );

                if (audioSender && audioTrack) {
                    await audioSender.replaceTrack(audioTrack);
                }

                // Create new offer after track replacement
                const description = await connection.createOffer();
                await connection.setLocalDescription(description);

                socketRef.current.emit('signal', id, JSON.stringify({
                    sdp: connection.localDescription
                }));

            } catch (error) {
                console.error('Error updating stream for connection:', id, error);
            }
        });

        await Promise.all(promises);
    }, []);

    // Send chat message
    const sendChatMessage = useCallback((message, username) => {
        if (socketRef.current) {
            socketRef.current.emit("chat-message", message, username);
        }
    }, []);

    // Disconnect
    const disconnect = useCallback(() => {
        // Stop local stream
        if (window.localStream) {
            window.localStream.getTracks().forEach(track => track.stop());
        }

        // Close all connections
        Object.values(connections.current).forEach(connection => {
            connection.close();
        });
        connections.current = {};

        // Disconnect socket
        if (socketRef.current) {
            socketRef.current.disconnect();
        }
    }, []);

    return {
        videos,
        connectToSocket,
        updateStreamForConnections,
        sendChatMessage,
        disconnect,
        createBlackSilenceStream
    };
};