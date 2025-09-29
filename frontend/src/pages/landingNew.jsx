import React from 'react';
import { Spotlight } from '@/components/ui/spotlight';

const LandingNewPage = () => {
    return (
        <div className="min-h-screen w-full bg-black/[0.96] antialiased bg-grid-white/[0.02] relative flex items-center justify-center py-8 overflow-hidden">
            <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20"
                fill="white"
            />
            
            {/* Radial gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/50 to-black pointer-events-none"></div>
            
            <div className="p-4 max-w-7xl mx-auto relative z-10 w-full text-center">
                <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
                    <span className="bg-gradient-to-b from-neutral-50 via-white/90 to-neutral-400 bg-clip-text text-transparent inline-block">
                        Your space for smart video meetings
                    </span>
                </h1>
                
                <p className="mt-6 font-normal text-sm sm:text-base md:text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed px-4">
                    Connect, collaborate and celebrate from anywhere with Toking Allvez. Secure, reliable, and easy to use video conferencing solution.
                </p>
                
                {/* Premium action buttons */}
                <div className="mt-10 flex gap-4 justify-center flex-wrap">
                    <button className="px-8 py-3 rounded-full bg-gradient-to-b from-white to-neutral-300 text-black font-semibold hover:shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105">
                        Start Meeting
                    </button>
                    <button className="px-8 py-3 rounded-full border border-white/30 text-white font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm">
                        Learn More
                    </button>
                </div>
            </div>
            
            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/[0.96] to-transparent pointer-events-none"></div>
        </div>
    );
}

export default LandingNewPage;