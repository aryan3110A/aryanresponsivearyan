"use client";
import React, { useState, useEffect } from "react";

const Navigation = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  return (
    <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between p-2 rounded-[50px] 
      border-[1px] border-white/20 w-[45vw] text-white
      ${scrolled 
        ? 'backdrop-blur-xl bg-black/30 shadow-lg' 
        : 'backdrop-blur-xl bg-black/10 shadow-lg'
      } transition-all duration-300`}>

      {/* (Rest of the component remains the same as previous version) */}
      {/* Logo */}
      <div>
        <span className="font-bold text-lg ml-4">Logo</span>
      </div>

      {/* Features Dropdown */}
      <div className="relative">
        <span
          onClick={() => toggleDropdown("features")}
          className="cursor-pointer px-3 py-1 flex items-center gap-1 hover:text-transparent hover:bg-gradient-to-l hover:from-[#5AD7FF] hover:to-[#656BF5] hover:bg-clip-text font-poppins text-sm "
        >
          Features 
          <img width="7" height="7" src="https://img.icons8.com/ios-filled/50/40C057/filled-circle.png" alt="filled-circle" className="ml-1"/>
        </span>
        {activeDropdown === "features" && (
          <ul className="absolute left-0 mt-4 w-48 justify-center bg-black/80 border-[0.2px] rounded-lg shadow-lg">
            <li className="px-3 py-1.5 cursor-pointer text-sm text-white hover:text-transparent hover:bg-gradient-to-l hover:from-[#5AD7FF] hover:to-[#656BF5] hover:bg-clip-text">Text to image</li>
            <li className="px-3 py-1.5 cursor-pointer text-sm text-white hover:text-transparent hover:bg-gradient-to-l hover:from-[#5AD7FF] hover:to-[#656BF5] hover:bg-clip-text">Text to video (coming soon)</li>
            <li className="px-3 py-1.5 cursor-pointer text-sm text-white hover:text-transparent hover:bg-gradient-to-l hover:from-[#5AD7FF] hover:to-[#656BF5] hover:bg-clip-text">Sketch to image (coming soon)</li>
            <li className="px-3 py-1.5 cursor-pointer text-sm text-white hover:text-transparent hover:bg-gradient-to-l hover:from-[#5AD7FF] hover:to-[#656BF5] hover:bg-clip-text">Real-time generation (coming soon)</li>
          </ul>
        )}
      </div>

      <div className="relative">
        <span
          onClick={() => toggleDropdown("templates")}
          className="cursor-pointer bg-transparent px-3 py-1 flex items-center gap-1 text-sm hover:text-transparent hover:bg-gradient-to-l hover:from-[#5AD7FF] hover:to-[#656BF5] hover:bg-clip-text"
        >
          Templates 
          <img width="7" height="7" src="https://img.icons8.com/ios-filled/50/40C057/filled-circle.png" alt="filled-circle" className="ml-1"/>
        </span>
        {activeDropdown === "templates" && (
          <ul className="absolute left-0 mt-4 w-48 bg-black/80 border-[0.2px] rounded-lg shadow-lg">
            <li className="px-3 py-1.5 cursor-pointer text-sm text-white hover:text-transparent hover:bg-gradient-to-l hover:from-[#5AD7FF] hover:to-[#656BF5] hover:bg-clip-text">Text to image</li>
            <li className="px-3 py-1.5 cursor-pointer text-sm text-white hover:text-transparent hover:bg-gradient-to-l hover:from-[#5AD7FF] hover:to-[#656BF5] hover:bg-clip-text">Text to video (coming soon)</li>
            <li className="px-3 py-1.5 cursor-pointer text-sm text-white hover:text-transparent hover:bg-gradient-to-l hover:from-[#5AD7FF] hover:to-[#656BF5] hover:bg-clip-text">Sketch to image (coming soon)</li>
            <li className="px-3 py-1.5 cursor-pointer text-sm text-white hover:text-transparent hover:bg-gradient-to-l hover:from-[#5AD7FF] hover:to-[#656BF5] hover:bg-clip-text">Real-time generation (coming soon)</li>
          </ul>
        )}
      </div>

      {/* Other Links */}
      <div>
        <span className="px-3 py-1 text-sm hover:text-transparent hover:bg-gradient-to-l hover:from-[#5AD7FF] hover:to-[#656BF5] hover:bg-clip-text">Pricing</span>
      </div>
      <div>
        <span className="px-3 py-1 text-sm hover:text-transparent hover:bg-gradient-to-l hover:from-[#5AD7FF] hover:to-[#656BF5] hover:bg-clip-text">Art Station</span>
      </div>

      {/* Get Started Button */}
      <div>
        <button className="relative bg-black/20 border border-white/20 rounded-full px-5 py-2 text-base font-medium border-t-[0.2px] border-t-white border-b-[black]
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