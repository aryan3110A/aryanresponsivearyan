import React from "react";

import "./globals.css";
import SignIn from "./view/signin/page";
import Signup from "./view/signup/page";
import Home from "./view/home/page";
import Scrollbar from "./Scrollbar";
import ContactSection from "./view/contactus/page";
import ImageGenMain from "./view/ImageGeneate/page";

import Main from "./view/landingPage/page";
import SupportPage from "./view/support/page";
import SubscriptionToggle from "./view/pricing/page";

const page = () => {
  return (
    <>
      <Main />
      {/* <SignIn /> */}
      {/* <Signup /> */}
      {/* <Home /> */}
      {/* <Scrollbar /> */}
      {/* <ContactSection /> */}
      {/* <ImageGenMain /> */}
      {/* <SupportPage /> */}
      {/* <SubscriptionToggle /> */}
    </>
  );
};

export default page;
