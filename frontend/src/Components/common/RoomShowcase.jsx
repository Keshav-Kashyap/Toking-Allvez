import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Video, MessageCircle, Monitor, Mic, MicOff, Camera, CameraOff, Phone, Send, Users, Share2 } from 'lucide-react';

const RoomShowcase = ({ autoNavigate = true, showControls = true, className = "" }) => {
    const [currentRoom, setCurrentRoom] = useState(0);
    const [chatMessages, setChatMessages] = useState([
        { id: 1, user: 'Alice', message: 'Hello everyone!', time: '2:30 PM', sending: false },
        { id: 2, user: 'Bob', message: 'Great presentation!', time: '2:31 PM', sending: false },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [micOn, setMicOn] = useState(true);
    const [cameraOn, setCameraOn] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [isPaused, setIsPaused] = useState(false);

    const rooms = [
        {
            title: 'Meeting Room',
            icon: Video,
            content: (
                <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg h-32 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-blue-600 opacity-20 animate-pulse"></div>
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center animate-bounce">
                                <span className="text-white font-bold">A</span>
                            </div>
                            <div className="absolute bottom-2 left-2 flex items-center space-x-1 bg-black bg-opacity-50 rounded px-2 py-1">
                                <Mic className="w-3 h-3 text-green-400" />
                                <span className="text-xs text-white">Alice</span>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg h-32 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-green-600 opacity-20 animate-pulse delay-500"></div>
                            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center animate-bounce delay-300">
                                <span className="text-white font-bold">B</span>
                            </div>
                            <div className="absolute bottom-2 left-2 flex items-center space-x-1 bg-black bg-opacity-50 rounded px-2 py-1">
                                <Mic className="w-3 h-3 text-green-400" />
                                <span className="text-xs text-white">Bob</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center space-x-4 bg-gray-800 rounded-lg p-4">
                        <button
                            onClick={() => setMicOn(!micOn)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${micOn ? 'bg-gray-600 hover:bg-gray-700' : 'bg-red-600 hover:bg-red-700'
                                }`}
                        >
                            {micOn ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5 text-white" />}
                        </button>
                        <button
                            onClick={() => setCameraOn(!cameraOn)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${cameraOn ? 'bg-gray-600 hover:bg-gray-700' : 'bg-red-600 hover:bg-red-700'
                                }`}
                        >
                            {cameraOn ? <Camera className="w-5 h-5 text-white" /> : <CameraOff className="w-5 h-5 text-white" />}
                        </button>
                        <button className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-all duration-300 transform hover:scale-110">
                            <Phone className="w-5 h-5 text-white" />
                        </button>
                    </div>
                    <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>3 participants</span>
                    </div>
                </div>
            )
        },
        {
            title: 'Chat Room',
            icon: MessageCircle,
            content: (
                <div className="p-6 h-full flex flex-col relative">
                    {/* Chat Notifications */}
                    <div className="absolute top-2 right-2 space-y-2 z-10">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className="bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg animate-slide-in-right max-w-xs"
                            >
                                <div className="text-xs font-bold">{notification.user}</div>
                                <div className="text-sm">{notification.message}</div>
                            </div>
                        ))}
                    </div>

                    <div className="flex-1 bg-gray-50 rounded-lg p-4 mb-4 overflow-y-auto max-h-40 relative">
                        {chatMessages.map((msg, index) => (
                            <div key={msg.id} className={`mb-3 animate-message-appear transform transition-all duration-500 ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
                                <div className={`inline-block max-w-xs px-3 py-2 rounded-lg transform transition-all duration-300 hover:scale-105 ${index % 2 === 0 ? 'bg-blue-500 text-white animate-bounce-in' : 'bg-gray-200 text-gray-800 animate-slide-in'
                                    }`}>
                                    <div className="font-semibold text-xs mb-1">{msg.user}</div>
                                    <div className="text-sm">{msg.message}</div>
                                    <div className="text-xs opacity-75 mt-1">{msg.time}</div>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="mb-3 animate-typing-appear">
                                <div className="inline-block bg-gray-200 px-3 py-2 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                                        </div>
                                        <span className="text-xs text-gray-500 animate-pulse">typing...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Simulated Message Being Typed */}
                    <div className="bg-white rounded-lg p-3 border border-gray-200 animate-pulse">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                            <span>Active conversation</span>
                            <div className="flex-1 h-2 bg-gray-200 rounded animate-pulse"></div>
                            <MessageCircle className="w-4 h-4 text-blue-500 animate-bounce" />
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: 'Screen Share',
            icon: Monitor,
            content: (
                <div className="p-6">
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg h-40 flex flex-col relative overflow-hidden">
                        {/* Screen Content Animation */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 animate-pulse"></div>

                        {/* Simulated Screen Content */}
                        <div className="flex-1 p-4 relative">
                            {/* Header Bar */}
                            <div className="bg-gray-700 rounded h-6 mb-2 flex items-center px-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-yellow-500 rounded-full ml-1 animate-pulse delay-100"></div>
                                <div className="w-2 h-2 bg-green-500 rounded-full ml-1 animate-pulse delay-200"></div>
                                <div className="flex-1 ml-4 h-2 bg-gray-600 rounded animate-pulse delay-300"></div>
                            </div>

                            {/* Content Blocks */}
                            <div className="grid grid-cols-2 gap-2 mb-2">
                                <div className="bg-blue-600 rounded h-8 animate-slide-left"></div>
                                <div className="bg-purple-600 rounded h-8 animate-slide-right"></div>
                            </div>

                            {/* Text Lines */}
                            <div className="space-y-1">
                                <div className="bg-gray-600 rounded h-2 w-3/4 animate-loading-bar"></div>
                                <div className="bg-gray-600 rounded h-2 w-1/2 animate-loading-bar delay-200"></div>
                                <div className="bg-gray-600 rounded h-2 w-2/3 animate-loading-bar delay-400"></div>
                            </div>

                            {/* Floating Elements */}
                            <div className="absolute top-8 right-4 w-4 h-4 bg-yellow-500 rounded-full animate-float"></div>
                            <div className="absolute bottom-8 left-8 w-3 h-3 bg-pink-500 rounded-full animate-float delay-500"></div>
                        </div>

                        {/* Live Indicator */}
                        <div className="absolute top-2 right-2 flex items-center space-x-1 bg-red-500 rounded px-2 py-1">
                            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                            <span className="text-xs text-white">LIVE</span>
                        </div>

                        {/* Screen Share Icon */}
                        <div className="absolute bottom-4 right-4">
                            <Share2 className="w-8 h-8 text-white animate-bounce opacity-50" />
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-center space-x-4">
                        <button className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105">
                            <Monitor className="w-4 h-4 animate-pulse" />
                            <span className="text-sm">Share Screen</span>
                        </button>
                        <button className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105">
                            <span className="text-sm">Stop Sharing</span>
                        </button>
                    </div>
                </div>
            )
        }
    ];

    // Auto room navigation
    useEffect(() => {
        if (autoNavigate && !isPaused) {
            const interval = setInterval(() => {
                setCurrentRoom(prev => (prev + 1) % rooms.length);
            }, 6000); // Change room every 6 seconds

            return () => clearInterval(interval);
        }
    }, [isPaused, autoNavigate]);

    // Auto-add chat messages for animation
    useEffect(() => {
        const messages = [
            'Thanks for joining!',
            'Great presentation today!',
            'Can you share the slides?',
            'Looking forward to next meeting',
            'Perfect timing!',
            'Love the new features!',
            'See you tomorrow!',
            'Excellent work team!'
        ];

        const interval = setInterval(() => {
            if (currentRoom === 1) {
                setIsTyping(true);
                setTimeout(() => {
                    setIsTyping(false);
                    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                    const users = ['Charlie', 'Dave', 'Emma', 'Frank', 'Grace'];
                    const randomUser = users[Math.floor(Math.random() * users.length)];

                    const newMsg = {
                        id: Date.now(),
                        user: randomUser,
                        message: randomMessage,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        sending: false
                    };

                    setChatMessages(prev => [...prev.slice(-4), newMsg]);

                    // Show notification
                    const notification = {
                        id: Date.now(),
                        user: randomUser,
                        message: randomMessage
                    };
                    setNotifications(prev => [...prev, notification]);

                    // Remove notification after 3 seconds
                    setTimeout(() => {
                        setNotifications(prev => prev.filter(n => n.id !== notification.id));
                    }, 3000);
                }, 2000);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [currentRoom]);

    // Pause auto-navigation on manual interaction
    const handleManualNavigation = (direction) => {
        setIsPaused(true);
        if (direction === 'left') {
            setCurrentRoom(currentRoom > 0 ? currentRoom - 1 : rooms.length - 1);
        } else {
            setCurrentRoom(currentRoom < rooms.length - 1 ? currentRoom + 1 : 0);
        }

        // Resume auto-navigation after 10 seconds if autoNavigate is enabled
        if (autoNavigate) {
            setTimeout(() => setIsPaused(false), 10000);
        }
    };

    const handleRoomClick = (index) => {
        if (autoNavigate) {
            setIsPaused(true);
        }
        setCurrentRoom(index);

        // Resume auto-navigation after 10 seconds if autoNavigate is enabled
        if (autoNavigate) {
            setTimeout(() => setIsPaused(false), 10000);
        }
    };

    const navigateRoom = (direction) => {
        handleManualNavigation(direction);
    };

    return (
        <div className={`relative ${className}`}>
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="bg-gray-100 px-4 py-3 flex items-center justify-between border-b">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse delay-100"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse delay-200"></div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                            {React.createElement(rooms[currentRoom].icon, { className: "w-4 h-4 text-gray-600" })}
                            <span className="text-sm text-gray-600">{rooms[currentRoom].title}</span>
                        </div>
                    </div>
                    {showControls && (
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => navigateRoom('left')}
                                className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                                onClick={() => navigateRoom('right')}
                                className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                            >
                                <ChevronRight className="w-4 h-4 text-gray-600" />
                            </button>
                            {/* Auto-navigation indicator */}
                            {autoNavigate && (
                                <div className={`w-2 h-2 rounded-full transition-colors ${isPaused ? 'bg-red-500' : 'bg-green-500 animate-pulse'
                                    }`}></div>
                            )}
                        </div>
                    )}
                </div>
                <div className="transition-all duration-500 ease-in-out transform">
                    {rooms[currentRoom].content}
                </div>
            </div>

            {/* Room indicators */}
            <div className="flex justify-center mt-4 space-x-2">
                {rooms.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleRoomClick(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentRoom ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                    />
                ))}
            </div>

            {/* Auto-navigation status */}
            {autoNavigate && (
                <div className="flex justify-center mt-2">
                    <div className={`text-xs px-2 py-1 rounded-full transition-all duration-300 ${isPaused ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                        }`}>
                        {isPaused ? 'Auto-nav paused' : 'Auto-navigating'}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomShowcase;