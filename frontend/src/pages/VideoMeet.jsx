import React, { useState, useRef, useEffect } from 'react';
import styles from "../styles/videoComponent.module.css"
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { io } from "socket.io-client";
import IconButton from '@mui/material/IconButton';
import VideocamIcon from '@mui/icons-material/Videocam';       // ✅ correct
import VideocamOffIcon from '@mui/icons-material/VideocamOff'; // ✅ correct
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ChatIcon from '@mui/icons-material/Chat';
import Badge from '@mui/material/Badge';
import { useNavigate } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';
import server from '../environment'


const server_url = server;
const connections = {};
const peerConfigConnections = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};

export default function VideoMeetComponent() {

    var socketRef = useRef();
    let socketIdRef = useRef();
    let localVideoRef = useRef();
    let [videoAvailable, setVideoAvailable] = useState(true);
    let [audioAvailable, setAudioAvailable] = useState(true);
    let [video, setVideo] = useState([]);
    let [audio, setAudio] = useState();
    let [screen, setScreen] = useState();
    let [showModal, setModal] = useState(true);
    let [screenAvailable, setScreenAvailable] = useState();
    let [messages, setMessages] = useState([])
    let [message, setMessage] = useState("");
    let [newMessages, setNewMessages] = useState(3);
    let [askForUsername, setAskForUsername] = useState(true);
    let [username, setUsername] = useState("");
    const videoRef = useRef([])
    let [videos, setVideos] = useState([])




    // TODO
    // if(isChrome() === false) {


    // }

    useEffect(() => {
        console.log("HELLO world")
        getPermissions();

    })





    const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoPermission) {
                setVideoAvailable(true);
                console.log('Video permission granted');
            } else {
                setVideoAvailable(false);
                console.log('Video permission denied');
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (audioPermission) {
                setAudioAvailable(true);
                console.log('Audio permission granted');
            } else {
                setAudioAvailable(false);
                console.log('Audio permission denied');
            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = userMediaStream;
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
            console.log("SET STATE HAS ", video, audio);

        }


    }, [video, audio])



    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .then((stream) => { })
                .catch((e) => console.log(e))
        } else {
            try {
                let tracks = localVideoRef.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { }
        }
    }


    let silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator()
        let dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }



    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height })
        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }




    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoRef.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                console.log(description)
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);

            try {
                let tracks = localVideoRef.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoRef.current.srcObject = window.localStream

            for (let id in connections) {
                connections[id].addStream(window.localStream)

                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                        })
                        .catch(e => console.log(e))
                })
            }
        })
    }







    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }
    }



    let addMessage = (data, sender, socketIdSender) => {

        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);

        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevMessages) => prevMessages + 1)
        }

    }


    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false })

        socketRef.current.on('signal', gotMessageFromServer)

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-call', window.location.href)
            socketIdRef.current = socketRef.current.id

            socketRef.current.on('chat-message', addMessage)

            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id))
            })

            socketRef.current.on('user-joined', (id, clients) => {
                clients.forEach((socketListId) => {

                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections)
                    // Wait for their ice candidate       
                    connections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }
                    }

                    // Wait for their video stream
                    connections[socketListId].onaddstream = (event) => {
                        console.log("BEFORE:", videoRef.current);
                        console.log("FINDING ID: ", socketListId);

                        let videoExists = videoRef.current.find(video => video.socketId === socketListId);

                        if (videoExists) {
                            console.log("FOUND EXISTING");

                            // Update the stream of the existing video
                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.stream } : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        } else {
                            // Create a new video
                            console.log("CREATING NEW");
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoplay: true,
                                playsinline: true
                            };

                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };


                    // Add the local video stream
                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream)
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()])
                        window.localStream = blackSilence()
                        connections[socketListId].addStream(window.localStream)
                    }
                })

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue

                        try {
                            connections[id2].addStream(window.localStream)
                        } catch (e) { }

                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }))
                                })
                                .catch(e => console.log(e))
                        })
                    }
                }
            })
        })
    }




    useEffect(() => {
        // getUserMediaStream();
    }, []);

    useEffect(() => {
        videos.forEach(video => {
            const el = document.querySelector(`video[data-socket='${video.socketId}']`);
            if (el && video.stream) {
                el.srcObject = video.stream;
                el.play().catch(err => console.error("❌ Remote video play error:", err));
            }
        });
    }, [videos]);





    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();

    }

    let routerTo = useNavigate();



    let connect = () => {
        setAskForUsername(false);
        getMedia();
    }

    let handleVideo = () => {
        setVideo(!video);
        // getUserMedia();
    }


    let handleAudio = () => {
        setAudio(!audio)
        // getUserMedia();
    }


    useEffect(() => {
        if (screen !== undefined) {
            getDisplayMedia();
        }
    }, [screen])

    let handleScreen = () => {
        setScreen(!screen)

    }
    let sendMessage = () => {
        socketRef.current.emit("chat-message", message, username);
        setMessage("");

    }

    let handleEndCall = () => {
        try {
            let tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop())

        } catch (e) {
            console.log(e)
        }
        routerTo("/home")
    }


    let getDisplayMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream;
        localVideoRef.current.srcObject = stream;
        for (let id in connections) {
            if (id === socketIdRef.current) continue;

            connections[id].addStream(window.localStream)
            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit("signal", id, JSON.stringify({ "sdp": connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))

            })
        }



        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false);

            try {
                let tracks = localVideoRef.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoRef.current.srcObject = window.localStream


            getUserMedia()

        })


    }






    let getDisplayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia)
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDisplayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => console.log(e))
        }

    }





    //  useEffect(() => {
    //         if (screen !== undefined) {
    //            getDisplayMedia();
    //         }
    //     }, [screen])


    // let handleScreen = () => {
    //     setScreen(!screen);
    // }


    return (
        <div>
            {askForUsername === true ?
                <div className={styles.lobbyContainer}>
                    <div className={styles.lobbyCard}>
                        <h2>Join Meeting</h2>
                        <div className={styles.previewContainer}>
                            <video ref={localVideoRef} autoPlay muted className={styles.previewVideo}></video>
                        </div>
                        <div className={styles.lobbyInputs}>
                            <TextField
                                id="outlined-basic"
                                label="Enter your name"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                variant="outlined"
                                fullWidth
                            />
                            <Button
                                variant="contained"
                                onClick={connect}
                                size="large"
                                fullWidth
                                className={styles.joinButton}
                            >
                                Join Meeting
                            </Button>
                        </div>
                    </div>
                </div>
                :
                <div className={styles.meetingContainer}>
                    {/* Chat Modal */}
                    {showModal && (
                        <div className={styles.chatModal}>
                            <div className={styles.chatRoom}>
                                <div className={styles.chatHeader}>
                                    <h3>Meeting Chat</h3>
                                    <IconButton
                                        onClick={() => setModal(false)}
                                        size="small"
                                        className={styles.closeChat}
                                    >
                                        ×
                                    </IconButton>
                                </div>

                                <div className={styles.chattingDisplay}>
                                    {messages.length > 0 ? messages.map((item, index) => (
                                        <div
                                            key={index}
                                            className={`${styles.messageItem} ${item.sender === username ? styles.ownMessage : styles.otherMessage}`}
                                        >
                                            <div className={styles.messageSender}>{item.sender}</div>
                                            <div className={styles.messageContent}>{item.data}</div>
                                            <div className={styles.messageTime}>
                                                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    )) : (
                                        <div className={styles.noMessages}>
                                            <p>No messages yet</p>
                                            <p>Start the conversation!</p>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.chattingArea}>
                                    <TextField
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                sendMessage();
                                            }
                                        }}
                                    />
                                    <IconButton
                                        onClick={sendMessage}
                                        color="primary"
                                        className={styles.sendButton}
                                    >
                                        <SendIcon />
                                    </IconButton>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Video Grid Container */}
                    <div className={`${styles.videoGrid} ${styles[`participants${Math.min(videos.length + 1, 8)}`]}`}>
                        {/* Local Video */}
                        <div className={styles.videoCard}>
                            <video
                                className={styles.videoElement}
                                ref={localVideoRef}
                                autoPlay
                                muted
                                playsInline
                            />
                            <div className={styles.videoInfo}>
                                <div className={styles.participantName}>{username || "You"}</div>
                                <div className={styles.statusIcons}>
                                    {!audio && (
                                        <div className={styles.statusIcon}>
                                            <MicOffIcon />
                                        </div>
                                    )}
                                </div>
                            </div>
                            {!video && (
                                <div className={styles.videoOff}>
                                    <div className={styles.avatarCircle}>
                                        {(username || "You").charAt(0).toUpperCase()}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Remote Videos */}
                        {videos.map((video, index) => (
                            <div key={video.socketId} className={styles.videoCard}>
                                <video
                                    className={styles.videoElement}
                                    data-socket={video.socketId}
                                    autoPlay
                                    playsInline
                                    muted={false}
                                    ref={ref => {
                                        if (ref && video.stream) {
                                            ref.srcObject = video.stream;
                                        }
                                    }}
                                />
                                <div className={styles.videoInfo}>
                                    <div className={styles.participantName}>
                                        User {index + 2}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Control Bar */}
                    <div className={styles.controlBar}>
                        <div className={styles.controlGroup}>
                            {/* Audio Control */}
                            <div className={styles.controlButton}>
                                <IconButton
                                    onClick={handleAudio}
                                    className={`${styles.controlIcon} ${!audio ? styles.disabled : ''}`}
                                    size="large"
                                >
                                    {audio ? <MicIcon /> : <MicOffIcon />}
                                </IconButton>
                                <span className={styles.controlLabel}>
                                    {audio ? 'Mute' : 'Unmute'}
                                </span>
                            </div>

                            {/* Video Control */}
                            <div className={styles.controlButton}>
                                <IconButton
                                    onClick={handleVideo}
                                    className={`${styles.controlIcon} ${!video ? styles.disabled : ''}`}
                                    size="large"
                                >
                                    {video ? <VideocamIcon /> : <VideocamOffIcon />}
                                </IconButton>
                                <span className={styles.controlLabel}>
                                    {video ? 'Stop Video' : 'Start Video'}
                                </span>
                            </div>

                            {/* Screen Share */}
                            {screenAvailable && (
                                <div className={styles.controlButton}>
                                    <IconButton
                                        onClick={handleScreen}
                                        className={`${styles.controlIcon} ${screen ? styles.active : ''}`}
                                        size="large"
                                    >
                                        {screen ? <StopScreenShareIcon /> : <ScreenShareIcon />}
                                    </IconButton>
                                    <span className={styles.controlLabel}>
                                        {screen ? 'Stop Sharing' : 'Share Screen'}
                                    </span>
                                </div>
                            )}

                            {/* Chat Control */}
                            <div className={styles.controlButton}>
                                <Badge badgeContent={newMessages} max={99} color="error">
                                    <IconButton
                                        onClick={() => setModal(!showModal)}
                                        className={`${styles.controlIcon} ${showModal ? styles.active : ''}`}
                                        size="large"
                                    >
                                        <ChatIcon />
                                    </IconButton>
                                </Badge>
                                <span className={styles.controlLabel}>Chat</span>
                            </div>

                            {/* End Call */}
                            <div className={styles.controlButton}>
                                <IconButton
                                    onClick={handleEndCall}
                                    className={`${styles.controlIcon} ${styles.endCall}`}
                                    size="large"
                                >
                                    <CallEndIcon />
                                </IconButton>
                                <span className={styles.controlLabel}>Leave</span>
                            </div>
                        </div>

                        {/* Meeting Info */}
                        <div className={styles.meetingInfo}>
                            <span className={styles.participantCount}>
                                {videos.length + 1} participant{videos.length > 0 ? 's' : ''}
                            </span>
                            <span className={styles.meetingTime}>
                                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}
