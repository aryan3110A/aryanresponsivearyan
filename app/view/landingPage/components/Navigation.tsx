"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { onAuthStateChanged } from "firebase/auth"
import { auth, db } from "@/database/firebase"
import { doc, getDoc } from "firebase/firestore"
import { APP_ROUTES, NAV_ROUTES, FEATURE_ROUTES } from "../../../../routes/routes"

const Navigation = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [scrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userSlug, setUserSlug] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // check auth state on mount
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true)
        const docRef = doc(db, "users", user.email || "")
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = docSnap.data()
          if (data?.slug) {
            setUserSlug(data.slug) // get the unique slug
          }
        }
      } else {
        setIsLoggedIn(false)
        setUserSlug("")
      }
    })

    return () => unsubscribe()
  }, [])

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown)
  }

  const handleGetStarted = () => {
    if (isLoggedIn && userSlug) {
      router.push(`/view/home/${userSlug}`)
    } else {
      router.push(APP_ROUTES.SIGNUP)
    }
  }

  return (
    <>
      {/* Desktop Navigation */}
      <div
        className={`fixed top-5 left-1/2 -translate-x-1/2 z-[1000] items-center justify-between p-2 rounded-[50px] 
        border-[1px] border-white/20 w-[90vw] md:w-[70vw] lg:w-[45vw] text-white
        ${
          scrolled ? "backdrop-blur-xl bg-black/30 shadow-lg" : "backdrop-blur-xl bg-black/10 shadow-lg"
        } transition-all duration-300 hidden md:flex`}
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
            className="cursor-pointer px-3 py-1 flex items-center gap-1 hover:bg-gradient-to-l hover:bg-clip-text font-poppins bg-transparent hover:text-[#dbdbdb]"
          >
            Features
            <Image
              width={12}
              height={12}
              src={activeDropdown === "features" ? "/Core/arrowup.svg" : "/Core/arrowdown.svg"}
              alt="dropdown-arrow"
              className="ml-1"
            />
          </span>

          {activeDropdown === "features" && (
            <ul className="absolute left-1/2 -translate-x-1/2 mt-4 w-80 bg-black text-white rounded-lg border border-[#5f5e5e] shadow-[6px_6px_10px_rgba(0,0,0,0.6)] p-3 flex flex-col items-center overflow-hidden whitespace-nowrap">
              <li
                className="w-full px-3 py-2 cursor-pointer text-center hover:text-[#dbdbdb] hover:bg-gradient-to-l hover:bg-clip-text"
                onClick={() => router.push(FEATURE_ROUTES.IMAGE_GENERATION)}
              >
                Text to image
              </li>
              <li className="w-full px-3 py-2 cursor-pointer text-center hover:text-[#dbdbdb] hover:bg-gradient-to-l hover:bg-clip-text">
                Text to video (coming soon)
              </li>
              <li className="w-full px-3 py-2 cursor-pointer text-center hover:text-[#dbdbdb] hover:bg-gradient-to-l hover:bg-clip-text">
                Sketch to image (coming soon)
              </li>
              <li className="w-full px-3 py-2 cursor-pointer text-center hover:text-[#dbdbdb] hover:bg-gradient-to-l hover:bg-clip-text">
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
              src={activeDropdown === "templates" ? "/Core/arrowup.svg" : "/Core/arrowdown.svg"}
              alt="dropdown-arrow"
              className="ml-1"
            />
          </span>
          {activeDropdown === "templates" && (
            <ul className="absolute left-1/2 -translate-x-1/2 mt-4 w-80 bg-black text-white rounded-lg border border-[#5f5e5e] shadow-[6px_6px_10px_rgba(0,0,0,0.6)] p-3 flex flex-col items-center overflow-hidden whitespace-nowrap">
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
          <span
            className="px-3 py-1 hover:bg-gradient-to-l hover:bg-clip-text cursor-pointer hover:text-[#dbdbdb]"
            onClick={() => router.push(NAV_ROUTES.PRICING)}
          >
            Pricing
          </span>
        </div>
        <div>
          <span
            className="px-3 py-1 hover:bg-gradient-to-l hover:bg-clip-text cursor-pointer hover:text-[#dbdbdb]"
            onClick={() => router.push(NAV_ROUTES.ART_STATION)}
          >
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

      {/* Mobile Navigation */}
      <div className="fixed top-0 left-0 w-full z-[1000] md:hidden">
        <div className="flex items-center justify-between p-4 bg-black/80 backdrop-blur-xl">
          <div className="flex items-center">
            <Image src="/Core/Logomain.png" width={30} height={30} alt="Main Logo" />
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-2">
            {isMobileMenuOpen ? (
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
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
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
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="bg-black/95 backdrop-blur-xl text-white p-4 animate-in slide-in-from-top">
            <div className="flex flex-col space-y-4">
              <div className="border-b border-white/10 pb-2">
                <div className="flex items-center justify-between py-2" onClick={() => toggleDropdown("features")}>
                  <span>Features</span>
                  <span>{activeDropdown === "features" ? "▲" : "▼"}</span>
                </div>
                {activeDropdown === "features" && (
                  <div className="pl-4 py-2 space-y-2">
                    <div className="py-1">Text to image</div>
                    <div className="py-1">Text to video (coming soon)</div>
                    <div className="py-1">Sketch to image (coming soon)</div>
                    <div className="py-1">Real-time generation (coming soon)</div>
                  </div>
                )}
              </div>

              <div className="border-b border-white/10 pb-2">
                <div className="flex items-center justify-between py-2" onClick={() => toggleDropdown("templates")}>
                  <span>Templates</span>
                  <span>{activeDropdown === "templates" ? "▲" : "▼"}</span>
                </div>
                {activeDropdown === "templates" && (
                  <div className="pl-4 py-2 space-y-2">
                    <div className="py-1">Image generation</div>
                    <div className="py-1">Video generation (Coming soon)</div>
                  </div>
                )}
              </div>

              <div className="py-2 border-b border-white/10" onClick={() => router.push(NAV_ROUTES.PRICING)}>
                Pricing
              </div>

              <div className="py-2 border-b border-white/10" onClick={() => router.push(NAV_ROUTES.ART_STATION)}>
                Art Station
              </div>

              <button
                className="mt-4 w-full bg-gradient-to-r from-[#5AD7FF] to-[#656BF5] text-white rounded-full py-2 px-6"
                onClick={handleGetStarted}
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Navigation
