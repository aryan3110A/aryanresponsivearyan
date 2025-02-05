"use client";
import React, { useState } from "react";

const Navigation = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  return (
    <div className="flex items-center justify-between p-2 rounded-[50px] border-[1px] border-[#b5a5a5] w-[55vw] text-white mt-5  
                    bg-white/10 backdrop-blur-lg bg-opacity-30 shadow-lg">
      {/* Logo */}
      <div>
        <span className="font-bold text-lg ml-4">Logo</span>
      </div>

      {/* Features Dropdown */}
      <div className="relative">
        <span
          onClick={() => toggleDropdown("features")}
          className="cursor-pointer px-4 py-2 flex items-center gap-1 hover:text-transparent hover:bg-gradient-to-l hover:from-[#5AD7FF] hover:to-[#656BF5] hover:bg-clip-text font-poppins"
        >
          Features 
          <img width="7" height="7" src="https://img.icons8.com/ios-filled/50/40C057/filled-circle.png" alt="filled-circle" className="ml-2"/>
        </span>
        {activeDropdown === "features" && (
          <ul className="absolute left-0 mt-5 w-56 justify-center bg-black/80 border-[0.2px] rounded-lg shadow-lg">
            <li className="px-4 py-2 cursor-pointer text-white hover:text-transparent hover:bg-gradient-to-l hover:from-[#5AD7FF] hover:to-[#656BF5] hover:bg-clip-text">Text to image</li>
            <li className="px-4 py-2 cursor-pointer text-white hover:text-transparent hover:bg-gradient-to-l hover:from-[#5AD7FF] hover:to-[#656BF5] hover:bg-clip-text">Text to video (coming soon)</li>
            <li className="px-4 py-2 cursor-pointer text-white hover:text-transparent hover:bg-gradient-to-l hover:from-[#5AD7FF] hover:to-[#656BF5] hover:bg-clip-text">Sketch to image (coming soon)</li>
            <li className="px-4 py-2 cursor-pointer text-white hover:text-transparent hover:bg-gradient-to-l hover:from-[#5AD7FF] hover:to-[#656BF5] hover:bg-clip-text">Real-time generation (coming soon)</li>
          </ul>
        )}
      </div>

      {/* Templates Dropdown */}
      <div className="relative">
        <span
          onClick={() => toggleDropdown("templates")}
          className="cursor-pointer px-4 py-2 flex items-center gap-1 hover:text-transparent hover:bg-gradient-to-l hover:from-[#5AD7FF] hover:to-[#656BF5] hover:bg-clip-text"
        >
          Templates 
          <img width="7" height="7" src="https://img.icons8.com/ios-filled/50/40C057/filled-circle.png" alt="filled-circle" className="ml-2"/>
        </span>
        {activeDropdown === "templates" && (
          <ul className="absolute left-0 mt-5 w-56 bg-black/80 border-[0.2px] rounded-lg shadow-lg">
            <li className="px-4 py-2 cursor-pointer text-white hover:text-transparent hover:bg-gradient-to-l hover:from-[#5AD7FF] hover:to-[#656BF5] hover:bg-clip-text">Text to image</li>
            <li className="px-4 py-2 cursor-pointer text-white hover:text-transparent hover:bg-gradient-to-l hover:from-[#5AD7FF] hover:to-[#656BF5] hover:bg-clip-text">Text to video (coming soon)</li>
            <li className="px-4 py-2 cursor-pointer text-white hover:text-transparent hover:bg-gradient-to-l hover:from-[#5AD7FF] hover:to-[#656BF5] hover:bg-clip-text">Sketch to image (coming soon)</li>
            <li className="px-4 py-2 cursor-pointer text-white hover:text-transparent hover:bg-gradient-to-l hover:from-[#5AD7FF] hover:to-[#656BF5] hover:bg-clip-text">Real-time generation (coming soon)</li>
          </ul>
        )}
      </div>

      {/* Other Links */}
      <div>
        <span className="px-4 py-2 hover:text-transparent hover:bg-gradient-to-l hover:from-[#5AD7FF] hover:to-[#656BF5] hover:bg-clip-text ">Pricing</span>
      </div>
      <div>
        <span className="px-4 py-2 hover:text-transparent hover:bg-gradient-to-l hover:from-[#5AD7FF] hover:to-[#656BF5] hover:bg-clip-text">Art Station</span>
      </div>

      {/* Get Started Button */}
      <div>
      <button className="relative bg-black/30 border border-white/20 rounded-full px-6 py-3 text-lg font-medium border-t-[0.2px] border-t-white border-b-[black]
                    text-transparent bg-clip-text bg-gradient-to-r from-[#5AD7FF] to-[#656BF5] shadow-[inset_0px_0px_8px_rgba(255,255,255,0.2)] 
                    transition-all duration-500 ease-in-out hover:text-white hover:shadow-[0px_0px_15px_rgba(90,215,255,0.8)] 
                    
                    before:absolute before:inset-0 before:rounded-full before:border-[1.5px] before:border-white/20 before:transition-all before:duration-500 
                    hover:before:border-[#5AD7FF] hover:before:shadow-[0px_0px_12px_rgba(90,215,255,0.7)]">
  Get Started
</button>

      </div>
    </div>
  );
};

export default Navigation;
