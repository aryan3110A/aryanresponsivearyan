import React from "react";
import "./globals.css";
// import ImageLibrary from "./view/imagelibrary/page";
// import InChatHistory from "./view/inchatHistory/page";
import Main from "./view/landingPage/page";
// import InpaintFluxAPI from "./view/inpaint-fluxapi/page";

// Define Page as a React functional component
const Page: React.FC = () => {
  return (
    <>
      <Main />
      {/* <InpaintFluxAPI/> */}
      {/* <ImageLibrary/> */}
      {/* <InChatHistory/> */}
      {/* <TextToMusic /> */}
      
    </>
  );
};

export default Page;
