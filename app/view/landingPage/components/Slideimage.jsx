"use client";
import React from "react";
import { motion } from "framer-motion";

const SlideImage = () => {
  // Define your text rows: each sub-array is a row, each string is a word
  const textRows = [
    ["Alice", "Bob", "Charlie", "Daisy", "Evan", "Fiona"],
    ["Grace", "Hank", "Ivy", "Jack", "Kara", "Leo"],
    ["Mia", "Nate", "Olivia", "Paul", "Quinn", "Rose"],
    ["Sam", "Tina", "Uma", "Victor", "Wendy", "Zane"],
  ];

  return (
    <div className="text-white flex w-full overflow-hidden relative mt-14 bg-black">
      {/* Left Side - Text Animation */}
      <div className="flex flex-col gap-9 mt-14 w-1/3 overflow-hidden">
        {textRows.map((row, index) => (
          <motion.div
            key={index}
            className="flex whitespace-nowrap"
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
          >
            {row.map((name, i) => (
              <span key={i} className="text-4xl mx-4">
                {name}
              </span>
            ))}
            {/* Duplicate for smooth looping */}
            {row.map((name, i) => (
              <span key={`dup-${i}`} className="text-4xl mx-4">
                {name}
              </span>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Center Image */}
      <div className="relative w-1/3 flex justify-center">
        <img src="/Core/logomain.png" alt="new" className="relative z-10 w-auto" />
      </div>

      {/* Right Side - Image Animation */}
      <div className="w-1/3 flex flex-col gap-4 overflow-hidden">
        {[...Array(4)].map((_, row) => (
          <motion.div 
            key={row}
            className="flex"
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
          >
            {[...Array(6)].map((_, i) => (
              <img
                key={i}
                src={`./image${i + 1}.png`}
                className="w-20 h-20 mx-2"
                alt=""
              />
            ))}
            {[...Array(6)].map((_, i) => (
              <img
                key={`dup-${i}`}
                src={`./image${i + 1}.png`}
                className="w-20 h-20 mx-2"
                alt=""
              />
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SlideImage;
