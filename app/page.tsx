import React from "react";

import "./globals.css";
// import Main from "./view/landingPage/page";
// import Main from "./view/landingPage/page";
// import ContactSection from "./view/contactus/page";
import Home from "./view/home/[username]/page";

// Define Page as a React functional component
const Page: React.FC = () => {
  return (
    <>
    <Home />
    {/* <ContactSection /> */}
    </>
  );
};

export default Page;
