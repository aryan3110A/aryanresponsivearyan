"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

// Featured articles data
const featuredArticles = [
  {
    id: 1,
    title: "15 Seconds of Film Generation –  AI Powered Short Video Creation",
    author: "GEMMA",
    authorTag: "AI",
    content:
      "The future of filmmaking is here with AI-powered film generation. Imagine creating a 15-second cinematic scene within minutes using AI-driven tools. From text-to-video models to AI-assisted editing, studios can now generate short films with dynamic characters, realistic environments, and seamless transitions. Tools like RunwayML, Pika Labs, and Google's Lumiere are pushing the boundaries of AI-driven storytelling, enabling filmmakers to bring their visions to life with minimal effort. The next era of filmmaking is all about speed, automation, and limitless creativity.",
    image: "/blog/blog1.png",
  },
  {
    id: 2,
    title: "AI Powered Comic Generation – A New Era of Digital Storytelling",
    author: "GEMMA",
    authorTag: "AI",
    content:
      "AI is revolutionizing the comic industry by enabling artists to generate unique illustrations, dialogue, and storylines effortlessly. With AI-powered comic generators like MidJourney, Stable Diffusion, and Leonardo AI, creators can design characters, backgrounds, and even entire graphic novels in a fraction of the time. Whether you're a solo artist or a studio looking to speed up production, AI-assisted storytelling offers endless possibilities. Explore how AI is transforming the comic industry and how you can use it to create your next masterpiece.",
    image: "/blog/blog2.png",
  },
  {
    id: 3,
    title: "AI in Character Building – Crafting Unique Personalities with AI",
    author: "GEMMA",
    authorTag: "AI",
    content:
      "Character design has never been easier with AI-driven tools. From video games to animated films, AI can generate detailed character models, personalities, and backstories based on simple prompts. Whether you need a 3D avatar, a lifelike animated character, or a concept for a new protagonist, AI-powered tools like MetaHuman Creator, Artbreeder, and DeepMotion provide endless creative opportunities. Learn how AI is redefining character creation and giving artists new ways to experiment with design, storytelling, and personality development.",
    image: "/blog/blog3.png",
  },
  {
    id: 4,
    title: "AI-Powered Visual Effects – Transforming Post-Production Workflows",
    author: "GEMMA",
    authorTag: "AI",
    content:
      "Post-production workflows are being revolutionized by AI technologies that can automate tedious tasks and enhance creative possibilities. From automatic rotoscoping and color grading to scene extensions and digital doubles, AI tools are enabling VFX artists to achieve high-quality results in a fraction of the time. Discover how studios are implementing AI solutions to streamline their pipelines and deliver stunning visual effects for films, TV shows, and commercials.",
    image: "/blog/blog4.png",
  },
];

export default function FeaturedArticles() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate featured articles
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === featuredArticles.length - 1 ? 0 : prev + 1
      );
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Navigation functions for featured articles
  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === featuredArticles.length - 1 ? prev : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? prev : prev - 1));
  };

  const gridPatternStyle = {
    backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px), 
                      linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
    backgroundSize: "40px 40px",
  };

  return (
    <div
      className="relative w-full h-[600px] mb-60"
      style={{
        backgroundImage: `url('/Blog/background.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="absolute inset-0 opacity-20 font-poppins"
        style={gridPatternStyle}
      ></div>
      <div className="lg:max-w-7xl md:max-w-5xl mx-auto px-4 py-10 -mt-[60]">
        <div className="w-full max-w-4xl  bg-black rounded-lg overflow-hidden mx-auto my-auto border border-gray-800 max-h-[100%] relative">
          <div className="p-6 pt-8">
            <h2 className="text-2xl font-bold mb-4">Featured articles</h2>
            <div className="relative">
              <div className="overflow-hidden rounded-lg relative">
                <div
                  className="transition-transform duration-500 ease-in-out font-poppins"
                  style={{
                    transform: `translateX(-${currentSlide * 100}%)`,
                    display: "flex",
                  }}
                >
                  {featuredArticles.map((article, index) => (
                    <div key={article.id} className="min-w-full">
                      <div className="bg-black rounded-lg overflow-hidden">
                        <div className="relative">
                          <Image
                            src={article.image || "/placeholder.svg"}
                            alt={article.title}
                            className="w-full aspect-video object-contain rounded-lg px-4"
                            width={640}
                            height={320}
                            priority={index === 0}
                            quality={90}
                          />
                        </div>
                        <div className="px-4 -mt-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-blue-400 uppercase text-sm font-semibold">
                              {article.author}
                            </span>
                            <span className="text-blue-400 uppercase text-sm font-semibold">
                              {article.authorTag}
                            </span>
                          </div>
                          <h3 className="text-lg md:text-3xl font-bold mb-2 font-poppins">
                            {article.title}
                          </h3>
                          <p className="text-gray-300 text-sm font-poppins">
                            {article.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation buttons positioned on the card */}
          {currentSlide > 0 && (
            <button
              onClick={prevSlide}
              className="absolute left-4 top-[40%]  transform -translate-y-1/2 bg-white rounded-full p-4 text-black z-10"
              aria-label="Previous slide"
            >
              <ChevronLeft size="2rem" />
            </button>
          )}

          {currentSlide < featuredArticles.length - 1 && (
            <button
              onClick={nextSlide}
              className="absolute right-4 top-[40%] transform -translate-y-1/2 bg-white rounded-full p-4 text-black z-10"
              aria-label="Next slide"
            >
              <ChevronRight size="2rem" />
            </button>
          )}
        </div>
        <div className="flex justify-center mt-6 space-x-2">
          {featuredArticles.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full ${
                currentSlide === index ? "bg-white" : "bg-gray-600"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
