import React from 'react'
import Button from './Button';


import SlideImage from './Slideimage';

const Header = () => {
  return (
    <div className='h-[100vh] bg-black '>

      <div>
        <a className='text-white text-[50px] font-[700] mt-24 flex justify-center items-center text-center tracking-widest bg-black'>
          From your Vision to stunning Creations <br /> crafted by WildMind
        </a>
      </div>


      <SlideImage />
      <Button />

    </div>
  )
}

export default Header;