"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { getImageUrl } from "@/routes/imageroute";
import { initParticlesEngine } from "@tsparticles/react";


const HoverEffectText = ({ text1, text2, imageSrc }: { text1: string; text2: string; imageSrc: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  const imageWidth = 384;
  const hoverGap = imageWidth / 2 - 200;

  return (
    <div
      className="flex items-center cursor-pointer relative space-x-[10px]"
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
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    });
  }, []);

  return (
    <div className="relative h-screen flex flex-col items-center justify-center text-white font-semibold bg-gradient-to-br from-[#050505] via-[#0f0f25] to-[#121212] overflow-hidden">

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none" />



      {/* Particles */}
      <Particles
        id="tsparticles"
        options={{
          fullScreen: { enable: false },
          background: { color: { value: "transparent" } },
          particles: {
            color: { value: "#ffffff" },
            number: { value: 50 },
            size: { value: 2 },
            move: { enable: true, speed: 0.3 },
            opacity: { value: 0.2 },
          },
        }}
        className="absolute inset-0 z-0"
      />

      {/* Text Content */}
      <div className="z-10 flex flex-col items-center justify-center space-y-20 text-center text-6xl md:text-[130px]">
        <HoverEffectText text1="Real" text2="Gen" imageSrc={getImageUrl("landingpage", "realtimegen")} />
        <HoverEffectText text1="Text to" text2="Video" imageSrc={getImageUrl("landingpage", "realtimegen")} />
        <HoverEffectText text1="3D" text2="Creations" imageSrc={getImageUrl("landingpage", "realtimegen")} />
        <HoverEffectText text1="Sketch to" text2="Image" imageSrc={getImageUrl("landingpage", "sketchtoimage")} />
      </div>

      {/* Top Fade */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black via-transparent to-transparent z-20" />

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black via-transparent to-transparent z-20" />
    </div>
  );
};

export default Commingsoon;
