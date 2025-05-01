'use client';

import React, { useEffect } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import Button from './Button';
import SlideImage from './Slideimage';
import { HeroHighlightDemo } from './Headertext';
import { initParticlesEngine } from "@tsparticles/react";


const Header = () => {
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    });
  }, []);

  return (
    <div className="relative h-screen bg-gradient-to-br from-[#050505] via-[#0a0a1f] to-[#0c0c0c] overflow-hidden flex flex-col justify-center items-center">

      {/* Particles */}
      <Particles
        id="tsparticles"
        options={{
          fullScreen: { enable: false },
          background: { color: { value: 'transparent' } },
          particles: {
            color: { value: '#ffffff' },
            number: { value: 60 },
            size: { value: 1.5 },
            move: { enable: true, speed: 0.25 },
            opacity: { value: 0.2 },
            links: { enable: true, color: "#ffffff", opacity: 0.03 },
          },
        }}
        className="absolute inset-0 z-0"
      />

      {/* Main Content */}
      <div className="z-10 w-full h-full flex flex-col justify-between items-center px-4 md:px-10 mb-28">
        <HeroHighlightDemo />
        <SlideImage />
        <Button />
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black via-transparent to-transparent z-20" />
    </div>
  );
};

export default Header;
