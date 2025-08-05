import React from "react";
// import Cards from "./components/Cards";
import TabsSection from "./components/TabsSection";
import Header from "./components/Header";
import NAV_LAND from "./components/NAV_LAND";
import FeatuesAll from "./components/FeatuesAll";
import Footer from "../Core/Footer";
import Subscribe from "./components/subscribe";
import InfiniteImageScroll from "./components/InfiniteImageScroll";

const Main = () => {
  return (
    <div className="bg-black relative mb:bg-gradient-to-br from-[#050505] via-[#0a0a1f] to-[#0c0c0c]">
      {/* Navigation (Fixed on top with highest z-index) */}
      <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center">
        <NAV_LAND />
      </div>

      {/* Main Content with proper spacing and z-index */}
      <div className="pt-20 relative">
        <div className="relative z-[10]">
          <Header />
        </div>

        <div className="relative z-[10]">
          <TabsSection />
        </div>
      </div>

      {/* Additional sections with proper spacing */}
      <div className="relative z-[10]">
        {/* <ArtGallery /> */}
        {/* <SocialMediaSuite /> */}
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

      <div className="relative mt-10 z-[10]">
      <InfiniteImageScroll 
            images={[
              { id: 1, src: '/Landingpage/ArtGallery/img1.png', alt: 'Sample 1' },
              { id: 2, src: '/Landingpage/ArtGallery/img2.png', alt: 'Sample 2' },
              { id: 3, src: '/Landingpage/ArtGallery/img3.png', alt: 'Sample 3' },
              { id: 4, src: '/Landingpage/ArtGallery/img4.png', alt: 'Sample 3' },
              { id: 5, src: '/Landingpage/ArtGallery/img5.png', alt: 'Sample 3' },
              { id: 6, src: '/Landingpage/ArtGallery/img6.png', alt: 'Sample 3' },
              { id: 7, src: '/Landingpage/ArtGallery/img7.png', alt: 'Sample 3' },
              { id: 8, src: '/Landingpage/ArtGallery/img8.png', alt: 'Sample 3' },
              { id: 9, src: '/Landingpage/ArtGallery/img9.png', alt: 'Sample 3' },
            ]}
          />
      </div>

      <div className="relative z-[10]">
        <Footer />
      </div>
    </div>
  );
};

export default Main;
