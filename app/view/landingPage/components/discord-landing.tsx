"use client";
import { useState } from "react";
import Image from "next/image";
import { Poppins } from "next/font/google";

// Initialize Poppins font
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500"] });

export default function DiscordLanding() {
  const [discordIcon, setDiscordIcon] = useState("/Landingpage/DiscordView/discord.svg"); // Default icon

  return (
    <div className="relative w-full h-[404px] mx-auto overflow-hidden z-40">
      {/* Background Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, 
            rgba(54, 95, 174, 0.5) 50%, 
            rgba(0, 0, 0, 1) 100%)`,
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 flex items-center justify-between w-full h-full px-10">
        {/* Left Content */}
        <div className="max-w-lg absolute left-[200px]">
          <h1 className={`text-[36px] font-medium text-white mb-6 ${poppins.className}`}>
            Be part of a creative community!
          </h1>
          <button
            className="flex items-center justify-center gap-2 w-[245px] h-[51px] rounded-[18px] text-white bg-[#5865F2] hover:bg-white hover:text-[#5865F2] hover:shadow-none transition duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5865F2]"
            onMouseEnter={() => setDiscordIcon("/Landingpage/DiscordView/discord.svg")} 
            onMouseLeave={() => setDiscordIcon("./Landingpage/DiscordView/discord.svg")} 
          >
            <Image src={discordIcon} alt="Discord Icon" width={24} height={24} />
            <span className="text-base font-medium">Join Discord Server</span>
          </button>
        </div>

        {/* Right Content - GIF */}
        <div className="hidden md:block w-[299px] h-[291px] absolute right-[200px]">
          <Image
            src="/landingpage/DiscordView/dc_view.gif"
            alt="Creative visual effect"
            width={299}
            height={291}
            className="rounded-[56px]"
          />
        </div>
      </div>
    </div>
  );
}
