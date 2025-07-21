import React, { useRef } from 'react';
import { Camera, Mic, MicOff, Video, VideoOff, Settings } from 'lucide-react';

const VideoMeetingLobby = ({
    username,
    setUsername,
    onConnect,
    localVideoRef
}) => {
    const [isCameraOn, setIsCameraOn] = React.useState(true);
    const [isMicOn, setIsMicOn] = React.useState(false);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && username.trim()) {
            onConnect();
        }
    };

    const toggleCamera = () => {
        setIsCameraOn(!isCameraOn);
    };

    const renderCount = useRef(0);
    renderCount.current += 1;

    console.log("🔁 Render Count:", renderCount.current);

    const toggleMic = () => {
        setIsMicOn(!isMicOn);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-2 sm:p-4">
            {/* Mobile-first layout: stack vertically on small screens, side-by-side on larger screens */}
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 max-w-6xl w-full">
                {/* Video Preview Section */}
                <div className="flex-1 w-full lg:max-w-2xl">
                    <div className="bg-white rounded-xl  pt-10 lg:rounded-2xl shadow-lg overflow-hidden relative">



                        {/* Video Content */}
                        <div className="px-3 sm:px-4 pb-4 sm:pb-8">
                            {/* Video Preview Area */}
                            {/* Video Content */}
                            <div className="px-3 sm:px-4 pb-4 sm:pb-8">
                                {/* Video Preview Area */}
                                <div className="aspect-video bg-gray-800 rounded-lg sm:rounded-xl relative mb-4 sm:mb-6 overflow-hidden">
                                    <video
                                        ref={localVideoRef}
                                        autoPlay
                                        muted
                                        className={`w-full h-full object-cover rounded-lg sm:rounded-xl ${!isCameraOn ? 'hidden' : ''}`}
                                    />

                                    {/* Show Placeholder if Camera is Off */}
                                    {!isCameraOn && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg sm:rounded-xl">
                                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-600 rounded-full flex items-center justify-center">
                                                <VideoOff size={20} className="sm:w-6 sm:h-6 text-gray-400" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Mic Off Icon - show only if camera is off and mic is off */}
                                    {!isCameraOn && !isMicOn && (
                                        <div className="absolute bottom-3 left-3 w-10 h-10 sm:w-12 sm:h-12 bg-black/60 rounded-full flex items-center justify-center">
                                            <MicOff size={18} className="text-white sm:w-5 sm:h-5" />
                                        </div>
                                    )}
                                    {!isMicOn && (
                                        <div className="absolute bottom-3 left-3 w-10 h-10 sm:w-12 sm:h-12 bg-black/60 rounded-full flex items-center justify-center">
                                            <MicOff size={18} className="text-white sm:w-5 sm:h-5" />
                                        </div>
                                    )}
                                </div>
                            </div>


                            {/* Control Buttons */}
                            <div className="flex justify-center gap-3 sm:gap-4">
                                <button
                                    onClick={toggleMic}
                                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors ${isMicOn
                                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                        : 'bg-red-600 hover:bg-red-700 text-white'
                                        }`}
                                >
                                    {isMicOn ? <Mic size={16} className="sm:w-5 sm:h-5" /> : <MicOff size={16} className="sm:w-5 sm:h-5" />}
                                </button>

                                <button
                                    onClick={toggleCamera}
                                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors ${isCameraOn
                                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                        : 'bg-red-600 hover:bg-red-700 text-white'
                                        }`}
                                >
                                    {isCameraOn ? <Video size={16} className="sm:w-5 sm:h-5" /> : <VideoOff size={16} className="sm:w-5 sm:h-5" />}
                                </button>

                            </div>
                        </div>
                    </div>
                </div>

                {/* Join Section */}
                <div className="w-full lg:w-80 flex items-stretch lg:items-center justify-center">
                    <div className="bg-white rounded-xl lg:rounded-2xl p-6 sm:p-8 shadow-lg flex flex-col items-center justify-center w-full lg:w-auto min-h-[280px]">
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 text-center">
                            Ready to join?
                        </h2>
                        <p className="text-gray-500 mb-6 sm:mb-8 text-center text-sm sm:text-base">
                            No one else is here
                        </p>

                        <div className="space-y-4 w-full max-w-xs">
                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />

                            <button
                                onClick={onConnect}
                                disabled={!username.trim()}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2.5 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base"
                            >
                                Join now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoMeetingLobby;