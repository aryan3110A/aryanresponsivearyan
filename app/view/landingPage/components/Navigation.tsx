"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react"; // Import icons

const Navigation = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  return (
 
   
    <div className="flex items-center justify-between p-2 rounded-[50px] border-[1px] border-[#b5a5a5] w-[55vw] text-white">
      {/* Logo */}
      <div>
        <span className="font-bold text-lg ml-4">Logo</span>
      </div>

      {/* Features Dropdown */}
      <div className="relative">
        <span
          onClick={() => toggleDropdown("features")}
          className="cursor-pointer px-4 py-2 flex items-center gap-1 hover:text-transparent hover:bg-gradient-to-l hover:from-[#5AD7FF] hover:to-[#656BF5] hover:bg-clip-text"
        >
          Features <img width="7" height="7" src="https://img.icons8.com/ios-filled/50/40C057/filled-circle.png" alt="filled-circle" className="ml-2"/>
        </span>
        {activeDropdown === "features" && (
          <ul className="absolute left-0 mt-2 w-56 justify-center bg-white border-[0.2px] rounded-lg shadow-lg bg-transparent mt-4">
            <li className="px-4 py-2  cursor-pointer text-white hover:text-transparent hover:bg-gradient-to-l hover:from-[#5AD7FF] hover:to-[#656BF5] hover:bg-clip-text">Text to image</li>
            <li className="px-4 py-2  cursor-pointer text-white hover:text-transparent hover:bg-gradient-to-l hover:from-[#5AD7FF] hover:to-[#656BF5] hover:bg-clip-text">Text to video (coming soon)</li>
            <li className="px-4 py-2  cursor-pointer text-white hover:text-transparent hover:bg-gradient-to-l hover:from-[#5AD7FF] hover:to-[#656BF5] hover:bg-clip-text">Sketch to image (coming soon)</li>
            <li className="px-4 py-2  cursor-pointer text-white hover:text-transparent hover:bg-gradient-to-l hover:from-[#5AD7FF] hover:to-[#656BF5] hover:bg-clip-text">Real-time generation (coming soon)</li>
          </ul>
        )}
      </div>

      {/* Templates Dropdown */}
      <div className="relative">
        <span
          onClick={() => toggleDropdown("templates")}
          className="cursor-pointer px-4 py-2 flex items-center gap-1 hover:text-transparent hover:bg-gradient-to-l hover:from-[#5AD7FF] hover:to-[#656BF5] hover:bg-clip-text"
        >
          Templates <img width="7" height="7" src="https://img.icons8.com/ios-filled/50/40C057/filled-circle.png" alt="filled-circle" className="ml-2"/>
        </span>
        {activeDropdown === "templates" && (
          <ul className="absolute left-0 mt-2 w-56 bg-white border-[0.2px] rounded-lg shadow-lg bg-transparent mt-4">
            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-white hover:text-transparent hover:bg-gradient-to-l hover:from-[#5AD7FF] hover:to-[#656BF5] hover:bg-clip-text">Text to image</li>
            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-white hover:text-transparent hover:bg-gradient-to-l hover:from-[#5AD7FF] hover:to-[#656BF5] hover:bg-clip-text">Text to video (coming soon)</li>
            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-white hover:text-transparent hover:bg-gradient-to-l hover:from-[#5AD7FF] hover:to-[#656BF5] hover:bg-clip-text">Sketch to image (coming soon)</li>
            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-white hover:text-transparent hover:bg-gradient-to-l hover:from-[#5AD7FF] hover:to-[#656BF5] hover:bg-clip-text">Real-time generation (coming soon)</li>
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
      
      <button className="relative bg-transparent border-[1px] border-[#444445] bg-gradient-to-r from-[#5AD7FF] to-[#656BF5] bg-clip-text text-transparent px-6 py-3 rounded-3xl border-r-[#918f8f] border-l-[#6522D1] border-b-[#6522D1] transition-all duration-700 ease-[cubic-bezier(0.4, 0, 0.2, 1)] hover:text-white hover:border-l-[#918f8f] hover:border-r-[#6522D1] hover:border-t-[#6522D1] hover:shadow-[0_4px_20px_rgba(101,34,209,0.5)] 
  before:absolute before:-inset-2 before:rounded-3xl before:bg-gradient-to-r before:from-[#5AD7FF] before:to-[#656BF5] before:blur-xl before:opacity-0 before:transition-opacity before:duration-700 hover:before:opacity-100 before:-z-10">
  Get Started
</button>
      </div>
    </div>

  );

};

export default Navigation;