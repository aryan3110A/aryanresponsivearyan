"use client"

import Image from "next/image"

export default function FeaturesSection() {
  return (
    <section className="mb-24">
      <div className="flex items-center gap-4 mb-8">
      <button className="w-[169px] h-[43px] bg-gradient-to-r from-[#5AD7FF] via-[#5AD7FF] to-[#656BF5] text-black text-[30px] font-bold rounded-[10px] flex items-center justify-center">
  Features
</button>




        <p className="text-white text-sm md:text-base font-[18px]">Create and explore image, video and audio AI powered tools</p>
      </div>

      <div className="flex justify-center items-center gap-6 flex-wrap">

        <div className="bg-[#F3F3F3] rounded-[45px] overflow-hidden w-full h-[251px] max-w-[395px] mx-auto relative transition-all duration-100 hover:border-b-8 hover:border-gray-300/100 border-2 border-black">

          <div className="p-8 h-full flex flex-col justify-between">
            <div className="bg-blue-500 text-white px-4 py-2 rounded-[7px] text-lg inline-block w-fit font-bold">
              Text to image
            </div>

            <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
              <Image 
                src="/home/tokyo_magni.svg"
                alt="Text to Image illustration"
                width={150}
                height={150}
              />
            </div>

            <button className="flex items-center text-black px-5 py-3 rounded-full transition-all w-fit group">
              <svg width="35" height="35" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:text-[#5AD7FF]">
                <path d="M5 3L19 12L5 21V3Z" fill="currentColor" />
              </svg>
              <span className="text-[20px] font-medium group-hover:bg-gradient-to-r group-hover:from-[#5AD7FF] group-hover:to-[#656BF5] group-hover:bg-clip-text group-hover:text-transparent">Run</span>
            </button>
          </div>
        </div>

        {/* Other Feature Cards */}
        <div className="w-[395px] h-[251px] ">
          <Image src="/home/card2.svg" alt="Text to 3D" width={395} height={251} className="w-full h-full" />
        </div>

        <div className="w-[395px] h-[251px]">
          <Image src="/home/card3.svg" alt="Sketch to Image" width={395} height={251} className="w-full h-full" />
        </div>

        <div className="w-[395px] h-[251px]">
          <Image src="/home/card4.svg" alt="Text to Video" width={395} height={251} className="w-full h-full" />
        </div>

        <div className="w-[395px] h-[251px]">
          <Image src="/home/card5.svg" alt="Real Time Generation" width={395} height={251} className="w-full h-full" />
        </div>

        <div className="w-[395px] h-[251px]">
          <Image src="/home/card6.svg" alt="Up Scale" width={395} height={251} className="w-full h-full" />
        </div>
      </div>
    </section>
  )
}