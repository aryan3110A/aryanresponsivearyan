import React from 'react'
import Navigation from './Navigation'
import { div } from 'framer-motion/client';
import SlideImage from './Slideimage';

const Header = () => {
  return (
   <div>

    <Navigation />
    <div>
        <a className='text-white text-5xl font-extrabold mt-24 flex justify-center items-center text-center tracking-widest'>
  From your Vision to stunning Creations <br /> crafted by WildMind
</a>
        </div>

    
    <SlideImage />

   </div>
  )
}

export default Header;