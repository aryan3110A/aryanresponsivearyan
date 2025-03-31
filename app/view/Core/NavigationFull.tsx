"use client"

import { useState, useEffect, useRef } from "react"
import { Menu, User, ChevronDown } from "lucide-react"
import Link from "next/link"
import Hamburger from "./Hamburger"
import type { JSX } from "react/jsx-runtime"
import { useRouter } from "next/navigation"
import IMAGE from "next/image";
import { APP_ROUTES, NAV_ROUTES, AUTH_ROUTES,FEATURE_ROUTES
 } from "@/routes/routes";
 import { getImageUrl } from '@/routes/imageroute';

// Define types for dropdown items
interface DropdownItem {
  title: string
  src:string
  coming: boolean
}

export default function NavigationFull(): JSX.Element {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [animating, setAnimating] = useState<boolean>(false)
  const headerRef = useRef<HTMLElement>(null)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState<boolean>(false)
  const router = useRouter();

  const toggleDropdown = (dropdown: string): void => {
    // If clicking the same dropdown, close it
    if (activeDropdown === dropdown) {
      setActiveDropdown(null)
    } else {
      // If clicking a different dropdown, switch to new dropdown
      setActiveDropdown(dropdown)
    }
  }

  useEffect(() => {
    // Function to handle clicks outside the dropdown
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is outside the header
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
        setIsUserDropdownOpen(false)
      }
    }

    // Add click event listener to document
    document.addEventListener("mousedown", handleClickOutside)

    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (activeDropdown) {
      setAnimating(true)
      const timer = setTimeout(() => {
        setAnimating(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [activeDropdown])

  const featuresDropdownItems: DropdownItem[] = [
    {
      title: "Text to image",
      src:FEATURE_ROUTES.IMAGE_GENERATION,
      coming: false,
      
    },
    {
      title: "Text to 3D",
      src:APP_ROUTES.HOME,
      coming: true,
    },
    {
      title: "Text to Video",
      src:APP_ROUTES.HOME,
      coming: true,
    },
    {
      title: "Sketch to Image",
      src:APP_ROUTES.HOME,
      coming: true,
    },
    {
      title: "Real Time Genration",
      src:APP_ROUTES.HOME,
      coming: true,
    },
  ]

  const templatesDropdownItems: DropdownItem[] = [
    {
      title: "Image Generation",
      src:APP_ROUTES.HOME,
      coming: false,
    },
    {
      title: "Video Generation",
      src:APP_ROUTES.HOME,
      coming: true,
    },
  ]

  // Common background style object for header and dropdown
  const backgroundStyle = {
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundBlendMode: "overlay",
  }

  return (
    <div className=" bg-[#000000] text-white">
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-20 bg-black/30 backdrop-blur-3xl  shadow-lg"
        style={backgroundStyle}
      >
        <div className="flex items-center justify-start pl-[2vw] py-[1vh]">
          <div className=" flex items-center gap-4">
            <button
              onClick={() => setIsNavOpen(true)}
              className="p-2  rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-8 h-8" />
            </button>
            <div>
              <IMAGE src={getImageUrl('core','logo')} width={40} height={20} alt="logo" onClick={() => router.push("/")} />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex lg:flex items-center justify-center gap-[4vw] text-nowrap font-poppins sm:pl-[30vw]  md:pl-[23.8vw] lg:pl-[30vw] py-0">
            {/* Features Button */}
            <div className="relative">
              <button
                onClick={() => {
                  toggleDropdown("features")
                  setIsUserDropdownOpen(false)
                }}
                className="flex items-center text-white transition-colors hover:text-[#dbdbdb] group"
              >
                <span>Features</span>
                <ChevronDown
                  className={`ml-1 w-6 h-6 transition-transform transform group-hover:text-[#dbdbdb] ${activeDropdown === "features" ? "rotate-180 text-[#dbdbdb]" : "text-white"
                    }`}
                />
              </button>
            </div>

            {/* Templates Button */}
            <div className="relative">
              <button
                onClick={() => {
                  toggleDropdown("templates")
                  setIsUserDropdownOpen(false)
                }}
                className="flex items-center text-white transition-colors hover:text-[#dbdbdb] group"
              >
                <span>Templates</span>
                <ChevronDown
                  className={`ml-1 w-6 h-6 transition-transform transform group-hover:text-[#dbdbdb] ${activeDropdown === "templates" ? "rotate-180 text-[#dbdbdb]" : "text-white"
                    }`}
                />
              </button>
            </div>

            {/* Other Navigation Links */}
            <nav>
              <Link
                href={NAV_ROUTES.PRICING}
                className="text-white hover:text-[#dbdbdb]"
                onClick={() => {
                  setActiveDropdown(null)
                  setIsUserDropdownOpen(false)
                }}
              >
                Pricing
              </Link>
            </nav>
            <Link
              href={NAV_ROUTES.ART_STATION}
              className="text-white hover:text-[#dbdbdb]"
              onClick={() => {
                setActiveDropdown(null)
                setIsUserDropdownOpen(false)
              }}
            >
              Art Station
            </Link>
            {/* <Link href="/view/support" className="text-white hover:text-[#dbdbdb]" onClick={() => {
              setActiveDropdown(null)
              setIsUserDropdownOpen(false)

            }}>
              Support
            </Link> */}
          </nav>

          <div className="fixed right-[4vw] ">
            <button
              className="p-2 rounded-lg transition-colors"
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            >
              <User className="w-6 h-6" />
            </button>

            {isUserDropdownOpen && (
              <div
                className="absolute -ml-[3vw] mt-[1.4vh] w-[8vw] min-w-[150px] bg-black/40 backdrop-blur-3xl rounded-md shadow-lg overflow-hidden z-30 animate-dropdown"
                style={{
                  transformOrigin: "top",
                }}
              >
                <div className="py-2 flex flex-col">
                  <Link
                    href={AUTH_ROUTES.SIGN_IN}
                    className="px-4 py-2 text-white hover:text-blue-400 flex items-center"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Username
                  </Link>
                  <Link
                    href={AUTH_ROUTES.SIGN_IN}
                    className="px-4 py-2 text-white hover:text-blue-400 flex items-center"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Logout
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Full-width dropdown menus */}
        {activeDropdown && (
          <div
            className="left-0 right-0 overflow-hidden transition-all duration-1000 z-10"
            style={{
              ...backgroundStyle,
              maxHeight: activeDropdown ? "50vh" : "0",
              opacity: animating ? 0 : 1,
              animation: animating ? "dropdownFade 500ms ease-in-out forwards" : "",
            }}
          >
            <div className="container py-2">
              <div className="flex flex-col sm:ml-[31.4vw] md:ml-[33vw] lg:ml-[37.2vw]">
                <h3 className="text-lg font-bold mb-[2vh]">CREATE</h3>
                <div className="flex flex-col space-y-[1.5vh]">
                  {activeDropdown === "features" &&
                    featuresDropdownItems.map((item, index) => (
                      <Link
                        href={`/${item.src.toLowerCase().replace(/\s+/g, "-")}`}
                        key={index}
                        className="block py-0 rounded-md transition-all duration-300 hover:text-[#dbdbdb]"
                      >
                        <span>
                          {item.title} {item.coming && "(coming soon)"}
                        </span>
                      </Link>
                    ))}
                  {activeDropdown === "templates" &&
                    templatesDropdownItems.map((item, index) => (
                      <Link
                        href={`/${item.src.toLowerCase().replace(/\s+/g, "-")}`}
                        key={index}
                        className="block py-0 rounded-md transition-all duration-300 hover:text-[#dbdbdb]"
                      >
                        <span>
                          {item.title} {item.coming && "(coming soon)"}
                        </span>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Sliding Navbar */}
      <Hamburger isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />

      {/* Add CSS animation */}
      <style jsx global>{`
        @keyframes dropdownFade {
          from {
            opacity: 0;
            transform: translateY(-1vh);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-dropdown {
          animation: dropdownFade 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

