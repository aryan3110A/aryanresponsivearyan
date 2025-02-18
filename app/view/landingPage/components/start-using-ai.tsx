'use client'
import Image from "next/image";
import { Poppins } from "next/font/google";

// Initialize Poppins font
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500"] });

export default function StartUsingAi() {
  return (
    <div 
      className="relative w-full h-[404px] overflow-hidden"
      style={{
        background: `linear-gradient(to bottom, 
          rgba(0, 0, 0, 1) 20%, 
          rgba(54, 95, 174, 0.5) 105%, 
          rgba(85, 165, 175, 0.75) 180%)`
      }}
    >
      {/* Content Container */}
      <div className="relative z-10 flex items-center justify-between w-full h-full px-16">
        
        {/* Left Content */}
        <div className="absolute-left[100px] max-w-xl">
          <h1
            className={`text-[36px] font-medium text-white leading-[1.1] ${poppins.className}`}
          >
            Where Words Get Wild,<br /> And AI Makes the Magic <br /> Real!
          </h1>
        </div>

        {/* Right Content - GIF */}
        <div className="hidden md:block absolute right-[0px]">
          <Image
            src="/Landingpage/AIView/bubbles.gif"
            alt="Creative visual effect"
            width={743}
            height={285}
            className="rounded-l-[33px] w-[743px] h-[300px]"
          />
        </div>
      </div>
    </div>
  );
}
