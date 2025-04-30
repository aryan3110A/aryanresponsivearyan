"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/database/firebase";
import { doc, getDoc } from "firebase/firestore";
import { APP_ROUTES, NAV_ROUTES, FEATURE_ROUTES } from "../../../../routes/routes";

const Navigation = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userSlug, setUserSlug] = useState("");
  const router = useRouter();

  useEffect(() => {
    // check auth state on mount
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        const docRef = doc(db, "users", user.email || "");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data?.slug) {
            setUserSlug(data.slug); // get the unique slug
          }
        }
      } else {
        setIsLoggedIn(false);
        setUserSlug("");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  
  

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleGetStarted = () => {
    if (isLoggedIn && userSlug) {
      router.push(`/view/home/${userSlug}`);
    } else {
      router.push(APP_ROUTES.SIGNUP);
    }
  };

  
  

 
  

  return (
    <div
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-[1000] flex items-center justify-between p-2 rounded-[50px] 
      border-[1px] border-white/20 w-[45vw] text-white
      ${
        scrolled
          ? "backdrop-blur-xl bg-black/30 shadow-lg"
          : "backdrop-blur-xl bg-black/10 shadow-lg"
      } transition-all duration-300`}
    >
      {/* Logo */}
      <div>
        <span className="">
        <Image src="/Core/Logomain.png" width={40} height={40} alt="Main Logo" />
        </span>
      </div>

      {/* Features Dropdown */}
      <div className="relative">
        <span
          onClick={() => toggleDropdown("features")}
          className="cursor-pointer px-3 py-1 flex items-center gap-1  hover:bg-gradient-to-l  hover:bg-clip-text font-poppins  bg-transparent hover:text-[#dbdbdb]"
        >
          Features
          <Image
            width={12}
            height={12}
            src={
              activeDropdown === "features"
                ? "/Core/arrowup.svg"
                : "/Core/arrowdown.svg"
            }
            alt="dropdown-arrow"
            className="ml-1"
          />
        </span>

        {activeDropdown === "features" && (
          <ul className="absolute left-1/2 -translate-x-1/2 mt-4 w-80 bg-black text-white rounded-lg border border-[#5f5e5e] shadow-[6px_6px_10px_rgba(0,0,0,0.6)] p-3 flex flex-col items-center overflow-hidden whitespace-nowrap">
            <li className="w-full px-3 py-2 cursor-pointer  text-center hover:text-[#dbdbdb]   hover:bg-gradient-to-l  hover:bg-clip-text" onClick={() => router.push(FEATURE_ROUTES.IMAGE_GENERATION) }>
              Text to image
            </li>
            <li className="w-full px-3 py-2 cursor-pointer text-center hover:text-[#dbdbdb]   hover:bg-gradient-to-l  hover:bg-clip-text">
              Text to video (coming soon)
            </li>
            <li className="w-full px-3 py-2 cursor-pointer text-center hover:text-[#dbdbdb]   hover:bg-gradient-to-l  hover:bg-clip-text">
              Sketch to image (coming soon)
            </li>
            <li className="w-full px-3 py-2 cursor-pointer text-center hover:text-[#dbdbdb]   hover:bg-gradient-to-l  hover:bg-clip-text">
              Real-time generation (coming soon)
            </li>
          </ul>
        )}
      </div>

      <div className="relative">
        <span
          onClick={() => toggleDropdown("templates")}
          className="cursor-pointer hover:text-[#dbdbdb] bg-transparent px-3 py-1 flex items-center gap-1 
           hover:bg-gradient-to-l hover:bg-clip-text"
        >
          Templates
          <Image
            width={12}
            height={12}
            src={
              activeDropdown === "templates"
                ? "/Core/arrowup.svg"
                : "/Core/arrowdown.svg"
            }
            alt="dropdown-arrow"
            className="ml-1"
          />
        </span>
        {activeDropdown === "templates" && (
          <ul className="absolute left-1/2 -translate-x-1/2 mt-4 w-80 bg-black text-white  rounded-lg border border-[#5f5e5e] shadow-[6px_6px_10px_rgba(0,0,0,0.6)] p-3 flex flex-col items-center overflow-hidden whitespace-nowrap">
            <li className="w-full px-3 py-2 cursor-pointer text-center hover:text-[#dbdbdb] hover:bg-gradient-to-l hover:bg-clip-text">
              Image generation
            </li>
            <li className="w-full px-3 py-2 cursor-pointer text-center hover:text-[#dbdbdb] hover:bg-gradient-to-l hover:bg-clip-text">
              video generation (Comming soon)
            </li>
          </ul>
        )}
      </div>

      {/* Other Links */}
      <div>
        <span className="px-3 py-1  hover:bg-gradient-to-l  hover:bg-clip-text cursor-pointer hover:text-[#dbdbdb]" onClick={() => router.push(NAV_ROUTES.PRICING)}>
          Pricing
        </span>
      </div>
      <div>
        <span className="px-3 py-1 hover:bg-gradient-to-l  hover:bg-clip-text cursor-pointer hover:text-[#dbdbdb]" onClick={() => router.push(NAV_ROUTES.ART_STATION)}>
          Art Station
        </span>
      </div>

      {/* Get Started Button */}
      <div>
      <button
          className="relative bg-black/20 border border-white/20 rounded-full px-5 py-2 text-base font-medium border-t-[#acacac] border-b-[#6A0DAD] hover:border-t-[#6A0DAD] hover:border-b-[#acacac] 
                    text-transparent bg-clip-text bg-gradient-to-r from-[#5AD7FF] to-[#656BF5] shadow-[inset_0px_0px_8px_rgba(255,255,255,0.2)] 
                    transition-all duration-500 ease-in-out hover:text-white"
          onClick={handleGetStarted}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Navigation;
