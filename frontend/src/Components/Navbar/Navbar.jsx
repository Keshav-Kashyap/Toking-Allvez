import React from 'react'
import {  Navigate, useNavigate } from "react-router-dom";

import { HomeNavbarItems,LandingNavbarItems } from './NavbarItems';

const Navbar = (props) => {
     const routeTo = useNavigate();
    
      
  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 flex items-center">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                                    <span className="text-white font-bold text-lg">T</span>
                                </div>
                                <span className="text-xl font-semibold text-gray-900">Toking Allvez</span>
                            </div>
                        </div>
{props.home ? <HomeNavbarItems/> :<LandingNavbarItems/> }
                        
                       
            


                    </div>

                </div>
            </nav>
            </>
  )
}

export default Navbar