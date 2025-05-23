"use client"

import { useState, useEffect, useRef } from "react"
import {  User, ChevronDown } from "lucide-react"
import Link from "next/link"
import Hamburger from "./Hamburger"
import { useRouter } from "next/navigation"
import IMAGE from "next/image"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "@/database/firebase"
import { FEATURE_ROUTES, NAV_ROUTES } from "@/routes/routes"
import { getImageUrl } from "@/routes/imageroute"

interface DropdownItem {
  title: string
  src: string
  coming: boolean
}

export default function NavigationFull() {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [animating] = useState<boolean>(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState<boolean>(false)
  const [userEmail, setUserEmail] = useState<string>("")
  const [username, setUsername] = useState<string>("")
  const [showUsernamePrompt, setShowUsernamePrompt] = useState<boolean>(false)

  const headerRef = useRef<HTMLElement>(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUserEmail(firebaseUser.email || "")
        const storedUsername = localStorage.getItem("username")
        if (storedUsername) {
          setUsername(storedUsername)
        } else {
          setShowUsernamePrompt(true)
        }
      } else {
        const otpEmail = localStorage.getItem("otpUser")
        if (otpEmail) {
          setUserEmail(otpEmail)
          const storedUsername = localStorage.getItem("username")
          if (storedUsername) {
            setUsername(storedUsername)
          } else {
            setShowUsernamePrompt(true)
          }
        }
      }
    })
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch {}
    localStorage.removeItem("otpUser")
    localStorage.removeItem("username")
    setUserEmail("")
    setUsername("")
    router.push("/")
  }

  const handleUsernameSubmit = () => {
    if (username.trim()) {
      localStorage.setItem("username", username)
      setShowUsernamePrompt(false)
    }
  }

  const toggleDropdown = (dropdown: string): void => {
    if (activeDropdown === dropdown) {
      setActiveDropdown(null)
    } else {
      setActiveDropdown(dropdown)
    }
  }

  // Handle navigation to feature routes
  const handleFeatureClick = (route: string, coming: boolean) => {
    if (!coming) {
      router.push(route)
      setActiveDropdown(null)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
        setIsUserDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const needsUsername = localStorage.getItem("needsUsername")
    if (needsUsername === "true") {
      setShowUsernamePrompt(true) // this controls your prompt modal
      localStorage.removeItem("needsUsername")
    }
  }, [])

  const featuresDropdownItems: DropdownItem[] = [
    {
      title: "Text to image",
      src: FEATURE_ROUTES.IMAGE_GENERATION,
      coming: false, // Changed to false since it's available
    },
    { title: "Text to 3D", src: FEATURE_ROUTES.VIDEO_GENERATION, coming: true },
    { title: "Text to Video", src: FEATURE_ROUTES.VIDEO_GENERATION, coming: true },
    { title: "Sketch to Image", src: FEATURE_ROUTES.SKETCH_TO_IMAGE, coming: true },
    { title: "Real Time Generation", src: FEATURE_ROUTES.REAL_TIME_GENERATION, coming: true },
  ]

  const backgroundStyle = {
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundBlendMode: "overlay",
  }

  return (
    <div className="bg-[#000000] text-white">
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-xl shadow-lg "
        style={backgroundStyle}
      >
        <div className="flex items-center justify-start pl-[2vw] py-[0.5vh] md:py-[1vh]">
          <div className="flex items-center ">
            <button onClick={() => {
              setIsNavOpen(true);
              setIsUserDropdownOpen(false);
            }} className="py-2 rounded-lg pl-3 pr-1" aria-label="Open menu">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            </button>
            <div className="flex cursor-pointer">
              <IMAGE
                src={getImageUrl("core", "logo")}
                width={32}
                height={20}
                alt="logo"
                onClick={() => router.push("/")}
              />
            </div>
            <div className="text-center justify-center text-xl md:text-2xl font-poppins ml-0 ">WildMind</div>
          </div>

          <nav className="hidden md:flex lg:flex items-center justify-center gap-[4vw] font-poppins sm:pl-[18vw] md:pl-[21vw] lg:pl-[25vw]">
            <div className="relative">
              <button onClick={() => toggleDropdown("features")} className="flex items-center hover:text-[#dbdbdb]">
                <span>Features</span>
                <ChevronDown className={`ml-1 w-6 h-6 ${activeDropdown === "features" ? "rotate-180" : ""}`} />
              </button>
            </div>

            <Link href={NAV_ROUTES.TEMPLATES} className="hover:text-[#dbdbdb]">
              Templates
            </Link>

            <Link href={NAV_ROUTES.PRICING} className="hover:text-[#dbdbdb]">
              Pricing
            </Link>
            <Link href={NAV_ROUTES.ART_STATION} className="hover:text-[#dbdbdb]">
              Art Station
            </Link>
          </nav>

          <div className="fixed right-[4vw]">
            <button className="p-2" onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}>
              <User className="w-6 h-6" />
            </button>

            {isUserDropdownOpen && (
              <div className="absolute right-0  sm-laptop:-ml-[15vw] md-laptop:-ml-[11vw]  lg:-ml-[6vw] mt-[0.5vh] md:mt-[1.2vh] w-auto min-w-[150px] md:min-w-[250px] bg-black/70 backdrop-blur-3xl rounded-md shadow-lg z-50 animate-dropdown">
                <div className="py-2 flex flex-col">
                  <div className="px-4 py-2 text-white flex flex-col items-start">
                    <span className="text-xs md:text-sm font-semibold">{username || "Guest"}</span>
                    <span className="text-[0.5rem] md:text-xs text-gray-400">{userEmail || "Not signed in"}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-white hover:text-blue-400 flex items-center text-xs md:text-[1rem]"
                  >
                    <svg
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
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {activeDropdown && (
          <div
            className="left-0 right-0 overflow-hidden transition-all duration-1000 z-50"
            style={{
              ...backgroundStyle,
              maxHeight: activeDropdown ? "50vh" : "0",
              opacity: animating ? 0 : 1,
            }}
          >
            <div className="container py-2">
              <div className="flex flex-col sm:ml-[31.4vw] md:ml-[36vw] lg:ml-[37vw]">
                <h3 className="text-lg font-bold mb-[2vh]">CREATE</h3>
                <div className="flex flex-col space-y-[1.5vh]">
                  {featuresDropdownItems.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => handleFeatureClick(item.src, item.coming)}
                      className={`block py-0 rounded-md transition-all duration-300 ${
                        item.coming ? "text-white" : "hover:text-[#dbdbdb] cursor-pointer"
                      }`}
                    >
                      <span>
                        {item.title} {item.coming && "(Coming Soon)"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <Hamburger isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />

      {showUsernamePrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50 ">
          <div className="bg-[#1e1e1e] p-6 rounded-lg shadow-lg text-white">
            <h2 className="text-lg mb-2">Create Your Username</h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-gray-700 p-2 rounded w-full mb-4"
              placeholder="Enter a username"
            />
            <button onClick={handleUsernameSubmit} className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded">
              Save Username
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
