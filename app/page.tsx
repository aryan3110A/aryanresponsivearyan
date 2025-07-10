import React from "react";
// import Home from "./view/home/[username]/page";

import "./globals.css";
import ProductWithModelPosePage from "./view/BRANDINGKIT/PRODUCT_WITH_MODEL_POSE/page";
// import Main from "./view/landingPage/page";
// import Main from "./view/landingPage/page";
// import ContactSection from "./view/contactus/page";
// import Home from "./view/home/[username]/page";
// import Main from "./view/landingPage/page";
// import ProductGeneration from "./view/BRANDINGKIT/PRODUCT_GENERATION/page";
// import MockupGenerationPage from "./view/Mockupgeneration/page";
// import NewText2Image from "./view/IMAGEGENERATIONNEW/newtexttoimage/page";
// import AISTICKERGEN from "./view/IMAGEGENERATIONNEW/AI Sticker generation/page";

// Define Page as a React functional component
const Page: React.FC = () => {
  return (
    <>
    {/* <Main /> */}
    <ProductWithModelPosePage/>
    
    {/* <ProductGeneration /> */}
    {/* <AISTICKERGEN /> */}
{/* <NewText2Image /> */}
    {/* <MockupGenerationPage /> */}
    {/* <Home /> */}
    {/* <ContactSection /> */}
    </>
  );
};

export default Page;
