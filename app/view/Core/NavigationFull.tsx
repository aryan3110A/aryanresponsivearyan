"use client"

import { useState, useEffect, useRef } from "react"
import { Menu, User, ChevronDown, ChevronUp, X, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import IMAGE from "next/image"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "@/database/firebase"
import { APP_ROUTES, NAV_ROUTES, FEATURE_ROUTES } from "@/routes/routes"
import { getImageUrl } from "@/routes/imageroute"

interface DropdownItem {
  title: string
  src: string
  coming: boolean
}

export default function NavigationFull() {
  // All state declarations grouped at the top
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState<boolean>(false)
  const [userEmail, setUserEmail] = useState<string>("")
  const [username, setUsername] = useState<string>("")
  const [showUsernamePrompt, setShowUsernamePrompt] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [isTablet, setIsTablet] = useState<boolean>(false)

  const headerRef = useRef<HTMLElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (typeof window === "undefined") return

    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
    }

    // Initial check
    checkScreenSize()

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize)

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

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

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
        setIsUserDropdownOpen(false)
      }

      // Close sidebar when clicking outside (for mobile)
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        (event.target as HTMLElement).closest('[aria-label="Open menu"]') === null
      ) {
        setIsNavOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return

    const needsUsername = localStorage.getItem("needsUsername")
    if (needsUsername === "true") {
      setShowUsernamePrompt(true) // this controls your prompt modal
      localStorage.removeItem("needsUsername")
    }
  }, [])

  const featuresDropdownItems: DropdownItem[] = [
    { title: "Text to image", src: FEATURE_ROUTES.IMAGE_GENERATION, coming: false },
    { title: "Text to 3D", src: APP_ROUTES.HOME, coming: true },
    { title: "Text to Video", src: APP_ROUTES.HOME, coming: true },
    { title: "Sketch to Image", src: APP_ROUTES.HOME, coming: true },
    { title: "Real Time Genration", src: APP_ROUTES.HOME, coming: true },
  ]

  const templatesDropdownItems: DropdownItem[] = [
    { title: "Image Generation", src: APP_ROUTES.HOME, coming: false },
    { title: "Video Generation", src: APP_ROUTES.HOME, coming: true },
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
        className="fixed top-0 left-0 right-0 z-20 bg-black/30 backdrop-blur-3xl shadow-lg"
        style={backgroundStyle}
      >
        {/* Mobile/Tablet Header */}
        {(isMobile || isTablet) && (
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <button onClick={() => setIsNavOpen(true)} className="p-1 rounded-lg" aria-label="Open menu">
                <Menu className="w-6 h-6" />
              </button>
            </div>

            <div className="flex items-center">
              <IMAGE
                src={getImageUrl("core", "logo")}
                width={30}
                height={15}
                alt="logo"
                onClick={() => router.push("/")}
                className="cursor-pointer"
              />
              <span className="ml-2 text-xl font-bold">WildMind</span>
            </div>

            <div>
              <button className="p-1" onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}>
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Desktop Header */}
        {!isMobile && !isTablet && (
          <div className="flex items-center justify-start pl-[2vw] py-[1vh]">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsNavOpen(true)} className="p-2 rounded-lg" aria-label="Open menu">
                <Menu className="w-8 h-8" />
              </button>
              <div>
                <IMAGE
                  src={getImageUrl("core", "logo")}
                  width={40}
                  height={20}
                  alt="logo"
                  onClick={() => router.push("/")}
                  className="cursor-pointer"
                />
              </div>
            </div>

            <nav className="flex items-center justify-center gap-[4vw] font-poppins pl-[30vw]">
              <div className="relative">
                <button onClick={() => toggleDropdown("features")} className="flex items-center hover:text-[#dbdbdb]">
                  <span>Features</span>
                  <ChevronDown className={`ml-1 w-6 h-6 ${activeDropdown === "features" ? "rotate-180" : ""}`} />
                </button>
              </div>

              <div className="relative">
                <button onClick={() => toggleDropdown("templates")} className="flex items-center hover:text-[#dbdbdb]">
                  <span>Templates</span>
                  <ChevronDown className={`ml-1 w-6 h-6 ${activeDropdown === "templates" ? "rotate-180" : ""}`} />
                </button>
              </div>

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
            </div>
          </div>
        )}

        {/* Desktop Dropdown Menus */}
        {!isMobile && !isTablet && activeDropdown && (
          <div
            className="left-0 right-0 overflow-hidden transition-all duration-1000 z-10"
            style={{
              ...backgroundStyle,
              maxHeight: activeDropdown ? "50vh" : "0",
              opacity: 1,
            }}
          >
            <div className="container py-2">
              <div className="flex flex-col sm:ml-[31.4vw] md:ml-[35.6vw] lg:ml-[38vw]">
                <h3 className="text-lg font-bold mb-[2vh]">CREATE</h3>
                <div className="flex flex-col space-y-[1.5vh]">
                  {(activeDropdown === "features" ? featuresDropdownItems : templatesDropdownItems).map(
                    (item, index) => (
                      <Link
                        href={`/${item.src.toLowerCase().replace(/\s+/g, "-")}`}
                        key={index}
                        className="block py-0 rounded-md transition-all duration-300 hover:text-[#dbdbdb]"
                      >
                        <span>
                          {item.title} {item.coming && "(coming soon)"}
                        </span>
                      </Link>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Dropdown Menu */}
        {isUserDropdownOpen && (
          <div
            className={`absolute right-4 mt-2 w-[180px] bg-black/40 backdrop-blur-3xl rounded-md shadow-lg z-30 animate-dropdown ${
              isMobile || isTablet ? "top-12" : "-ml-[3vw] mt-[1.4vh] w-[8vw] min-w-[150px] right-[4vw]"
            }`}
          >
            <div className="py-2 flex flex-col">
              <div className="px-4 py-2 text-white flex flex-col items-start">
                <span className="text-sm font-semibold">{username || "Guest"}</span>
                <span className="text-xs text-gray-400">{userEmail}</span>
              </div>
              <button onClick={handleLogout} className="px-4 py-2 text-white hover:text-blue-400 flex items-center">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Sidebar Navigation (for all screen sizes) */}
      {isNavOpen && (
        <div
          ref={sidebarRef}
          className="fixed inset-y-0 left-0 z-50 w-64 bg-black shadow-lg transform transition-transform duration-300 ease-in-out"
          style={{ transform: isNavOpen ? "translateX(0)" : "translateX(-100%)" }}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-800">
            <div className="flex items-center">
              <IMAGE src={getImageUrl("core", "logo")} width={30} height={15} alt="logo" className="cursor-pointer" />
              <span className="ml-2 text-xl font-bold">WildMind</span>
            </div>
            <button onClick={() => setIsNavOpen(false)} className="p-1">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User Profile Section */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gray-700 rounded-full p-2">
                <User className="w-6 h-6" />
              </div>
              <div>
                <div className="font-medium">{username || "Guest"}</div>
                <div className="text-xs text-gray-400">{userEmail || "Not signed in"}</div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-4 flex flex-col space-y-4">
            {/* Profile */}
            <div className="flex items-center justify-between py-2 cursor-pointer">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-3" />
                <span>Profile</span>
              </div>
              <ChevronDown className="w-5 h-5" />
            </div>

            {/* User */}
            <div className="flex items-center justify-between py-2 cursor-pointer">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-3" />
                <span>User</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded">20</span>
              </div>
            </div>

            {/* Settings */}
            <div className="flex items-center py-2 cursor-pointer">
              <Settings className="w-5 h-5 mr-3" />
              <span>Settings</span>
            </div>

            {/* Logout */}
            <div className="flex items-center py-2 cursor-pointer" onClick={handleLogout}>
              <LogOut className="w-5 h-5 mr-3" />
              <span>Logout</span>
            </div>

            <div className="border-t border-gray-800 pt-4 mt-4"></div>

            {/* Features Dropdown */}
            <div className="border-b border-gray-800 pb-3">
              <div
                className="flex justify-between items-center py-2 cursor-pointer"
                onClick={() => toggleDropdown("features")}
              >
                <span className="text-lg text-blue-400">Features</span>
                {activeDropdown === "features" ? (
                  <ChevronUp className="w-5 h-5 text-blue-400 transition-transform duration-300" />
                ) : (
                  <ChevronDown className="w-5 h-5 transition-transform duration-300" />
                )}
              </div>

              {activeDropdown === "features" && (
                <div className="pl-4 py-2 space-y-3 animate-in slide-in-from-left">
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">CREATE</h3>
                  {featuresDropdownItems.map((item, index) => (
                    <Link
                      key={index}
                      href={`/${item.src.toLowerCase().replace(/\s+/g, "-")}`}
                      className="block py-1 text-gray-300 hover:text-white transition-colors"
                    >
                      {item.title} {item.coming && <span className="text-gray-500 text-sm">(coming soon)</span>}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Templates Dropdown */}
            <div className="border-b border-gray-800 pb-3">
              <div
                className="flex justify-between items-center py-2 cursor-pointer"
                onClick={() => toggleDropdown("templates")}
              >
                <span className="text-lg">Templates</span>
                {activeDropdown === "templates" ? (
                  <ChevronUp className="w-5 h-5 transition-transform duration-300" />
                ) : (
                  <ChevronDown className="w-5 h-5 transition-transform duration-300" />
                )}
              </div>

              {activeDropdown === "templates" && (
                <div className="pl-4 py-2 space-y-3 animate-in slide-in-from-left">
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">CREATE</h3>
                  {templatesDropdownItems.map((item, index) => (
                    <Link
                      key={index}
                      href={`/${item.src.toLowerCase().replace(/\s+/g, "-")}`}
                      className="block py-1 text-gray-300 hover:text-white transition-colors"
                    >
                      {item.title} {item.coming && <span className="text-gray-500 text-sm">(coming soon)</span>}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Other Links */}
            <Link href={NAV_ROUTES.PRICING} className="py-2 text-lg border-b border-gray-800 pb-3">
              Pricing
            </Link>

            <Link href={NAV_ROUTES.ART_STATION} className="py-2 text-lg border-b border-gray-800 pb-3">
              Art Station
            </Link>
          </div>
        </div>
      )}

      {/* Username Prompt Modal */}
      {showUsernamePrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-[#1e1e1e] p-6 rounded-lg shadow-lg text-white w-[90%] max-w-sm">
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
