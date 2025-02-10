import React from 'react'
import Navigation from './components/Navigation';
import Slideimage from './components/Slideimage';

import Footer from './components/Footer';
import ArtGallery from './components/ArtGallery';
import Cards from './components/Cards';
import { PartnersSection } from './components/partners-section';
import { Testimonials } from './components/Testimonials';
import StartUsingAi from './components/start-using-ai';
import DiscordLanding from './components/discord-landing';
import Header from './components/Header';


const main = () => {
  return (
    <div>
      <Header />
      <Cards />
      {/* <div className="bg-background min-h-screen">
      <ArtGallery />
    </div> */}

      <DiscordLanding />


      <PartnersSection />
      <Testimonials />

      <StartUsingAi />
      <Footer />



    </div>
  )
}

export default main