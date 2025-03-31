"use client"
import Image from "next/image"
import {APP_ROUTES, NAV_ROUTES} from "../../../routes/routes";

import { useState, useEffect, useRef } from "react"
import {
  ChevronDown,
  X,
  Home,
  Grid,
  Boxes,
  FileText,
  FolderKanban,
  Settings,
  LogOut,
  Bookmark,
} from "lucide-react"

import {
  IconBrandBlogger,
  IconBrandGithub,
  IconBrandYoutube,
  IconBrandInstagram,
} from "@tabler/icons-react";

import Link from "next/link"
import type { JSX } from "react"
import SettingNavigation from "./Setting";

interface NavbarProps {
  isOpen: boolean
  onClose: () => void
}

interface Profile {
  name: string
  credits: number
  isActive?: boolean
}

interface NavItem {
  label: string
  href: string
  icon?: JSX.Element
}

interface SocialLink {
  icon: React.ElementType
  href: string
  hoverColor: string
  borderHoverColor: string
  glowColor: string
}

const profiles: Profile[] = [
  { name: "Name 1", credits: 20, isActive: true },
  { name: "Name 2", credits: 120 },
]

const sidebarItems: NavItem[] = [
  { label: "Home", href: APP_ROUTES.HOME, icon: <Home className="w-6 h-6" /> },
  { label: "Apps", href: "/apps", icon: <Grid className="w-5 h-5" /> },
  { label: "Models", href: "/models", icon: <Boxes className="w-5 h-5" /> },
  {
    label: "Templates",
    href:NAV_ROUTES.TEMPLATES,
    icon: <FileText className="w-6 h-6" />,
  },
  {
    label: "Projects",
    href: "/projects",
    icon: <FolderKanban className="w-6 h-6" />,
  },
  {
    label: "Bookmark",
    href: "/Booksmarks",
    icon: <Bookmark className="w-6 h-6" />,
  },
]

const plansetting: NavItem[] = [
  {
    label: "Plans",
    href: NAV_ROUTES.PRICING,
    icon: <Image src="/navigationSetting/diamond.png" alt="User" width={20} height={20} className="" />,
  },
  {
    label: "Settings",
    href: "#",
    icon: <Settings className="w-5 h-5" />,
  },
]

const socialLinks: SocialLink[] = [
  {
    icon: IconBrandGithub, // Using Github icon as a substitute for Discord
    href: "/Github",
    hoverColor: "hover:text-blue-500",
    borderHoverColor: "hover:border-blue-500",
    glowColor: "hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]",
  },
  {
    icon: IconBrandInstagram,
    href: "Instagram",
    hoverColor: "hover:text-pink-800",
    borderHoverColor: "hover:border-pink-800",
    glowColor: "hover:shadow-[0_0_15px_rgba(236,72,153,0.5)]",
  },
  {
    icon: IconBrandYoutube,
    href: "Youtube",
    hoverColor: "hover:text-red-700",
    borderHoverColor: "hover:border-red-700",
    glowColor: "hover:shadow-[0_0_15px_rgba(220,38,38,0.5)]",
  },
  {
    icon: IconBrandBlogger,
    href: "Blogger",
    hoverColor: "hover:text-green-500",
    borderHoverColor: "hover:border-green-500",
    glowColor: "hover:shadow-[0_0_15px_rgba(34,197,94,0.5)]",
  },
]

