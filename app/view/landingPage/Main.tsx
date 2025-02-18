import React from 'react'
import Navigation from './components/Navigation';
import Slideimage from './components/Slideimage';
import ArtGallery from './components/ArtGallery';
import Cards from './components/Cards';
import { PartnersSection } from './components/partners-section';
import { Testimonials } from './components/Testimonials';
import StartUsingAi from './components/start-using-ai';
import DiscordLanding from './components/discord-landing';
import Header from './components/Header';
import Footer from '../Core/Footer';
import Commingsoon from './components/Commingsoon';


const main = () => {
  return (
    <div className='bg-black'>
  <div className="relative ">
      {/* Centered Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center">
        <Navigation  />
      </div>
      
      {/* Main Content */}
      <div className="pt-16">
        <div className="relative z-40">
          <Header />
        </div>
        <div className="relative z-30">
          <Cards />
        </div>
      </div>
    </div>


      {/* <div className="bg-background min-h-screen">
      <ArtGallery />
    </div> */}

      <DiscordLanding />


      <PartnersSection />
      <Testimonials />
      <Commingsoon />

      <StartUsingAi />
      {/* <Footer />  */}
      <Footer />



    </div>
  )
}

export default main