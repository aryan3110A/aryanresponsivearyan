import React from "react";
// import Cards from "./components/Cards";
import TabsSection from "./components/TabsSection";
import Header from "./components/Header";
import NAV_LAND from "./components/NAV_LAND";
import FeatuesAll from "./components/FeatuesAll";
import Footer from "../Core/Footer";
import Subscribe from "./components/subscribe";
import CircularGallery from "./components/CicularGallery";
import DarkVeil from "./components/DarkVeil";
const Main = () => {
  return (
    <div className="relative w-full bg-black">
      {/* Navigation (Fixed on top with highest z-index) */}
      <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center">
        <NAV_LAND />
      </div>

                                                                                                                                                    {/* Header with DarkVeil Background */}
<div className="relative h-screen w-full overflow-hidden flex flex-col justify-center items-center">
  <div className="absolute inset-0 w-full h-full z-0">
    <DarkVeil
      hueShift={2}
      noiseIntensity={0.05}
      scanlineIntensity={0.5}
      speed={1}
      scanlineFrequency={0}
      warpAmount={6}
      resolutionScale={1}
    />
    </div>
      <div className="relative z-[10] w-full pt-3 pb-20">
        <Header />
    </div>
    </div>

      <div className="relative z-[10] bg-black">
      <TabsSection />
      </div>

      {/* Additional sections with proper spacing */}
      <div className="relative z-[10]">
        {/* <ArtGallery /> */}
        {/* <SocialMediaSuite /> */}
        <p className="text-white flex justify-center items-center text-[3rem] mt-20 mb-10 font-semibold">Features</p>
        <FeatuesAll />
      </div>

      {/* <div className="relative z-[40]">
        <DiscordLanding />
      </div> */}

      {/* <div className="relative z-[50]">
        <Commingsoon />
      </div> */}

      {/* <div className="relative z-[60]">
        <Testimonials />
      </div> */}

      {/* <div className="relative z-[70]">
        <PartnersSection />
      </div> */}

      {/* <div className="relative z-[80]">
        <StartUsingAi />
      </div> */}

      <div className="relative mt-10 z-[10]">
        <Subscribe />
      </div>

      <div className="relative mt-30 z-[30]">
        <div style={{ height: '600px', position: 'relative' }}>
          <CircularGallery
            bend={0}
            textColor="#ffffff"
            borderRadius={0.05}
            scrollEase={0.02}
            items={[
              { image: '/Landingpage/ArtGallery/img1.png', text: '' },
              { image: '/Landingpage/ArtGallery/img2.png', text: '' },
              { image: '/Landingpage/ArtGallery/img3.png', text: '' },
              { image: '/Landingpage/ArtGallery/img4.png', text: '' },
              { image: '/Landingpage/ArtGallery/img5.png', text: '' },
              { image: '/Landingpage/ArtGallery/img6.png', text: '' },
              { image: '/Landingpage/ArtGallery/img7.png', text: '' },
              { image: '/Landingpage/ArtGallery/img8.png', text: '' },
              { image: '/Landingpage/ArtGallery/img9.png', text: '' },
            ]}
          />
        </div>
      </div>

      <div className="relative z-[10]">
        <Footer />
      </div>
    </div>
  );
};

export default Main;
