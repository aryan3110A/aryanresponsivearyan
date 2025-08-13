'use client'

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import MagicBento from './magic-bento';

// The cards array with proper categorization
type CardItem = {
  src: string;
  title: string;
  category: 'Image Generation' | 'Video Generation' | 'Branding Kit' | 'Audio Generation' | 'Filming Tools' | '3D Generation';
  col: number;
  row: number;
  fit?: 'cover' | 'contain';
  containerClassName?: string;
  imgClassName?: string;
  imageWidth?: number;
  imageHeight?: number;
};
const cards: CardItem[] = [
  // Image Generation
  { src: '/Landingpage/features/text to image.png', title: 'Text to Image', category: 'Image Generation', col: 1, row: 3, fit:'cover' },
  { src: '/Landingpage/features/image to image.png', title: 'Image to Image', category: 'Image Generation', col: 1, row: 2, fit:'cover' },
  { src: '/Landingpage/features/sticker.png', title: 'Sticker Generation', category: 'Image Generation', col: 2, row: 2, fit:'cover' },
  { src: '/Landingpage/features/character gen.png', title: 'Character Generation', category: 'Image Generation', col: 2, row: 3, fit:'cover' },
  { src: '/Landingpage/features/chatracter swap.png', title: 'Character Swap', category: 'Image Generation', col: 1, row: 3 },
  { src: '/Landingpage/features/in paint.png', title: 'Inpaint', category: 'Image Generation', col: 2, row: 2 },
  { src: '/Landingpage/features/live portrtait.png', title: 'Live Portrait', category: 'Image Generation', col: 1, row: 2, fit:'cover' },
  { src: '/Landingpage/features/facial expe.png', title: 'Facial Expression', category: 'Image Generation', col: 2, row: 3, fit:'cover' },
  { src: '/Landingpage/features/image upscale.png', title: 'Image Upscale', category: 'Image Generation', col: 1, row: 2, fit:'cover' },
  { src: '/Landingpage/features/background remo.png', title: 'Remove Background', category: 'Image Generation', col: 1, row: 2, fit:'cover' },

  // Branding Kit
  { src: '/Landingpage/features/logo generation.png', title: 'Logo Generation', category: 'Branding Kit', col: 2, row: 2, fit:'cover' },
  { src: '/Landingpage/features/prouct display.png', title: 'Product Display', category: 'Branding Kit', col: 2, row: 3, fit:'cover' },
  { src: '/Landingpage/features/mockup.png', title: 'Mockup Generation', category: 'Branding Kit', col: 2, row: 3, fit:'cover' },
  { src: '/Landingpage/features/Product with Models.png', title: 'Product with Models', category: 'Branding Kit', col: 2, row: 5, fit:'cover' },

  // Video Generation
  { src: '/Landingpage/features/text to video.png', title: 'Text to Video', category: 'Video Generation', col: 2, row: 2, fit:'cover' },
  { src: '/Landingpage/features/image to video.png', title: 'Image to Video', category: 'Video Generation', col: 2, row: 2, fit:'cover' },
  { src: '/Landingpage/features/face swap.png', title: 'Face Swap', category: 'Video Generation', col: 1, row: 2, fit:'cover' },
  { src: '/Landingpage/features/charcater swap.png', title: 'Character Swap', category: 'Video Generation', col: 2, row: 2, fit:'cover' },
  { src: '/Landingpage/features/vfx.png', title: 'VFX', category: 'Video Generation', col: 2, row: 2, fit:'cover' },
  { src: '/Landingpage/features/video enhancement.png', title: 'Video Enhancement', category: 'Video Generation', col: 1, row: 2, fit:'cover' },

  // Audio Generation
  { src: '/Landingpage/features/text to music.png', title: 'Text to Music', category: 'Audio Generation', col: 2, row: 4, fit:'cover' },
  { src: '/Landingpage/features/audio to music.png', title: 'Audio to Music', category: 'Audio Generation', col: 2, row: 3, fit:'cover' },
  { src: '/Landingpage/features/lyrics to music.png', title: 'Lyrics to Music', category: 'Audio Generation', col: 2, row: 4, fit:'cover' },

  // Filming Tools
  { src: '/Landingpage/features/storyboard.png', title: 'Storyboard', category: 'Filming Tools', col: 2, row: 2, fit:'cover' },
  { src: '/Landingpage/features/film generation.png', title: 'Film Generation', category: 'Filming Tools', col: 2, row: 3, fit:'cover' },
  { src: '/Landingpage/features/comic generation.png', title: 'Comic Generation', category: 'Filming Tools', col: 2, row: 2, fit:'cover' },

  // 3D Generation
  { src: '/Landingpage/features/textto3d.png', title: 'Text to 3D', category: '3D Generation', col: 2, row: 2 },
  { src: '/Landingpage/features/text to 3d.png', title: 'Image to 3D', category: '3D Generation', col: 2, row: 2, fit:'cover' },
];

interface AiToolsGridProps {
  activeCategory?: string;
}

export default function AiToolsGrid({ activeCategory = 'All' }: AiToolsGridProps) {
  const [showAll, setShowAll] = useState(false);
  
  // Filter cards based on active category (robust, category-based)
  const filteredCards = activeCategory === 'All'
    ? cards
    : cards.filter(card => card.category === activeCategory);
  
  const visibleCards = showAll ? filteredCards : filteredCards.slice(0, 10);

  return (
    <div className="w-full max-w-[1300px] border border-gray-700 rounded-3xl p-10 overflow-hidden bg-gradient-to-br via-transparent to-transparent mx-auto">
      <div className="w-full h-full">
        <MagicBento
          textAutoHide={true}
          enableStars={true}
          enableSpotlight={true}
          enableBorderGlow={true}
          enableTilt={true}
          enableMagnetism={false}
          clickEffect={false}
          spotlightRadius={200}
          particleCount={0}
          glowColor="255, 255, 255"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className={`
                grid 
                grid-cols-4 
                gap-4
                grid-flow-dense
                auto-rows-[150px]
              `}
            >
              {visibleCards.map((card, idx) => (
                <div
                  key={card.title + idx}
                  className={`card relative group bg-slate-900 rounded-lg overflow-hidden ${card.containerClassName ?? ''}`}
                  style={{
                    gridColumn: `span ${card.col} / span ${card.col}`,
                    gridRow: `span ${card.row} / span ${card.row}`,
                  }}
                >
                  {card.imageWidth && card.imageHeight ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image
                        src={card.src}
                        alt={card.title}
                        width={card.imageWidth}
                        height={card.imageHeight}
                        className={`${card.imgClassName ?? ''}`}
                        priority={idx < 10}
                      />
                    </div>
                  ) : (
                    <Image
                      src={card.src}
                      alt={card.title}
                      fill
                      className={`${card.fit === 'contain' ? 'object-contain' : 'object-cover'} ${card.imgClassName ?? ''}`}
                      sizes="25vw"
                      priority={idx < 10}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {/* Extra gradient behind title for better readability */}
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-3 left-4 text-white text-md md:text-lg font-normal drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {card.title}
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </MagicBento>
        <div className="flex justify-center py-6">
          {!showAll && filteredCards.length > 10 && (
            <button
              onClick={() => setShowAll(true)}
              className="bg-[#006AFF] text-white font-medium px-8 py-3 rounded-full transition hover:bg-[#383877]"
            >
              View All
            </button>
          )}
        </div>
      </div>
    </div>
  );
}