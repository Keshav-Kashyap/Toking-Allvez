import React from 'react';
import MicOffIcon from '@mui/icons-material/MicOff';
import styles from "../../styles/videoComponent.module.css";

const VideoCard = ({
    video,
    isLocal = false,
    username,
    showVideo = true,
    showAudio = true,
    participantName
}) => {
    return (
        <div className={styles.videoCard}>
            <video
                className={styles.videoElement}
                ref={isLocal ? video : null}
                data-socket={!isLocal ? video.socketId : undefined}
                autoPlay
                muted={isLocal}
                playsInline
            />
            <div className={styles.videoInfo}>
                <div className={styles.participantName}>
                    {participantName || (isLocal ? (username || "You") : "User")}
                </div>
                <div className={styles.statusIcons}>
                    {!showAudio && (
                        <div className={styles.statusIcon}>
                            <MicOffIcon />
                        </div>
                    )}
                </div>
            </div>
            {!showVideo && (
                <div className={styles.videoOff}>
                    <div className={styles.avatarCircle}>
                        {(participantName || username || "U").charAt(0).toUpperCase()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoCard;