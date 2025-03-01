"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

// Define the Partner interface
interface Partner {
  name: string;
  logo: string;
}

// Define the partners array
const partners: Partner[] = [
  {
    name: "Google Cloud",
    logo: "/Landingpage/Partners/Google-Cloud-Logo.png",
  },
  {
    name: "Wildchild Studios",
    logo: "/Landingpage/Partners/wildchildstudio.png",
  },
  {
    name: "MI AI",
    logo: "/Landingpage/Partners/Mistral AI.png",
  },
  {
    name: "Hugging Face",
    logo: "/Landingpage/Partners/Hugging_Face.png",
  },
  // Duplicate partners to create infinite scroll effect
  {
    name: "Google Cloud",
    logo: "/Landingpage/Partners/Google-Cloud-Logo.png",
  },
  {
    name: "Wildchild Studios",
    logo: "/Landingpage/Partners/wildchildstudio.png",
  },
  {
    name: "MI AI",
    logo: "/Landingpage/Partners/Mistral AI.png",
  },
  {
    name: "Hugging Face",
    logo: "/Landingpage/Partners/Hugging_Face.png",
  },
];

export function PartnersSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scrollSpeed = 1;
    let scrollAmount = 0;

    const scroll = () => {
      scrollAmount += scrollSpeed;
      if (scrollAmount >= scrollContainer.scrollWidth / 2) {
        scrollAmount = 0;
      }
      scrollContainer.scrollLeft = scrollAmount;
      requestAnimationFrame(scroll);
    };

    requestAnimationFrame(scroll);
  }, []);

  return (
    <section className="w-full bg-black py-20 pb-52">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-6xl font-bold ">
          <span className="text-white">Our </span>
          <span className="bg-gradient-to-r from-[#5AD7FF] to-[#656BF5] bg-clip-text text-transparent">
            Partners
          </span>
        </h2>

        <div className="relative overflow-hidden ">
          {/* Left gradient mask */}
          <div className="absolute left-0 z-10 h-full w-52 overflow-visible px-52 bg-gradient-to-r from-black to-transparent" />

          {/* Right gradient mask */}
          <div className="pointer-events-none absolute right-0 z-10 h-full w-52 overflow-hidden px-52 bg-gradient-to-r from-transparent to-black" />

          {/* Scrolling container */}
          <div
            ref={scrollRef}
            className="flex gap-40 overflow-hidden whitespace-nowrap py-8"
          >
            {partners.map((partner, idx) => (
              <div
                key={`${partner.name}-${idx}`}
                className="flex min-w-[300px] items-center justify-center"
              >
                <div className="w-full h-24 bg-white rounded-xl flex items-center justify-center overflow-hidden">
                  <Image
                    src={partner.logo || "/placeholder.svg"}
                    alt={partner.name}
                    width={560} // Adjust the width as needed
                    height={80}
                    className="max-h-16 w-auto object-contain"
                    
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
