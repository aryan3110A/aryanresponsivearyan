"use client";

import React from "react";
import { Tabs } from "./tabs";
import Image from "next/image";

const TabsSection = () => {
  const tabs = [
    {
      title: "Image Generation",
      value: "image-generation",
      content: (
            <div className="w-full h-full bg-transparent backdrop-blur-xl rounded-2xl border border-white/20 p-3 md:p-4 shadow-2xl">
           <div className="w-full h-full flex flex-col md:flex-row gap-4 justify-start items-start">
             {/* Image */}
                <div className="flex relative h-[400px] md:h-[450px] rounded-xl overflow-hidden">
                <Image
                  src="/Landingpage/animated-tabs/imagegen.png"
                  alt="Image Generation"
                  width={500}
                  height={500}
                  className="w-full h-full object-contain"
                />
              </div>
            
            {/* Content - Parallel from top */}
            <div className="flex-1 flex flex-col justify-end">
              <h3 className="text-4xl md:text-4xl font-medium text-white mb-4 mt-3 ml-3">
                Image Generation
              </h3>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-4 text-justify ml-3">
                Transform your imagination into stunning visuals with WildMind AI&apos;s advanced image generation tools. Whether you&apos;re creating from scratch or enhancing existing designs, our platform empowers creators with precision, speed, and creativity. Experience image creation that&apos;s intuitive, intelligent, and impactful.
              </p>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed text-justify ml-3">
                From AI stickers to facial expressions, inpainting, and live portraits, our suite uses models like Stable Diffusion XL, Flux Schnall, and Mediapipe-enhanced pipelines to deliver photorealistic, Pixar-style, or stylized output instantly!
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Video Generation",
       value: "video-generation",
       content: (
         <div className="w-full h-full bg-transparent backdrop-blur-xl rounded-2xl border border-white/20 p-3 md:p-4 shadow-2xl">
           <div className="w-full h-full flex flex-col md:flex-row gap-4 justify-start items-start">
             {/* Image */}
               <div className="flex relative h-[400px] md:h-[450px] rounded-xl overflow-hidden">
                <Image
                  src="/Landingpage/animated-tabs/videogen.png"
                  alt="Video Generation"
                  width={500}
                  height={500}
                  className="w-full h-full object-contain"
                />
              </div>
            
            {/* Content - Parallel from top */}
            <div className="flex-1 flex flex-col justify-start">
              <h3 className="text-4xl md:text-4xl font-medium text-white mb-4 mt-3 ml-3">
                Video Generation
              </h3>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-4 ml-3 text-justify">
                Turn text, images, or concepts into cinematic-quality videos effortlessly. WildMind AI&apos;s video generation suite blends storytelling with cutting-edge AI to deliver visually captivating content in minutes.
              </p>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed ml-3 text-jusify">
                Whether you&apos;re animating characters, enhancing footage, or adding VFX, our tools leverage models like Veo-3, MiniMax Hailuo 02, T2V-A14B, and custom face/character swap pipelines to produce sharp, dynamic video output.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
       title: "Audio Generation",
       value: "audio-generation",
       content: (
         <div className="w-full h-full bg-transparent backdrop-blur-xl rounded-2xl border border-white/20 p-3 md:p-4 shadow-2xl">
           <div className="w-full h-full flex flex-col md:flex-row gap-4 justify-start items-start">
             {/* Image */}
                <div className="flex relative h-[400px] md:h-[450px] rounded-xl overflow-hidden">
                <Image
                  src="/Landingpage/animated-tabs/Audio.png"
                  alt="Audio Generation"
                  width={500}
                  height={500}
                  className="w-full h-full object-contain"
                />
              </div>
            
            {/* Content - Parallel from top */}
            <div className="flex-1 flex flex-col justify-start">
              <h3 className="text-4xl md:text-4xl font-medium text-white mb-4 mt-3 ml-3">
                Audio Generation
              </h3>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-4 ml-3 text-justify">
                Compose music, generate audio, or create immersive soundscapes with just a few clicks. WildMind AI revolutionizes audio creation with tools designed for musicians, podcasters, and multimedia producers.
              </p>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed ml-3 text-justify">
                With support for text-to-music, audio-to-music transformation, and soundtrack suggestions from image or video inputs, we use Suno, MiniMax V1, and such transformer-based neural audio models to craft compelling, copyright-free sound at scale.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Branding Kit",
      value: "branding-kit",
      content: (
        <div className="w-full h-full bg-transparent backdrop-blur-xl rounded-2xl border border-white/20 p-3 md:p-4 shadow-2xl">
          <div className="w-full h-full flex flex-col md:flex-row gap-4 justify-start items-start">
            {/* Image */}
               <div className="flex relative h-[400px] md:h-[450px] rounded-xl overflow-hidden">
               <Image
                 src="/Landingpage/animated-tabs/brandingkit.png"
                 alt="Branding Kit"
                 width={500}
                 height={500}
                 className="w-full h-full object-contain"
               />
             </div>
           
           {/* Content - Parallel from top */}
           <div className="flex-1 flex flex-col justify-start">
             <h3 className="text-4xl md:text-4xl font-medium text-white mb-4 mt-3 ml-3">
               Branding Kit
             </h3>
             <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-4 ml-3 text-justify">
               Everything your brand needs is generated in seconds! From logos to product mockups and digital ads, WildMind AI&apos;s branding kit helps businesses and creators maintain a cohesive, professional identity.
             </p>
             <p className="text-gray-300 text-sm md:text-base leading-relaxed ml-3 text-justify">
               Backed by multi-modal design models like Flux Kontext and SDXL Turbo, our branding features cover logo generation, packaging visuals, holding mockups, and model poses, delivering polished assets for campaigns, eCommerce, or investor decks.
             </p>
           </div>
         </div>
       </div>
     ),
   },
    {
      title: "Filming Tools",
       value: "filming-tools",
       content: (
         <div className="w-full h-full bg-transparent backdrop-blur-xl rounded-2xl border border-white/20 p-3 md:p-4 shadow-2xl">
           <div className="w-full h-full flex flex-col md:flex-row gap-4 justify-start items-start">
             {/* Image */}
                 <div className="flex relative h-[400px] md:h-[450px] rounded-xl overflow-hidden">
                <Image
                  src="/Landingpage/animated-tabs/filmings.png"
                  alt="Filming Tools"
                  width={500}
                  height={500}
                  className="w-full h-full object-contain"
                />
              </div>
            
            {/* Content - Parallel from top */}
            <div className="flex-1 flex flex-col justify-start">
              <h3 className="text-4xl md:text-4xl font-medium text-white mb-4 mt-3 ml-3">
                Filming Tools
              </h3>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-4 ml-3 text-justify">
                Bring your stories to life with AI-powered storyboards, film generation, and comic book creation. WildMind AI offers a dynamic suite of tools built for filmmakers, animators, and creative storytellers.
              </p>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed ml-3 text-justify">
                By combining our image-to-video engine with consistent character generation, cinematic framing, and AI-assisted scene blocking, our platform helps visualize full film concepts in a fraction of the time, with no creative compromise.
              </p>
            </div>
          </div>
        </div>
      ),
    },

    {
      title: "3D Generation",
       value: "3d-generation",
       content: (
            <div className="w-full h-full bg-transparent backdrop-blur-xl rounded-2xl border border-white/20 p-3 md:p-4 shadow-2xl">
           <div className="w-full h-full flex flex-col md:flex-row gap-4 justify-start items-start">
             {/* Image */}
              <div className="flex relative h-[400px] md:h-[450px] rounded-xl overflow-hidden">
                <Image
                  src="/Landingpage/animated-tabs/3D.png"
                  alt="3D Generation"
                  width={500}
                  height={500}
                  className="w-full h-full object-contain"
                />
              </div>
            
            {/* Content - Parallel from top */}
            <div className="flex-1 flex flex-col justify-start">
              <h3 className="text-4xl md:text-4xl font-medium text-white mb-4 mt-3 ml-3">
                3D Generation
              </h3>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-4 ml-3 text-justify">
                Create high-quality 3D assets with ease using WildMind AI&apos;s powerful generation tools. Whether you&apos;re designing for gaming, AR/VR, or product visualization, our platform transforms text and images into lifelike 3D models in seconds.
              </p>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed ml-3 text-justify">
                Using neural rendering and text-to-3D pipelines optimized for speed and resolution, WildMind AI supports everything from stylized concepts to detailed object prototyping, making 3D design accessible to all creators!
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="w-full bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-5xl lg:text-4xl font-bold text-white mb-4">
            Explore Our
            <span className="bg-gradient-to-r from-[#6C3BFF] to-[#412399] bg-clip-text text-transparent"> Creative Tools</span>
          </h2>
          <p className="text-medium md:text-base text-gray-400 max-w-2xl mx-auto px-4">
            Discover the power of AI-driven creative tools designed to transform your ideas into stunning visuals
          </p>
        </div>
        
        {/* Tabs Container */}
        <div className="relative w-full h-[500px] md:h-[600px]">
          <Tabs
            tabs={tabs}
            containerClassName="bg-black/20 backdrop-blur-sm rounded-full p-1 border border-white/20 shadow-lg shadow-black/50 w-full max-w-none mb-4"
            activeTabClassName="bg-[#006AFF] text-white"
            tabClassName="text-white/70 hover:text-white transition-colors text-xs md:text-sm lg:text-base whitespace-nowrap"
            contentClassName="h-[400px] md:h-[480px] mt-4"
          />
        </div>
      </div>
    </section>
  );
};

export default TabsSection; 