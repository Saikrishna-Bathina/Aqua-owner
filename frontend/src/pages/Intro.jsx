import React from "react";
import Navbar from "../components/Navbar";
import ImageCarsoul from "../components/ImageCarsoul";
import { useNavigate } from "react-router-dom";

const Intro = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/orders"); // Already logged in
    } else {
      navigate("/login"); // Not logged in
    }
  };

  return (
    <div className="flex flex-col min-h-screen">

      {/* Hero Section */}
      <div className="p-10 bg-gradient-to-b from-blue-100 via-white to-white-50 flex items-center justify-center px-6">
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 leading-tight">
              Welcome to <span className="text-blue-500">PureDrop Owner</span>
            </h1>
            <p className="text-gray-700 text-lg">
              Delivering pure, refreshing water to your doorstep.
            </p>
            <button
              onClick={handleGetStarted}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-md"
            >
              Get Started
            </button>
          </div>

          {/* Right Image (optional) */}
        </div>
      </div>

      {/* Carousel Section */}
      <div className="bg-white px-4">
        <ImageCarsoul />
      </div>
    </div>
  );
};

export default Intro;
