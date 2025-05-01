"use client";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { getImageUrl } from "@/routes/imageroute";
import { User } from "lucide-react";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500"] });

export default function StartUsingAi() {
  return (
    <div>
      {/* Hero Section */}
      <div
        className="relative w-full h-[500px] overflow-hidden flex items-center mb:flex-col mb:h-auto mb:pt-10 mb:pb-6"
        style={{
          background: `linear-gradient(to bottom, 
            rgba(0, 0, 0, 1) 20%, 
            rgba(10, 20, 40, 1) 100%)`
        }}
      >
        {/* Text & CTA */}
        <div className="w-1/2 pl-24 pr-8 mb:w-full mb:px-6 mb:text-center">
          <h1
            className={`text-white text-[40px] font-semibold leading-tight ${poppins.className} mb:text-[22px] mb:leading-snug`}
          >
            Where Words Get Wild,<br /> And AI Makes the Magic Real!
          </h1>

          <button
            className="mt-6 px-6 py-2 rounded-full bg-black/20 border border-white/20 text-base font-medium border-t-[#acacac] border-b-[#6A0DAD] hover:border-t-[#6A0DAD] hover:border-b-[#acacac] 
              text-transparent bg-clip-text bg-gradient-to-r from-[#5AD7FF] to-[#656BF5] shadow-[inset_0px_0px_8px_rgba(255,255,255,0.2)] 
              transition-all duration-500 ease-in-out hover:text-white mb:mt-4 mb:px-5 mb:py-1.5 mb:text-sm mb:text-white"
          >
            Start using AI →
          </button>
        </div>

        {/* Desktop Image */}
        <div className="absolute right-0 bottom-0 h-[484px] w-[410px] mb:hidden">
          <Image
            src={getImageUrl("landingpage", "usingai")}
            alt="Creative AI Visual"
            fill
            className="object-contain object-right"
          />
        </div>

        {/* Mobile Image */}
        <div className="hidden mb:block w-full px-6 mt-6">
          <Image
            src={getImageUrl("landingpage", "usingai")}
            alt="Creative AI Visual"
            width={500}
            height={500}
            className="w-[400px] h-[400px]"
          />
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="w-full bg-black text-white py-10 px-16 mb:px-6 flex justify-between items-center mb:flex-col mb:items-start mb:gap-4">
        {/* Text */}
        <h2 className="text-[24px] font-semibold mb:text-base mb:text-center mb:w-full  ">
          Join our newsletter to
           keep up to date with us!
        </h2>

        {/* Form */}
        <div className="flex items-center gap-3 mt-0 mb:w-full mb:flex-col mb:items-stretch">
          {/* Email input with icon */}
          <div className="flex items-center bg-black border border-white/30 rounded-full px-4 py-2 w-[320px] mb:w-full">
            <User className="text-white w-4 h-4 mr-2 opacity-60" />
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-transparent outline-none text-white text-sm w-full placeholder:text-white/50"
            />
          </div>

          {/* Subscribe button */}
          <button className="bg-gradient-to-r from-[#5A8FFF] to-[#75ACFF] px-6 py-2 rounded-full text-white font-semibold text-sm w-fit mb:w-full">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}
