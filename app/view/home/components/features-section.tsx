"use client"
import { useRouter } from "next/navigation";
import Image from "next/image"
import FeaturesCard from "./features-card";

export default function FeaturesSection() {
   const route = useRouter();


  return (
    <section className="mb-24">
      <div className="flex items-center gap-4 mb-8">
      <button className="ml-20 w-[169px] h-[43px] bg-gradient-to-r from-[#5AD7FF] via-[#5AD7FF] to-[#656BF5] text-black text-[30px] font-bold rounded-[10px] flex items-center justify-center">
  Features
</button>

        <p className="text-white text-sm md:text-base font-[18px]">Create and explore image, video and audio AI powered tools</p>
      </div>

      <div className="flex flex-wrap gap-10 justify-center">
        <FeaturesCard imageSrc="/home/imagegeneration.png" label="run"   />
        <FeaturesCard imageSrc="/home/videogeneratiin.png" label="coming"   />
        <FeaturesCard imageSrc="/home/musicgeneration.png" label="coming"    />
        <FeaturesCard imageSrc="/home/3d.png" label="coming"    />
        <FeaturesCard imageSrc="/home/media.png" label="coming"    />
        <FeaturesCard imageSrc="/home/story.png" label="coming"    />
      </div>
    </section>
  )
}