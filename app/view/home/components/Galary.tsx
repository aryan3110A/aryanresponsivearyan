"use client";

import React, { useState } from "react";

const images = [
  "./home/gallery/Group 6.png",
  "./home/gallery/Group 7.png",
  "./home/gallery/Group 8.png",
  "./home/gallery/Group 9.png",
  "./home/gallery/Group 10.png",
  "./home/gallery/Group 11.png",
  "./home/gallery/Group 12.png",
  "./home/gallery/Group 13.png",
  "./home/gallery/Group 14.png",
  "./home/gallery/Group 15.png",
  "./home/gallery/Group 16.png",
  "./home/gallery/Group 17.png",
  "./home/gallery/Group 18.png",
  "./home/gallery/Group 23.png",
  "./home/gallery/Group 24.png",
  "./home/gallery/Group 25.png",
  "./home/gallery/Group 26.png",
  "./home/gallery/Group 27.png",
  "./home/gallery/Group 28.png",
  "./home/gallery/Group 29.png",
  "./home/gallery/Group 30.png",
];

const Galary = () => {
  const [visibleImages, setVisibleImages] = useState(images.slice(0, 10)); // Initially load 10 images
  const [loadedCount, setLoadedCount] = useState(10); // Track how many images are loaded

  const loadMoreImages = () => {
    const nextBatch = images.slice(loadedCount, loadedCount + 10);
    setVisibleImages((prevImages) => [...prevImages, ...nextBatch]); // Append new images
    setLoadedCount((prevCount) => prevCount + 10); // Update loaded count
  };

  return (
    <div className="p-12 font-poppins flex flex-col items-center">
      {/* Title */}
      <div className="mb-6">
        <span className="text-2xl font-poppins">See what others are creating</span>
      </div>

      {/* Masonry Layout using CSS Columns */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {visibleImages.map((src, index) => (
          <div key={index} className="relative break-inside-avoid">
            <img
              src={src}
              alt={`Gallery Image ${index + 1}`}
              className="w-full rounded-lg transition-transform duration-300 hover:scale-105"
            />
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {loadedCount < images.length && (
        <button
          onClick={loadMoreImages}
          className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium transition-transform duration-300 hover:scale-105"
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default Galary;
