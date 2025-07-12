"use client"

import type React from "react"

import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { X, Settings, Home, FileText, Bookmark, ChevronsDown } from "lucide-react"

import { getImageUrl } from "@/routes/imageroute"
import SettingNavigation from "./Setting"
import { IconBrandBlogger, IconBrandX, IconBrandYoutube, IconBrandInstagram } from "@tabler/icons-react"
import Link from "next/link"
import { NAV_ROUTES } from "@/routes/routes"
import { useTokenUpdate } from "@/app/utils/tokenManager"

interface NavItem {
  label: string
  href: string
  icon?: React.ReactNode
}

interface SocialLink {
  icon: React.ElementType
  href: string
  hoverColor: string
  borderHoverColor: string
  glowColor: string
}

const sidebarItems: NavItem[] = [
  
  { label: "Home", href: "/view/home/${userSlug}", icon: <Home className="w-5 h-5" /> },
  { label: "Features", href: "/view/home/${userSlug}", icon: <ChevronsDown className="w-5 h-5" /> },
  {
    label: "Templates",
    href: NAV_ROUTES.TEMPLATES,
    icon: <FileText className="w-5 h-5" />,
  },
  {
    label: "Bookmark",
    href: NAV_ROUTES.BOOKMARK,
    icon: <Bookmark className="w-5 h-5" />,
  },
]

const plansetting: NavItem[] = [
  {
    label: "Plans",
    href: NAV_ROUTES.PRICING,
    icon: (
      <Image
        src={getImageUrl("core", "diamond") || "/placeholder.svg"}
        alt="Diamond"
        width={20}
        height={20}
        className=""
      />
    ),
  },
  {
    label: "Setting",
    href: "NAV_ROUTES",
    icon: <Settings className="w-5 h-5" />,
  },
]

const socialLinks: SocialLink[] = [
  {
    icon: IconBrandX,
    href: "/X",
    hoverColor: "hover:text-blue-500",
    borderHoverColor: "hover:border-blue-500",
    glowColor: "hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]",
  },
  {
    icon: IconBrandInstagram,
    href: "Instagram",
    hoverColor: "hover:text-pink-500",
    borderHoverColor: "hover:border-pink-500",
    glowColor: "hover:shadow-[0_0_15px_rgba(236,72,153,0.5)]",
  },
  {
    icon: IconBrandBlogger,
    href: "Blogger",
    hoverColor: "hover:text-green-500",
    borderHoverColor: "hover:border-green-500",
    glowColor: "hover:shadow-[0_0_15px_rgba(34,197,94,0.5)]",
  },
  {
    icon: IconBrandYoutube,
    href: "Youtube",
    hoverColor: "hover:text-red-500",
    borderHoverColor: "hover:border-red-500",
    glowColor: "hover:shadow-[0_0_15px_rgba(220,38,38,0.5)]",
  },
]

export default function Hamburger({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const availableTokens = useTokenUpdate()
  // const scrollRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const handleSettingsClick = () => {
    setIsSettingsOpen(!isSettingsOpen)
  }

  const handleSettingsClose = () => {
    setIsSettingsOpen(false)
  }

  useEffect(() => {
    if (!isOpen && isSettingsOpen) {
      setIsSettingsOpen(false)
    }
  }, [isOpen, isSettingsOpen])

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



  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => {
            onClose()
            setIsSettingsOpen(false)
          }}
        />
      )}
      <nav
        className={`fixed top-0 left-0 bottom-0 w-[90vw] max-w-[320px] bg-[#101011] transform transition-transform duration-300 ease-in-out z-40 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >

        
        <div className="h-full flex flex-col font-poppins bg-[#101011] overflow-y-auto">
          {/* Header with Close Button */}
          <div className="flex justify-end p-2 bg-[#101011] pt-14">
            <button onClick={onClose} className="p-2  rounded-lg transition-colors">
              <X className="w-10 h-10 text-white" />
            </button>
          </div>

          <div className="-mt-2 flex-1 px-4 pb-4 space-y-2 bg-[#101011] ">



            {/* Token Display */}
            <div className="bg-[#272727] rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2  ">
                  <Image src={getImageUrl("core", "coins") || "/placeholder.svg"} alt="coins" width={20} height={20} />
                  <span className="text-white font-medium">{availableTokens}</span>
                </div>
                <button
                  onClick={() => router.push(NAV_ROUTES.PRICING)}
                  className="flex items-center bg-gradient-to-b from-[#6C3BFF] to-[#412399] text-white text-sm px-4 py-2 rounded-xl gap-2 font-medium"
                >
                  <Image
                    src={getImageUrl("core", "diamond") || "/placeholder.svg"}
                    alt="diamond"
                    width={16}
                    height={16}
                  />
                  Upgrade
                </button>
              </div>
              <div className="text-sm text-[#00F0FF]">
                Current Plan <span className="text-gray-400">{">"}</span> <span className="text-white">Basic</span>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="space-y-3">
            <div className="border-b border-[#272727] w-[97%] mt-[5%] mx-auto"></div>

              {sidebarItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-4 p-4 rounded-lg bg-[#2a2a2a] hover:bg-gradient-to-r hover:from-[#6C3BFF] hover:to-[#412399] transition-all duration-200 text-white"
                  onClick={() => {
                    onClose()
                    setIsSettingsOpen(false)
                  }}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
                          <div className="border-b border-[#272727] w-[97%] mt-[5%] mx-auto"></div>

            </div>
              
            {/* Plans and Settings */}
            <div className="space-y-3">
              {plansetting.map((item) =>
                item.label === "Setting" ? (
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-4 p-4 rounded-lg bg-[#272727] hover:bg-gradient-to-r hover:from-[#6C3BFF] hover:to-[#412399] transition-all duration-200 text-white text-left"
                    onClick={() => {
                      handleSettingsClick()
                    }}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </button>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-4 p-4 rounded-lg bg-[#2a2a2a] hover:bg-gradient-to-r hover:from-[#6C3BFF] hover:to-[#412399] transition-all duration-200 text-white"
                    onClick={() => {
                      onClose()
                      setIsSettingsOpen(false)
                    }}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ),
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#272727]">
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Image
                  src={getImageUrl("core", "logo") || "/placeholder.svg"}
                  alt="WildMind Logo"
                  width={32}
                  height={32}
                />
                <span className="text-white font-bold text-4xl">WildMind</span>
              </div>
              <p className="text-xs text-[#9F9F9F] mb-4">We growing up your business with personal AI manager</p>
            </div>

            {/* Footer Links */}
            <div className="flex justify-center gap-4 text-xs text-white mb-4">
              <a href="#" className="hover:text-gray-300">
                Terms of uses
              </a>
              <span>•</span>
              <a href="#" className="hover:text-gray-300">
                Privacy Policy
              </a>
              <span>•</span>
              <a href="#" className="hover:text-gray-300">
                DMCA
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex justify-center gap-3">
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border border-[#525252] bg-[#1B1B1C] 
                  transition-all duration-200 hover:scale-110 ${social.hoverColor} ${social.borderHoverColor} ${social.glowColor}`}
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Settings UI */}
        <SettingNavigation isOpen={isSettingsOpen} onClose={handleSettingsClose} />
      </nav>
    </>
  )
}
