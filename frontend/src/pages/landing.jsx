import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import Features from "../Components/LandingPage/Features";
import Stats from "../Components/LandingPage/Stats";
import CTA from "../Components/LandingPage/CTA";
import Hero from "../Components/LandingPage/Hero";

import "../App.css"

export default function ProfessionalLandingPage() {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true); // loader state

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (token) {
        navigate("/home");
      } else {
        setCheckingAuth(false); // show landing content
      }
    };

    // Simulate delay (optional, gives time for animation or smooth experience)
    setTimeout(checkAuth, 1000);
  }, [navigate]);

  if (checkingAuth) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col"> {/* ✅ Make wrapper flex */}
      <div className="flex-grow"> {/* ✅ Allow this part to take full remaining height */}
        <Navbar />
        <Hero />
        <Features />
        <Stats />
        <CTA />
      </div>

      <Footer /> {/* ✅ This will always stay at the bottom */}
    </div>
  );
}