export default function Hamburger({ isOpen, onClose }: NavbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [showCloseButton, setShowCloseButton] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Function to handle settings click - toggle settings
  const handleSettingsClick = () => {
    setIsSettingsOpen(!isSettingsOpen)
  }

  // Close settings when hamburger closes
  useEffect(() => {
    if (!isOpen && isSettingsOpen) {
      setIsSettingsOpen(false)
    }
  }, [isOpen, isSettingsOpen])

  // Prevent body scrolling when hamburger menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Handle scroll to show/hide close button
  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    const handleScroll = () => {
      if (scrollContainer.scrollTop > 50) {
        setShowCloseButton(false)
      } else {
        setShowCloseButton(true)
      }
    }

    scrollContainer.addEventListener("scroll", handleScroll)
    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => {
            onClose()
            setIsSettingsOpen(false)
          }}
        />
      )}

      {/* Sliding Navbar */}
      <nav
        className={`fixed top-0 left-0 bottom-0 w-[20vw] max-w-[280px] min-w-[250px] bg-[#171717] border-r border-gray-800 
          transform transition-transform duration-300 ease-in-out z-40 flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-full flex flex-col overflow-hidden font-poppins">
          {/* Scrollable Content Area */}
          <div
  ref={scrollRef}
  className="flex-1 overflow-y-auto overflow-x-hidden p-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
>

            {/* Close Button - Only visible when at top */}
            <div
              className={`transition-opacity duration-0 ${showCloseButton ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            >
              <button onClick={onClose} className="absolute top-4 right-4 mt-[8%] rounded-lg transition-colors">
                <X className="w-10 h-10" />
              </button>
            </div>

            {/* Profile Button */}
            <div className="relative mt-[30%]">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-[#252525] hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3 ml-[2%]">
                  <Image src="/navigationSetting/profile.png" alt="User" width={32} height={32} className="rounded-full object-cover" />
                  <span>Profile</span>
                </div>
                <ChevronDown className={`w-6 h-6 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute top-full left-0 w-full mt-2 bg-[#252525] rounded-lg border border-gray-800 shadow-xl z-50 max-h-[60vh] overflow-y-auto">
                  <div className="p-2">
                    <div className="flex items-center gap-3 ml-[4%] mb-1">
                      <Image
                        src="/navigationSetting/profile.png"
                        alt="User"
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                      <span>Profile</span>
                    </div>
                    {profiles.map((profile, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-500/20 transition-colors cursor-pointer"
                      >
                        <Image
                          src="/navigationSetting/profile.png"
                          alt="User"
                          width={32}
                          height={32}
                          className="rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-sm">
                            <span>{profile.name}</span>
                            {profile.isActive && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-400">
                            <Image src="/navigationSetting/coins.png" alt="User" width={16} height={16} className="" />
                            <div className="bg-gray-800 rounded px-1 text-xs">{profile.credits}</div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      className="w-full flex items-center gap-3 p-1 rounded-lg hover:bg-blue-500/20 transition-colors mt-0"
                    >
                      <Image src="/navigationSetting/plus.png" alt="User" width={40} height={40} className="" />
                      <span className="text-md -ml-2">Add profile</span>
                    </button>

                    <div className="border-t border-gray-800 my-0" />

                    <button
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-blue-500/20 transition-colors"
                      onClick={handleSettingsClick}
                    >
                      <Settings className="w-5 h-5" />
                      <span className="text-sm">Settings</span>
                    </button>

                    <button
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-blue-500/20 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Credits Display */}
            <div className="flex items-center mt-[6%] bg-gray-900/50 rounded-lg pl-[16%] lg:gap-0 md:gap-6">
              {/* "20" Div */}
              <div className="items gap-0">
                <div className="flex rounded-full py-[1vh] pl-2 w-[6vw] border-2 gap-1 border-[#484848] bg-black text-white text-xs">
                  <Image src="/navigationSetting/coins.png" alt="User" width={20} height={20} className="" />
                  <div className="flex items-center gap-3"></div> 20
                </div>
              </div>

              {/* Upgrade Button Overlapping */}
              <button className="flex bg-gradient-to-b from-[#5AD7FF] to-[#656BF5] text-[0.72rem] px-2 py-[1.2vh] rounded-full hover:bg-blue-600 transition-colors -ml-[24%] gap-1">
                <Image src="/navigationSetting/diamond.png" alt="User" width={16} height={16} className="" /> Upgrade
              </button>
            </div>

            {/* Current Plan Text */}
            <div className="text-[11px] ml-[26%] text-white mt-[1%]">Current Plan {">"} Basic</div>

            <div className="border-b-2 border-[#5A5A5A] bg-[#252525] w-[100vw] mt-[2%] -ml-[6%]"></div>

            {/* Navigation Items */}
            <div className="flex flex-col gap-1 mt-[4%] w-[200%] -ml-[6%] font-poppins">
              {sidebarItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-4 p-3 py-[2.5%] transition-colors pl-[6%] text-white hover:bg-gradient-to-b from-[#5AD7FF] to-[#656BF5]"
                  onClick={() => {
                    onClose()
                    setIsSettingsOpen(false)
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="border-b-2 border-[#5A5A5A] bg-[#252525] w-[100vw] mt-[5%] -ml-[6%]"></div>

            {/* Plans and Settings Section - Now Scrollable */}
            <div className="flex flex-col gap-1 mt-[6%] w-[200%] -ml-[6%] font-poppins max-h-[30vh] overflow-y-auto">
              {plansetting.map((item) =>
                item.label === "Settings" ? (
                  <button
                    key={item.label}
                    className="flex items-center gap-4 p-3 py-[2.5%] transition-colors pl-[6%] text-white hover:bg-gradient-to-b from-[#5AD7FF] to-[#656BF5] text-left"
                    onClick={() => {
                      handleSettingsClick()
                    }}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-4 p-3 py-[2.5%] transition-colors pl-[6%] text-white hover:bg-gradient-to-b from-[#5AD7FF] to-[#656BF5]"
                    onClick={() => {
                      onClose()
                      setIsSettingsOpen(false)
                    }}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ),
              )}
            </div>
          </div>

          {/* WildMind Footer - Fixed at bottom */}
          <div className="bg-[#171717] p-[5%] font-poppins border-t border-gray-800">
            <div className="flex flex-col items-start">
              {/* Logo */}
              <div className="flex items-center gap-[6%] pb-4 justify-center pl-[2vw]">
                <Image src="/Core/Logomain.png" alt="WildMind Logo" width={32} height={32} className="" />
                <span className="text-white font-bold text-3xl">WildMind</span>
              </div>

              {/* Tagline */}
              <p className="flex items-center justify-center -mt-[2vh] text-xs text-gray-400 mb-[5%]">
                We growing up your business with personal AI manager
              </p>

              {/* Links */}
              <div className="flex text-xs text-gray-500 mb-4">
                <a href="#" className="hover:text-gray-300 flex-nowrap">
                  Terms of uses
                </a>
                <a href="#" className="hover:text-gray-300 flex-nowrap ml-[1.2vw]">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-gray-300 flex-nowrap ml-[1.4vw]">
                  DMCA
                </a>
              </div>

              {/* Social Icons */}
              <div className="flex justify-center w-full gap-4">
                {socialLinks.map((social, index) => (
                  <div key={index} className="relative group">
                    {/* Social Icon */}
                    <Link
                      href={social.href}
                      className={`w-10 h-10 rounded-full flex items-center justify-center border border-[#545454] bg-[#1E1E1E] 
                      transition-transform duration-200 ease-in-out transform-gpu will-change-transform hover:scale-110 
                      ${social.hoverColor} ${social.borderHoverColor} ${social.glowColor}`}
                    >
                      <social.icon className="w-5 h-5 transition-transform duration-100 ease-in-out" />
                    </Link>
                    
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Settings Component - now passing hamburger state */}
      <SettingNavigation
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        hamburgerOpen={isOpen}
        profiles={profiles}
      />
    </>
  )
}

