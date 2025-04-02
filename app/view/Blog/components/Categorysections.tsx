"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

// Category sections data
const categorySections = [
  {
    id: "image-creation",
    title: "Image Creation",
    articles: [
      {
        title:
          "The Art of AI: How AI-Generated Images are Changing Digital Creativity",
        image: "https://placehold.co/320x200/gray/white",
      },
      {
        title:
          "Stable Diffusion vs. MidJourney: Which AI Image Tool is Best for You?",
        image: "https://placehold.co/320x200/gray/white",
      },
      {
        title:
          "From Text to Masterpiece: The Best AI Prompt Strategies for Stunning Images",
        image: "https://placehold.co/320x200/gray/white",
      },
      {
        title: "AI Image Generators: A Comprehensive Comparison for 2025",
        image: "https://placehold.co/320x200/gray/white",
      },
      {
        title: "Creating Photorealistic Portraits with AI: Tips and Techniques",
        image: "https://placehold.co/320x200/gray/white",
      },
      {
        title: "The Future of AI in Image Generation: What's Next?",
        image: "https://placehold.co/320x200/gray/white",
      },
      {
        title: "The Future of AI in Image Generation: What's Next?",
        image: "https://placehold.co/320x200/gray/white",
      },
    ],
  },
  {
    id: "video-animations",
    title: "Video & Animations",
    articles: [
      {
        title: "How AI is Revolutionizing Video Production in 2025",
        image: "https://placehold.co/400x200/gray/white",
      },
      {
        title: "AI-Generated Animations: The Future of Motion Graphics",
        image: "https://placehold.co/400x200/gray/white",
      },
      {
        title:
          "From Text to Short Film: How AI Can Create a 15-Second Video in Minutes",
        image: "https://placehold.co/400x200/gray/white",
      },
      {
        title: "Character Animation with AI: Creating Lifelike Digital Actors",
        image: "https://placehold.co/400x200/gray/white",
      },
      {
        title: "AI Video Editing Tools: Automating Post-Production Workflows",
        image: "https://placehold.co/400x200/gray/white",
      },
      {
        title: "The Future of AI in Image Generation: What's Next?",
        image: "https://placehold.co/400x200/gray/white",
      },
      {
        title: "The Future of AI in Image Generation: What's Next?",
        image: "https://placehold.co/400x200/gray/white",
      },
      {
        title: "The Future of AI in Image Generation: What's Next?",
        image: "https://placehold.co/400x200/gray/white",
      },
    ],
  },
  {
    id: "sound-designing",
    title: "Sound Designing",
    articles: [
      {
        title: "From Concept to Reality: AI's Role in 3D Asset Creation",
        image: "https://placehold.co/320x200/gray/white",
      },
      {
        title:
          "AI and Virtual Environments: How Studios Are Using AI for Film and Game Worlds",
        image: "https://placehold.co/320x200/gray/white",
      },
      {
        title: "The Best AI Tools for 3D Artists: A Complete Guide",
        image: "https://placehold.co/320x200/gray/white",
      },
      {
        title: "AI-Generated Product Designs: Revolutionizing Brand Identity",
        image: "https://placehold.co/320x200/gray/white",
      },
      {
        title: "Creating Brand Consistency with AI: Tools and Techniques",
        image: "https://placehold.co/320x200/gray/white",
      },
      {
        title: "The Future of AI in Image Generation: What's Next?",
        image: "https://placehold.co/320x200/gray/white",
      },
      {
        title: "The Future of AI in Image Generation: What's Next?",
        image: "https://placehold.co/320x200/gray/white",
      },
      {
        title: "The Future of AI in Image Generation: What's Next?",
        image: "https://placehold.co/320x200/gray/white",
      },
    ],
  },
  {
    id: "product-branding",
    title: "Product Branding",
    articles: [
      {
        title: "From Concept to Reality: AI's Role in 3D Asset Creation",
        image: "https://placehold.co/320x200/gray/white",
      },
      {
        title:
          "AI and Virtual Environments: How Studios Are Using AI for Film and Game Worlds",
        image: "https://placehold.co/320x200/gray/white",
      },
      {
        title: "The Best AI Tools for 3D Artists: A Complete Guide",
        image: "https://placehold.co/320x200/gray/white",
      },
      {
        title: "AI-Generated Product Designs: Revolutionizing Brand Identity",
        image: "https://placehold.co/320x200/gray/white",
      },
      {
        title: "Creating Brand Consistency with AI: Tools and Techniques",
        image: "https://placehold.co/320x200/gray/white",
      },
      {
        title: "The Future of AI in Image Generation: What's Next?",
        image: "https://placehold.co/320x200/gray/white",
      },
      {
        title: "The Future of AI in Image Generation: What's Next?",
        image: "https://placehold.co/320x200/gray/white",
      },
      {
        title: "The Future of AI in Image Generation: What's Next?",
        image: "https://placehold.co/320x200/gray/white",
      },
    ],
  },
];

