"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Cards from "./Cards";
import { useRef } from "react"

const cardData = [
  {
    title: "Food and Cuisine",
    description: "Artistic representations of food, drinks, and culinary delights.",
    image: "/market.png",
  },
  {
    title: "Games & Entertainment",
    description: "Game assets, characters, and interactive world designs.",
    image: "/vr.png",
  },
  {
    title: "Artisan Patterns",
    description: "Decorative motifs, patterns, and textures.",
    image: "/art.png",
  },
  {
    title: "Cartoon Cosmos",
    description: "Playful, animated, and character-driven art.",
    image: "/space.png",
  },
  {
    title: "Product Branding",
    description: "Branding your product.",
    image: "/product_branding.png",
  },
  {
    title: "Inspired",
    description: "Hand-drawn sketches and illustration.",
    image: "/skatches.png",
  },
]

export default function Slider() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  // Create a transform for the slider progress that moves in steps
  const sliderProgress = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1], // Input range for each card
    ["0%", "20%", "40%", "60%", "99%", "100%"], // Output range for slider position
  )

  const cardTransforms = cardData.slice(1).map((_, index) => {
    const actualIndex = index + 1
    const cardProgress = useTransform(
      scrollYProgress,
      [actualIndex * 0.15, actualIndex * 0.15 + 0.05, actualIndex * 0.15 + 0.1],
      [0, 0.5, 1],
    )

    const y = useTransform(cardProgress, [0, 1], [100, 0])

    const opacity = useTransform(cardProgress, [0, 0.3, 1], [0, 1, 1])

    return { y, opacity, cardProgress }
  })

  return (
    <div
      ref={containerRef}
      className="relative min-h-[600vh] bg-gradient-to-b from-[#050505] to-[#151515] flex flex-col items-center"
    >
      {/* First card - Sticky and centered */}
      <div className="sticky top-0 h-screen w-full flex justify-center items-center">
        <div className="w-full max-w-7xl mx-auto px-4">
          <Cards
            title={cardData[0].title}
            description={cardData[0].description}
            image={cardData[0].image}
            progress={sliderProgress}
          />
        </div>
      </div>

      {/* Scrolling cards that stack on first card */}
      <div className="relative mt-[100vh]">
        {cardData.slice(1).map((card, index) => {
          const actualIndex = index + 1
          const { y, opacity } = cardTransforms[index]
          return (
            <motion.div
              key={actualIndex}
              className="fixed top-0 left-0 w-full h-screen flex justify-center items-center"
              style={{
                y,
                opacity,
                zIndex: actualIndex,
              }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
            >
              <div className="w-full max-w-7xl mx-auto px-4">
                <Cards title={card.title} description={card.description} image={card.image} progress={sliderProgress} />
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

