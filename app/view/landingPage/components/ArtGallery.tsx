'use client';
import React from 'react';
import Image from 'next/image';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ 
  subsets: ['latin'], 
  weight: ['400', '700'] 
});

const ArtGallery = () => {
  const galleryImages = [
    { id: 1, src: '/Landingpage/ArtGallery/img1.png' },
    { id: 2, src: '/Landingpage/ArtGallery/img2.png' },
    { id: 3, src: '/Landingpage/ArtGallery/img3.png' },
    { id: 4, src: '/Landingpage/ArtGallery/img4.png' },
    { id: 5, src: '/Landingpage/ArtGallery/img5.png' },
    { id: 6, src: '/Landingpage/ArtGallery/img6.png' },
    { id: 7, src: '/Landingpage/ArtGallery/img7.png' },
    { id: 8, src: '/Landingpage/ArtGallery/img8.png' },
    { id: 9, src: '/Landingpage/ArtGallery/img9.png' },
  ];

  const CARD_WIDTH = 400;
  const CARD_HEIGHT = 750;
  const ANIMATION_SPEED = 15; // Adjust speed (lower = faster)

  return (
    <div className="min-h-screen flex flex-col items-center overflow-hidden bg-black">
      {/* Title */}
      <h1 className={`text-5xl font-medium text-center text-white -mb-96 tracking-wide py-8 z-40 ${poppins.className}`}>
        Art Gallery
      </h1>

      {/* Top Image */}
      <div className="w-full h-full z-30 ">
        <img
          src="/Landingpage/ArtGallery/topimage.png"
          alt="Top Decorative Path"
          className="w-full h-full"
        />
      </div>

      {/* Infinite Scrolling Gallery */}
      <div className="w-full my-10 overflow-hidden relative z-10 -mt-[1025px] -mb-[1260px]">
        <div
          className="flex gap-4 relative animate-scroll"
          style={{
            width: 'max-content',
            display: 'flex',
            animation: `scrollAnimation ${ANIMATION_SPEED}s linear infinite`,
          }}
        >
          {[...galleryImages, ...galleryImages].map((image, index) => (
            <div
              key={`image-${index}`}
              className="flex-shrink-0 relative"
              style={{ width: `${CARD_WIDTH}px` }}
            >
              <div className="relative" style={{ height: `${CARD_HEIGHT}px` }}>
                <Image
                  src={image.src}
                  alt={`Artwork ${image.id}`}
                  width={CARD_WIDTH}
                  height={CARD_HEIGHT}
                  objectFit="cover"
                  className="shadow-2xl rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Image */}
      <div className="w-full h-auto z-30 -mb-56">
        <img
          src="/Landingpage/ArtGallery/bottomimage.png"
          alt="Bottom Decorative Path"
          className="w-full h-auto"
        />
      </div>

      {/* Smooth Scrolling Keyframes */}
      <style jsx>{`
        @keyframes scrollAnimation {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default ArtGallery;
