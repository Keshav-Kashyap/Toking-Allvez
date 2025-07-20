import React from 'react';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ChatIcon from '@mui/icons-material/Chat';
import styles from "../../styles/videoComponent.module.css";

const ControlButton = ({ onClick, className, children, label, disabled = false }) => (
    <div className={styles.controlButton}>
        <IconButton
            onClick={onClick}
            className={className}
            size="large"
            disabled={disabled}
        >
            {children}
        </IconButton>
        <span className={styles.controlLabel}>{label}</span>
    </div>
);

const ControlBar = ({
    mediaControls,
    permissions,
    newMessages,
    showModal,
    videos,
    onAudioToggle,
    onVideoToggle,
    onScreenToggle,
    onChatToggle,
    onEndCall
}) => {
    return (
        <div className={styles.controlBar}>
            <div className={styles.controlGroup}>
                {/* Audio Control */}
                <ControlButton
                    onClick={onAudioToggle}
                    className={`${styles.controlIcon} ${!mediaControls.audio ? styles.disabled : ''}`}
                    label={mediaControls.audio ? 'Mute' : 'Unmute'}
                >
                    {mediaControls.audio ? <MicIcon /> : <MicOffIcon />}
                </ControlButton>

                {/* Video Control */}
                <ControlButton
                    onClick={onVideoToggle}
                    className={`${styles.controlIcon} ${!mediaControls.video ? styles.disabled : ''}`}
                    label={mediaControls.video ? 'Stop Video' : 'Start Video'}
                >
                    {mediaControls.video ? <VideocamIcon /> : <VideocamOffIcon />}
                </ControlButton>

                {/* Screen Share */}
                {permissions.screen && (
                    <ControlButton
                        onClick={onScreenToggle}
                        className={`${styles.controlIcon} ${mediaControls.screen ? styles.active : ''}`}
                        label={mediaControls.screen ? 'Stop Sharing' : 'Share Screen'}
                    >
                        {mediaControls.screen ? <StopScreenShareIcon /> : <ScreenShareIcon />}
                    </ControlButton>
                )}

                {/* Chat Control */}
                <div className={styles.controlButton}>
                    <Badge badgeContent={newMessages} max={99} color="error">
                        <IconButton
                            onClick={onChatToggle}
                            className={`${styles.controlIcon} ${showModal ? styles.active : ''}`}
                            size="large"
                        >
                            <ChatIcon />
                        </IconButton>
                    </Badge>
                    <span className={styles.controlLabel}>Chat</span>
                </div>

                {/* End Call */}
                <ControlButton
                    onClick={onEndCall}
                    className={`${styles.controlIcon} ${styles.endCall}`}
                    label="Leave"
                >
                    <CallEndIcon />
                </ControlButton>
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
    );
};

export default ControlBar;
