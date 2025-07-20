import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/LandingPage.css';
import RoomShowcase from '../common/RoomShowcase'; // Import the new component

const Hero = () => {
    const routeTo = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
                    {/* Left Column - Text Content */}
                    <div className="mb-12 lg:mb-0">
                        <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                            Video meetings for everyone
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            Connect, collaborate and celebrate from anywhere with Toking Allvez.
                            Secure, reliable, and easy to use video conferencing solution.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => routeTo('/auth')}
                                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                                Get started for free
                            </button>
                            <button
                                onClick={() => routeTo('/alajd123')}
                                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
                            >
                                Start a meeting
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Room Showcase */}
                    <div className="relative">
                        <RoomShowcase
                            autoNavigate={true}
                            showControls={true}
                            className=""
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;