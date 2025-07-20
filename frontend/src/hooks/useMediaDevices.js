import { useState, useCallback } from 'react';

export const useMediaDevices = () => {
    const [permissions, setPermissions] = useState({
        video: true,
        audio: true,
        screen: false
    });

    const getPermissions = useCallback(async () => {
        const newPermissions = { ...permissions };

        // Check video permission
        try {
            const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
            newPermissions.video = true;
            videoStream.getTracks().forEach(track => track.stop());
        } catch (error) {
            newPermissions.video = false;
            console.log('Video permission denied');
        }

        // Check audio permission
        try {
            const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            newPermissions.audio = true;
            audioStream.getTracks().forEach(track => track.stop());
        } catch (error) {
            newPermissions.audio = false;
            console.log('Audio permission denied');
        }

        // Check screen share availability
        newPermissions.screen = !!navigator.mediaDevices.getDisplayMedia;

        setPermissions(newPermissions);
        return newPermissions;
    }, [permissions]);

    const getUserMedia = useCallback(async (constraints) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            return stream;
        } catch (error) {
            console.error('Error getting user media:', error);
            throw error;
        }
    }, []);

    // Fixed screen share function
    const getDisplayMedia = useCallback(async (constraints = { video: true, audio: true }) => {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia(constraints);

            // Screen share ke time sirf screen show karni hai, video nahi
            // Audio still camera se le sakte hain agar user chahta hai
            let audioTrack = null;

            if (constraints.audio && window.localStream) {
                // Existing audio track ko preserve kar sakte hain
                const existingAudioTracks = window.localStream.getAudioTracks();
                if (existingAudioTracks.length > 0) {
                    audioTrack = existingAudioTracks[0];
                }
            } else if (constraints.audio) {
                // Naya audio track get karein
                try {
                    const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    audioTrack = audioStream.getAudioTracks()[0];
                } catch (error) {
                    console.log('Could not get audio track:', error);
                }
            }

            // Screen track + audio track combine karein
            const combinedTracks = [];

            // Video track (screen) add karein
            const videoTracks = screenStream.getVideoTracks();
            if (videoTracks.length > 0) {
                combinedTracks.push(videoTracks[0]);
            }

            // Audio track add karein (agar available hai)
            if (audioTrack) {
                combinedTracks.push(audioTrack);
            }

            const finalStream = new MediaStream(combinedTracks);

            // Screen share end hone par event listener
            screenStream.getVideoTracks()[0].addEventListener('ended', () => {
                console.log('Screen sharing ended');
                // Yahan aap callback function call kar sakte hain
                if (window.onScreenShareEnd) {
                    window.onScreenShareEnd();
                }
            });

            return finalStream;

        } catch (error) {
            console.error('Error getting display media:', error);
            throw error;
        }
    }, []);

    // Camera + microphone stream get karne ke liye separate function
    const getCameraStream = useCallback(async (constraints = { video: true, audio: true }) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            return stream;
        } catch (error) {
            console.error('Error getting camera stream:', error);
            throw error;
        }
    }, []);

    // Switch between camera and screen share
    const switchToCamera = useCallback(async () => {
        try {
            return await getCameraStream();
        } catch (error) {
            console.error('Error switching to camera:', error);
            throw error;
        }
    }, [getCameraStream]);

    const switchToScreenShare = useCallback(async () => {
        try {
            return await getDisplayMedia();
        } catch (error) {
            console.error('Error switching to screen share:', error);
            throw error;
        }
    }, [getDisplayMedia]);

    return {
        permissions,
        getPermissions,
        getUserMedia,
        getDisplayMedia,
        getCameraStream,
        switchToCamera,
        switchToScreenShare
    };
};