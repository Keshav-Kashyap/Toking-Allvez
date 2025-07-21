import React from 'react';
import VideoCard from './VideoCard';

const VideoGrid = ({
    videos,
    localVideoRef,
    username,
    mediaControls
}) => {
    const totalParticipants = videos.length + 1;

    // Single participant - only local user
    if (totalParticipants === 1) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-black">
                <VideoCard
                    video={localVideoRef}
                    isLocal={true}
                    username={username}
                    showVideo={mediaControls.video}
                    showAudio={mediaControls.audio}
                    className="w-full h-full object-cover"
                />
            </div>
        );
    }

    // Two participants - remote large, local small overlay
    if (totalParticipants === 2) {
        return (
            <div className="relative w-full h-screen bg-black">
                {/* Main large video - Remote user */}
                <div className="w-full h-full">
                    <VideoCard
                        key={videos[0].socketId}
                        video={videos[0]}
                        isLocal={false}
                        participantName="Remote User"
                        showVideo={true}
                        showAudio={true}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Small overlay video - Local user */}
                <div className="absolute bottom-5 left-5 w-40 h-28 md:w-52 md:h-40 z-10 border-2 border-white rounded-lg overflow-hidden shadow-lg">
                    <VideoCard
                        video={localVideoRef}
                        isLocal={true}
                        username={username}
                        showVideo={mediaControls.video}
                        showAudio={mediaControls.audio}
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        );
    }

    // Multiple participants - proper grid layout with span classes
    const getGridClasses = () => {
        if (totalParticipants === 1) return "grid-cols-1";
        if (totalParticipants === 2) return "grid-cols-2";
        if (totalParticipants <= 4) return "grid-cols-2";
        if (totalParticipants <= 6) return "grid-cols-3";
        if (totalParticipants <= 9) return "grid-cols-3";
        return "grid-cols-4"; // for >9
    };

    const getMobileGridClasses = () => {
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
    };

    const getRowCount = () => {
        if (totalParticipants <= 2) return 1;
        if (totalParticipants <= 4) return 2;
        if (totalParticipants <= 6) return 2;
        if (totalParticipants <= 9) return 3;
        return Math.ceil(totalParticipants / 4);
    };
    const rowCount = getRowCount();
    const gridRowHeight = `auto-rows-[calc(100vh/${rowCount})]`;

    // Function to get span classes for better layout
    const getVideoSpanClass = (index, total) => {
        // For 3 participants in 2x2 grid - last video spans 2 columns
        if (total === 3 && index === 2) {
            return "col-span-2 md:col-span-2";
        }
        // For 5 participants in 3x2 grid - last video spans 2 columns
        if (total === 5 && index === 4) {
            return "col-span-2 md:col-span-2";
        }
        // For 7 participants in 3x3 grid - last video spans 2 columns
        if (total === 7 && index === 6) {
            return "col-span-2 md:col-span-2";
        }
        // For 8 participants in 3x3 grid - last video spans 3 columns
        if (total === 8 && index === 7) {
            return "col-span-2 md:col-span-3";
        }
        return "";
    };

    const allParticipants = [
        // Local video first
        {
            component: (
                <VideoCard
                    video={localVideoRef}
                    isLocal={true}
                    username={username}
                    showVideo={mediaControls.video}
                    showAudio={mediaControls.audio}
                    className="w-full h-full object-cover rounded-lg overflow-hidden"
                />
            ),
            key: 'local'
        },
        // Remote videos
        ...videos.map((video, index) => ({
            component: (
                <VideoCard
                    key={video.socketId}
                    video={video}
                    isLocal={false}
                    participantName={`User ${index + 2}`}
                    showVideo={true}
                    showAudio={true}
                    className="w-full h-full object-cover rounded-lg overflow-hidden"
                />
            ),
            key: video.socketId
        }))
    ];

    return (
        <div className="w-full min-h-screen bg-black p-2 md:p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">

            <div className={`grid w-full h-full pb-32 gap-2 sm:gap-3
  ${getGridClasses()} 
  ${getMobileGridClasses()} 
  ${gridRowHeight}
`}>
                {allParticipants.map((participant, index) => (
                    <div
                        key={participant.key}
                        className={`relative rounded-xl pb-32 w-full h-full ${getVideoSpanClass(index, totalParticipants)}`}
                    >
                        {participant.component}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VideoGrid;   