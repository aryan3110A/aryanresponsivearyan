'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

const ArtGallery = () => {
  const images = [
    { id: 1, src: '/generated2.png' },
    { id: 2, src: '/generated4.png' },
    { id: 3, src: '/generated2.png' },
    { id: 4, src: '/generated5.png' },
    { id: 5, src: '/generated4.png' },
    { id: 6, src: '/generated2.png' },
  ];

  const CARD_WIDTH = 300; // width of each card
  const GAP = 32; // 8 * 4 (gap-8 in Tailwind)
  const SINGLE_SET_WIDTH = images.length * (CARD_WIDTH + GAP);

  return (
    <div className="min-h-screen  relative flex flex-col items-center overflow-hidden">
      {/* Radial Gradient Background */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-[radial-gradient(circle,_rgba(38,138,255,0.6)_0%,_rgba(38,138,255,1)_50%)] z-10 opacity-10" />

      {/* Top Curve */}
      <img 
        src="/curveup.png" 
        alt="Curve Up" 
        className="absolute top-[128px] left-0 w-full z-20"
      />

      {/* Title with Poppins Font */}
      <h1 className={`text-5xl font-medium text-center text-white tracking-wide py-8 z-20 absolute top-0 ${poppins.className}`}>
  Art Gallery
</h1>

      {/* Gallery container */}
      <div className="absolute bottom-[120px] w-full overflow-hidden z-10">
        <motion.div
          className="flex gap-4 relative z-20"
          animate={{
            x: [-SINGLE_SET_WIDTH / 2, -SINGLE_SET_WIDTH - SINGLE_SET_WIDTH / 2]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop"
          }}
          style={{
            width: 'max-content',
            display: 'flex'
          }}
        >
          {[...images, ...images, ...images].map((image, index) => (
            <div
              key={`image-${index}`}
              className="flex-shrink-0 relative z-10"
              style={{ width: `${CARD_WIDTH}px` }}
            >
              <div className="relative h-[350px] overflow-hidden shadow-2xl">
                <img
                  src={image.src}
                  alt={`Artwork ${image.id}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6" />
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Curve */}
      <img src="/curvedown.png" alt="Curve Down" className="absolute bottom-[23px] left-0 w-full z-20" />
      
    </div>
  );
};

export default ArtGallery;
