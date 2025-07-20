import React from 'react'

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center mb-4 md:mb-0">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white font-bold text-lg">T</span>
                        </div>
                        <span className="text-xl font-semibold">Toking Allvez</span>
                    </div>
                    <div className="text-gray-400 text-sm">
                        © 2025 Toking Allvez. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer   