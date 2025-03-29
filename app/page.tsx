import React from "react";

import "./globals.css";
import SignIn from "./view/signin/page";
import Signup from "./view/signup/page";
import Home from "./view/home/page";
import Scrollbar from "./Scrollbar";
import ContactSection from "./view/contactus/page";
import ImageGenMain from "./view/imagegeneration/page";

import Main from "./view/landingPage/page";
import SupportPage from "./view/support/page";
import SubscriptionToggle from "./view/pricing/page";
import SelectionModel from "./view/imagegeneration/selectionmodel/app-container";

// Define Page as a React functional component
const Page: React.FC = () => {
  return (
    <>

      <Main />
      {/* <SignIn /> */}
      {/* <Signup /> */}
      {/* <Home /> */}
      {/* <Scrollbar /> */}
      {/* <ContactSection /> */}
      {/* <ImageGenMain /> */}
      {/* <SelectionModel /> */}
      {/* <SupportPage /> */}
      {/* <SubscriptionToggle /> */}
    </>
  );
};

export default Page;
