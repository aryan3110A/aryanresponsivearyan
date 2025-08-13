'use client';

import React, { useEffect, useState } from 'react';
// import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import Image from 'next/image';
// import Button from './Button';
// import SlideImage from './Slideimage';
// import { HeroHighlightDemo } from './Headertext';
import { initParticlesEngine } from "@tsparticles/react";
import TextType from './TextType';
import NewButton from './NewButton';
// CurvedLoop moved to page-level placement between sections


const Header = () => {
  const [isFocused] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    });
  }, []);
  

  return (
      <div className="relative z-10 w-full h-full flex flex-col items-center px-0 pb-16">
        {/* <HeroHighlightDemo /> */}
        
        {/* <SlideImage /> */}

        {/* <Button /> */}

         {/* Logo above the prompt box */}
         <div className="w-full flex justify-center items-center mt-35">
           <Image src="/Core/Asset 3wildmind logo text (2).svg" alt="Logo" width={144} height={144} className="h-36 w-auto" />
         </div>
         {/* Text Input Box with TextType Placeholder */}
         <div className="relative w-full max-w-3xl mx-auto px-4 mb-10 mt-20">
           <div className="relative">
             <input
               type="text"
               className="w-full px-6 py-3 text-lg backdrop-blur-xl bg-black/20 shadow-lg border-[2px] border-white/20 rounded-full text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 pointer-events-none"
               placeholder=" "
               readOnly
             />
             {!isFocused && (
               <div className="absolute inset-0 flex items-center pointer-events-none">
                 <div className="px-6 py-4 text-medium text-white/70">
                   <TextType 
                      text = {[
                      "Welcome to Wildmind AI...",
                      "Search for anything...",
                      "Show your creativity by just entering prompts...",
                      "Generate images...",
                      "Create videos...",
                      "Make music...",
                      "Turn imagination into reality with a single click...",
                      "Craft entire worlds from just words...",
                      "Transform your thoughts into stunning visuals...",
                      "Compose symphonies from your mood...",
                      "Animate your ideas like never before...",
                      "Where AI meets pure creativity...",
                      "Let your wildest ideas come to life...",
                      "Design without limits, dream without boundaries...",
                      "Speak to the machine. Watch it create magic...",
                      ]}
                    
                     typingSpeed={50}
                     pauseDuration={1500}
                     showCursor={true}
                     cursorCharacter="|"
                     className="text-white/70"
                   />
                 </div>
               </div>
             )}
           </div>
         </div>
         {/* Add three NewButtons centered below the TextInput */}
         <div className="flex justify-center w-full my-1 gap-6">
           <NewButton
             text="Start Generating"
             background="#0073E6"
             hoverBackground="#0059B3"
             glowColor="#0059B3"
             textColor="#fff"
             onClick={() =>{}}
           />
           <NewButton
             text="Access Art Station"
             background="#5C00E6"
             hoverBackground="#5900B3"
             glowColor="#5900B3"
             textColor="#fff"
             onClick={() =>{}}
           />
           <NewButton
             text="Check What's New"
             background="#00B300"
             hoverBackground="#009900"
             glowColor="#009900"
             textColor="#fff"
             onClick={() =>{}}
           />
         </div>

         <div className="flex justify-center items-center gap-6 mt-1 mb-25 ">

        </div>
        {/* CurvedLoop is rendered between Header and TabsSection at page level */}
        
      </div>
  );
};

export default Header;