export default function CategorySections() {
  // State for category sections
  const [scrollPositions, setScrollPositions] = useState({
    "image-creation": 0,
    "video-animations": 0,
    "sound-designing": 0,
    "product-branding": 0,
  });

  // Generic scroll functions for category sections
  const scrollRight = (sectionId: string, maxLength: number) => {
    setScrollPositions((prev) => ({
      ...prev,
      [sectionId]: Math.min(
        prev[sectionId as keyof typeof prev] + 1,
        maxLength - 3
      ),
    }));
  };

  const scrollLeft = (sectionId: string) => {
    setScrollPositions((prev) => ({
      ...prev,
      [sectionId]: Math.max(prev[sectionId as keyof typeof prev] - 1, 0),
    }));
  };

  return (
    <div className=" md:px-0 lg:px-6 py-10">
      {categorySections.map((section) => (
        <div
          key={section.id}
          className=" macbook:max-w-[1100px] md:max-w-[1200px] md:min-w-[1000px] lg:max-w-[1600px] mb-20  md:px-6 lg:px-12"
        >
          <div className="flex flex-col md:flex-row items-start gap-8 pl-10">
            <div className="flex flex-col items-start mb-4 w-full md:w-64 flex-shrink-0">
              <h2 className="text-2xl font-bold mb-3">{section.title}</h2>
              <button className="flex items-center justify-center bg-[#FFFFFF] hover:bg-[#DADCE0] text-[#1A73E8] hover:text-[#1474F1] py-2 px-6 rounded-md transition-colors">
                <span className="mr-2">See posts</span>
                <ChevronRight size="1rem" />
              </button>
            </div>

            <div className="relative w-full font-poppins">
              <div className="overflow-hidden font-poppins">
                <div
                  className="flex gap-4 transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${
                      scrollPositions[
                        section.id as keyof typeof scrollPositions
                      ] * 320
                    }px)`,
                  }}
                >
                  {section.articles.map((article, index) => (
                    <div
                      key={index}
                      className="w-[300px] flex-shrink-0 font-poppins"
                    >
                      <h3 className="text-lg font-semibold h-[6rem] line-clamp-3 overflow-hidden font-poppins mb-0">
                        {article.title}
                      </h3>
                      <Image
                        src={
                          article.image ||
                          "/placeholder.svg?height=200&width=300" ||
                          "/placeholder.svg"
                        }
                        alt={article.title}
                        width={300}
                        height={200}
                        className="h-[200px] w-[300px] object-cover rounded-lg bg-gray-700"
                        quality={85}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {scrollPositions[section.id as keyof typeof scrollPositions] >
                0 && (
                <button
                  onClick={() => scrollLeft(section.id)}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 text-black z-10 shadow-lg"
                  aria-label="Scroll left"
                >
                  <ChevronLeft size="1.5rem" />
                </button>
              )}

              {section.articles.length > 3 &&
                scrollPositions[section.id as keyof typeof scrollPositions] <
                  section.articles.length - 3 && (
                  <button
                    onClick={() =>
                      scrollRight(section.id, section.articles.length)
                    }
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 text-black z-10 shadow-lg"
                    aria-label="Scroll right"
                  >
                    <ChevronRight size="1.5rem" />
                  </button>
                )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
