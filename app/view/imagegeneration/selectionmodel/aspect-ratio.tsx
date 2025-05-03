"use client";

import { useState } from "react";

export default function AspectRatio() {
  const [selectedRatio, setSelectedRatio] = useState<string | null>(null);

  return (
    <div>
      <h3 className="text-white text-lg font-medium mb-3">Aspect ratio</h3>
      <div className="grid grid-cols-2 gap-3 mb:gap-6">
        {/* Individual Aspect Ratio Buttons */}
        <div
          className={`w-[109px] h-[43px] border rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all
            ${
              selectedRatio === "16:9"
                ? "border-[#4a90e2] text-[#4a90e2]"
                : "border-gray-700 text-white hover:border-[#4a90e2]"
            }`}
          onClick={() => setSelectedRatio("16:9")}
        >
          <span>▭</span>
          <span className="text-sm">16:9</span>
        </div>

        <div
          className={`w-[109px] h-[43px] border rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all
            ${
              selectedRatio === "9:16"
                ? "border-[#4a90e2] text-[#4a90e2]"
                : "border-gray-700 text-white hover:border-[#4a90e2]"
            } -ml-8`} // Move left
          onClick={() => setSelectedRatio("9:16")}
        >
          <span>▯</span>
          <span className="text-sm">9:16</span>
        </div>

        <div
          className={`w-[109px] h-[43px] border rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all
            ${
              selectedRatio === "1:1"
                ? "border-[#4a90e2] text-[#4a90e2]"
                : "border-gray-700 text-white hover:border-[#4a90e2]"
            }`}
          onClick={() => setSelectedRatio("1:1")}
        >
          <span>□</span>
          <span className="text-sm">1:1</span>
        </div>

        <div
          className={`w-[109px] h-[43px] border rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all
            ${
              selectedRatio === "5:2"
                ? "border-[#4a90e2] text-[#4a90e2]"
                : "border-gray-700 text-white hover:border-[#4a90e2]"
            } -ml-8`} // Move left
          onClick={() => setSelectedRatio("5:2")}
        >
          <span>▭</span>
          <span className="text-sm">5:2</span>
        </div>

        <div
          className={`w-[109px] h-[43px] border rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all
            ${
              selectedRatio === "4:5"
                ? "border-[#4a90e2] text-[#4a90e2]"
                : "border-gray-700 text-white hover:border-[#4a90e2]"
            }`}
          onClick={() => setSelectedRatio("4:5")}
        >
          <span>▯</span>
          <span className="text-sm">4:5</span>
        </div>

        <div
          className={`w-[109px] h-[43px] border rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all
            ${
              selectedRatio === "4:3"
                ? "border-[#4a90e2] text-[#4a90e2]"
                : "border-gray-700 text-white hover:border-[#4a90e2]"
            } -ml-8`} // Move left
          onClick={() => setSelectedRatio("4:3")}
        >
          <span>▭</span>
          <span className="text-sm">4:3</span>
        </div>
      </div>
    </div>
  );
}
