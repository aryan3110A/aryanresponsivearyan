import React from 'react'
import Navigation from './components/Navigation';
import Slideimage from './components/Slideimage';
import Slider from './components/Slider';
import Footer from './components/Footer';
import ArtGallery from './components/ArtGallery';
import Cards from './components/Cards';
import { PartnersSection } from './components/partners-section';
import { Testimonials } from './components/Testimonials';


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
        <Slider />
        <div className="bg-background min-h-screen">
      <ArtGallery />
    </div>
        <Cards />

        <PartnersSection />
        <Testimonials />
        <Footer />
      

        
    </div>
  )
}

export default main