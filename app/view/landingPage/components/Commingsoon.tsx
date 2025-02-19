"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HoverEffectText = ({ text1, text2, imageSrc }: { text1: string; text2: string; imageSrc: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  const imageWidth = 384; 
  const hoverGap = imageWidth / 2 - 200; 

  return (
    <div className="flex items-center cursor-pointer relative space-x-[10px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* First Part of Text */}
      <motion.span
        initial={{ x: 0 }}
        animate={{ x: isHovered ? -hoverGap : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {text1}
      </motion.span>

      {/* Image Container (Expands on hover) */}
      <motion.div
        className="flex items-center justify-center overflow-hidden"
        initial={{ width: 0 }}
        animate={{ width: isHovered ? imageWidth - 80 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <AnimatePresence>
          {isHovered && (
            <motion.img
              src={imageSrc}
              alt="Preview"
              className="w-96 h-28 rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Second Part of Text */}
      <motion.span
        initial={{ x: 0 }}
        animate={{ x: isHovered ? hoverGap : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {text2}
      </motion.span>
    </div>
  );
};

const Commingsoon = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center space-y-300 bg-black text-white text-[130px] font-semibold">
      <HoverEffectText text1="Real" text2="Gen" imageSrc="/Landingpage/commingsoon/hover-1.png" />
      <HoverEffectText text1="Text to" text2="Video" imageSrc="/Landingpage/commingsoon/hover-2.png" />
      <HoverEffectText text1="3D" text2="Creations" imageSrc="/Landingpage/commingsoon/hover-3.png" />
      <HoverEffectText text1="Sketch to" text2="Image" imageSrc="/Landingpage/commingsoon/hover-4.png" />
    </div>
  );
};

export default Commingsoon;
