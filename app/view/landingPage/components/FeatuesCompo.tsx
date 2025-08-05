'use client'

import { useState } from 'react';
import Image from 'next/image';

// The cards array with proper categorization
const cards = [
  // Image Generation Features
  { src: '/Landingpage/features/1.png', title: 'Text to Image', col: 2, row: 1 },
  { src: '/Landingpage/features/2.png', title: 'Image to Image', col: 1, row: 1 },
  { src: '/Landingpage/features/3.png', title: 'AI Sticker Generation', col: 1, row: 1 },
  { src: '/Landingpage/features/4.png', title: 'Character Generation', col: 1, row: 1 },
  { src: '/Landingpage/features/5.png', title: 'Character Swap', col: 1, row: 1 },
  { src: '/Landingpage/features/6.png', title: 'In Paint', col: 2, row: 1 },
  { src: '/Landingpage/features/7.png', title: 'Live Portrait', col: 1, row: 1 },
  { src: '/Landingpage/features/8.png', title: 'Facial Expression', col: 1, row: 1 },
  { src: '/Landingpage/features/9.png', title: 'Image Upscale', col: 1, row: 1 },
  { src: '/Landingpage/features/10.png', title: 'Remove Background', col: 1, row: 1 },
  
  // Branding Kit Features
  { src: '/Landingpage/features/11.png', title: 'Logo Generation', col: 1, row: 1 },
  { src: '/Landingpage/features/12.png', title: 'Product Generation', col: 2, row: 1 },
  { src: '/Landingpage/features/13.png', title: 'Mockup Generation', col: 2, row: 1 },
  { src: '/Landingpage/features/14.png', title: 'Product with Model', col: 2, row: 1 },
  { src: '/Landingpage/features/15.png', title: 'Add Music in Image', col: 2, row: 1 },
  
  // Video Generation Features
  { src: '/Landingpage/features/16.png', title: 'Text to Video', col: 1, row: 2 },
  { src: '/Landingpage/features/17.png', title: 'Video Generation', col: 2, row: 1 },
  { src: '/Landingpage/features/18.png', title: 'Video Editing', col: 1, row: 2 },
  { src: '/Landingpage/features/19.png', title: 'Video Enhancement', col: 2, row: 2 },
  { src: '/Landingpage/features/20.png', title: 'Video Effects', col: 1, row: 1 },
  
  // Audio Generation Features
  { src: '/Landingpage/features/21.png', title: 'Text to Music', col: 2, row: 2 },
  { src: '/Landingpage/features/22.png', title: 'Audio Generation', col: 1, row: 1 },
  { src: '/Landingpage/features/23.png', title: 'Music Generation', col: 2, row: 1 },
  { src: '/Landingpage/features/24.png', title: 'Audio Editing', col: 2, row: 1 },
  { src: '/Landingpage/features/25.png', title: 'Sound Effects', col: 2, row: 2 },
  
  // Filming Tools Features
  { src: '/Landingpage/features/26.png', title: 'Camera Tools', col: 2, row: 2 },
  { src: '/Landingpage/features/27.png', title: 'Film Equipment', col: 1, row: 1 },
  { src: '/Landingpage/features/28.png', title: 'Filming Tools', col: 1, row: 2 },
  { src: '/Landingpage/features/29.png', title: 'Video Production', col: 2, row: 1 },
  { src: '/Landingpage/features/30.png', title: 'Film Making', col: 2, row: 1 },
  
  // 3D Generation Features
  { src: '/Landingpage/features/31.png', title: '3D Generation', col: 2, row: 2 },
  { src: '/Landingpage/features/32.png', title: '3D Modeling', col: 1, row: 1 },
  { src: '/Landingpage/features/33.png', title: '3D Design', col: 1, row: 1 },
];

interface AiToolsGridProps {
  activeCategory?: string;
}

export default function AiToolsGrid({ activeCategory = 'All' }: AiToolsGridProps) {
  const [showAll, setShowAll] = useState(false);
  
  // Filter cards based on active category
  const filteredCards = activeCategory === 'All' 
    ? cards 
    : cards.filter(card => {
        switch (activeCategory) {
          case 'Image Generation':
            return ['Text to Image', 'Image to Image', 'AI Sticker Generation', 'Character Generation', 'Character Swap', 'In Paint', 'Live Portrait', 'Facial Expression', 'Image Upscale', 'Remove Background'].includes(card.title);
          case 'Video Generation':
            return ['Text to Video', 'Video Generation', 'Video Editing', 'Video Enhancement', 'Video Effects'].includes(card.title);
          case 'Branding Kit':
            return ['Logo Generation', 'Product Generation', 'Mockup Generation', 'Product with Model', 'Add Music in Image'].includes(card.title);
          case 'Audio Generation':
            return ['Text to Music', 'Audio Generation', 'Music Generation', 'Audio Editing', 'Sound Effects'].includes(card.title);
          case 'Filming Tools':
            return ['Camera Tools', 'Film Equipment', 'Filming Tools', 'Video Production', 'Film Making'].includes(card.title);
          case '3D Generation':
            return ['3D Generation', '3D Modeling', '3D Design'].includes(card.title);
          default:
            return true;
        }
      });
  
  const visibleCards = showAll ? filteredCards : filteredCards.slice(0, 10);

  return (
    <div className="w-[1100px] border border-gray-700 rounded-3xl p-10  overflow-hidden bg-black mx-auto">
      <div className="w-full h-full">
        <div
          className={`
            grid 
            grid-cols-4 
            gap-4
            auto-rows-[160px]
          `}
        >
          {visibleCards.map((card, idx) => (
            <div
              key={idx}
              className={`relative group bg-slate-900 rounded-lg overflow-hidden`}
              style={{
                gridColumn: `span ${card.col} / span ${card.col}`,
                gridRow: `span ${card.row} / span ${card.row}`,
              }}
            >
              <Image
                src={card.src}
                alt={card.title}
                fill
                className="object-cover"
                sizes="25vw"
                priority={idx < 10}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 text-white text-base font-semibold drop-shadow-md">
                {card.title}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center py-6">
          {!showAll && filteredCards.length > 10 && (
            <button
              onClick={() => setShowAll(true)}
              className="bg-[#23234c] text-white font-medium px-8 py-3 rounded-lg transition hover:bg-[#383877]"
            >
              View All
            </button>
          )}
        </div>
      </div>
    </div>
  );
}