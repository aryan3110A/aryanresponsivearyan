'use client';
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

interface ImageItem {
  id: number;
  src: string;
  alt: string;
  title?: string;
}

interface InfiniteImageScrollProps {
  images: ImageItem[];
  speed?: number; // pixels per second
  className?: string;
}

const InfiniteImageScroll: React.FC<InfiniteImageScrollProps> = ({ 
  images, 
  speed = 50, 
  className = '' 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const containerWidth = scrollContainer.scrollWidth;

    const animate = () => {
      scrollPosition += speed / 60; // Convert to per-frame movement
      
      // Reset position when we've scrolled the full width of one set
      if (scrollPosition >= containerWidth / 2) {
        scrollPosition = 0;
      }
      
      scrollContainer.style.transform = `translateX(-${scrollPosition}px)`;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [speed]);

  // Duplicate images for seamless loop
  const duplicatedImages = [...images, ...images];

  return (
    <div className={`overflow-hidden ${className}`}>
      <div 
        ref={scrollRef}
        className="flex gap-6 py-4"
        style={{ width: 'max-content' }}
      >
        {duplicatedImages.map((image, index) => (
          <div 
            key={`${image.id}-${index}`}
            className="flex-shrink-0"
          >
            <div className="relative w-64 h-80 rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg">
              <Image
                src={image.src}
                alt={image.alt}
                width={256}
                height={320}
                className="w-full h-full object-cover"
              />
              {image.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-3">
                  <h3 className="text-white text-sm font-medium">{image.title}</h3>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfiniteImageScroll;