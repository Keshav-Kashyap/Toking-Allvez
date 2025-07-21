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
        <div className="aspect-video w-full h-full bg-black rounded-lg overflow-hidden">
            <div className={`${styles.videoCard} w-full h-full relative`}>
                {/* Video or Avatar */}
                <video
                    className={`${styles.videoElement} w-full h-full object-cover`}
                    ref={isLocal ? video : null}
                    data-socket={!isLocal ? video.socketId : undefined}
                    autoPlay
                    muted={isLocal}
                    playsInline
                />

                {/* Fallback if camera is off */}
                {!showVideo && (
                    <div className={`${styles.videoOff} absolute inset-0 flex items-center justify-center bg-gray-800`}>
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-600 text-white text-xl font-semibold flex items-center justify-center rounded-full">
                            {(participantName || username || "U").charAt(0).toUpperCase()}
                        </div>
                    </div>
                )}

                {/* Name + Mic status */}
                <div className={`${styles.videoInfo} absolute bottom-2 left-2 text-white flex items-center gap-2`}>
                    <span className="text-sm font-medium">
                        {participantName || (isLocal ? (username || "You") : "User")}
                    </span>
                    {!showAudio && (
                        <MicOffIcon fontSize="small" className="text-red-500" />
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoCard;
