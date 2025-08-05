"use client";
import React from "react";
import Image from "next/image";

const All = () => {
  // Single grid with all 12 cards
  const features = [
    {
      id: 1,
      title: "Text to Image",
      image: "/Landingpage/animated-tabs/imag1.png",
      aspectRatio: "aspect-[4/3]"
    },
    {
      id: 2,
      title: "Image to Image", 
      image: "/Landingpage/animated-tabs/imag2.png",
      aspectRatio: "aspect-[4/3]"
    },
    {
      id: 3,
      title: "AI Sticker Generation",
      image: "/Landingpage/animated-tabs/imag3.png",
      aspectRatio: "aspect-[4/3]"
    },
    {
      id: 4,
      title: "Character Generation",
      image: "/Landingpage/animated-tabs/imag4.png",
      aspectRatio: "aspect-[4/3]"
    },
    {
      id: 5,
      title: "Character Swap",
      image: "/Landingpage/animated-tabs/imag5.png",
      aspectRatio: "aspect-[4/3]"
    },
    {
      id: 6,
      title: "In Paint",
      image: "/Landingpage/animated-tabs/imag6.png",
      aspectRatio: "aspect-[4/3]"
    },
    {
      id: 7,
      title: "Live Portrait",
      image: "/Landingpage/animated-tabs/imag1.png",
      aspectRatio: "aspect-[4/3]"
    },
    {
      id: 8,
      title: "Facial Expression",
      image: "/Landingpage/animated-tabs/imag2.png",
      aspectRatio: "aspect-[4/3]"
    },
    {
      id: 9,
      title: "Image Upscale",
      image: "/Landingpage/animated-tabs/imag3.png",
      aspectRatio: "aspect-[4/3]"
    },
    {
      id: 10,
      title: "Remove Background",
      image: "/Landingpage/animated-tabs/imag4.png",
      aspectRatio: "aspect-[4/3]"
    },
    {
      id: 11,
      title: "Logo Generation",
      image: "/Landingpage/animated-tabs/imag5.png",
      aspectRatio: "aspect-[4/3]"
    },
    {
      id: 12,
      title: "Product Generation",
      image: "/Landingpage/animated-tabs/imag6.png",
      aspectRatio: "aspect-[4/3]"
    }
  ];

  return (
    <div className="w-full bg-black py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Single Grid - 3 columns, 4 rows */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="group relative bg-black/30 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30"
            >
              {/* Image Container - Smaller size */}
              <div className={`relative w-full overflow-hidden ${feature.aspectRatio}`}>
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content - Positioned at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-white text-sm font-semibold group-hover:text-purple-300 transition-colors duration-300">
                  {feature.title}
                </h3>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <button className="relative bg-black/40 border border-white/30 rounded-full px-6 py-2 text-sm font-medium text-white hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20">
            View All
          </button>
        </div>
      </div>
    </div>
  );
};

export default All;
