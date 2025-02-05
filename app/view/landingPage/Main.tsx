import React from 'react'
import Navigation from './components/Navigation';
import Slideimage from './components/Slideimage';

const main = () => {
  return (
    <div className='bg-black w-[100vw] h-[100vh] flex flex-col  items-center'>


      <Navigation />

  
        <div>
        <a className='text-white text-5xl font-extrabold mt-24 flex justify-center items-center text-center tracking-widest'>
  From your Vision to stunning Creations <br /> crafted by WildMind
</a>
        </div>


        <Slideimage />
      

        
    </div>
  )
}

export default main