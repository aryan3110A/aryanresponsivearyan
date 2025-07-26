"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import {
  IconBrandYoutube,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandFacebook,
} from "@tabler/icons-react";
interface SocialMediaProps {
  selectedPlatform?: string | null
  selectedFormat?: string | null
  onPlatformSelect?: (platform: string) => void
  onFormatSelect?: (format: string) => void
}

export default function SocialMedia({
  selectedPlatform,
  selectedFormat,
  onPlatformSelect,
  onFormatSelect,
}: SocialMediaProps) {
  const [isMainOpen, setIsMainOpen] = useState(false)
  const [openPlatform, setOpenPlatform] = useState<string | null>(null)

  const platforms = [
    {
      name: "Instagram",
      icon: <IconBrandInstagram size={20} />,
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
      borderColor: "border-purple-500",
      bgColor: "bg-purple-500/20",
    },
    {
      name: "LinkedIn",
      icon: <IconBrandLinkedin size={20} />,
      color: "bg-blue-600",
      borderColor: "border-blue-500",
      bgColor: "bg-blue-500/20",
    },
    {
      name: "Facebook",
      icon: <IconBrandFacebook size={20} />,
      color: "bg-blue-700",
      borderColor: "border-blue-500",
      bgColor: "bg-blue-500/20",
    },
    {
      name: "Youtube",
      icon: <IconBrandYoutube size={20}/>,
      color: "bg-red-600",
      borderColor: "border-red-500",
      bgColor: "bg-red-500/20",
    },
  ]

  const formatOptions = ["Profile", "Post"]

  const handlePlatformClick = (platformName: string) => {
    if (onPlatformSelect) {
      onPlatformSelect(platformName)
    }
    setOpenPlatform(openPlatform === platformName ? null : platformName)
  }

  const handleFormatSelect = (format: string) => {
    if (onFormatSelect) {
      onFormatSelect(format)
    }
  }

  const getPlatformConfig = (platformName: string) => {
    return platforms.find((p) => p.name === platformName) || platforms[0]
  }

  return (
    <div className="px-2 md:px-6 mb-6">
      {/* Divider */}
      <div className=" md:mx-0 border-t border-white/15 mb-6"></div>

      {/* Main Social Media Frame Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-lg md:text-xl font-medium">Social Media Frame</h3>
        <button onClick={() => setIsMainOpen(!isMainOpen)} className="p-1">
          <ChevronDown className={`text-white h-5 w-5 transition-transform ${isMainOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {isMainOpen && (
        <div className="space-y-2">
          {platforms.map((platform) => (
            <div
              key={platform.name}
              className="bg-white/10 backdrop-blur-sm border border-gray-600/50 rounded-xl overflow-hidden"
            >
              {/* Platform Header */}
              <div
                className="flex items-center justify-between p-3 pl-4 cursor-pointer hover:bg-gray-700/30 transition-colors text-xs md:text-md font-medium"
                onClick={() => handlePlatformClick(platform.name)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 ${platform.color} rounded-lg flex items-center justify-center text-white text-lg`}
                  >
                    {platform.icon}
                  </div>
                  <span className="text-white font-medium text-lg">{platform.name}</span>
                </div>
                <ChevronDown
                  className={`text-white h-5 w-5 transition-transform ${
                    openPlatform === platform.name ? "rotate-180" : ""
                  }`}
                />
              </div>

              {/* Format Options */}
              {openPlatform === platform.name && (
                <div className="px-4 pb-4 space-y-2 pt-2">
                  {formatOptions.map((format) => {
                    const isSelected = selectedPlatform === platform.name && selectedFormat === format
                    const config = getPlatformConfig(platform.name)

                    return (
                      <div
                        key={format}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                          isSelected
                            ? `bg-white/5 border-2 border-[#6C3BFF]`
                            : "bg-white/5 hover:bg-[#4A4A4A]/60 border-2 border-transparent"
                        }`}
                        onClick={() => handleFormatSelect(format)}
                      >
                        <span className="text-white font-medium">{format}</span>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected
                              ? `${config.borderColor.replace("border-", "border-")} bg-current`
                              : "border-[#6C3BFF]"
                          }`}
                        >
                          {isSelected && <div className="w-3 h-3 bg-[#6C3BFF] rounded-full"></div>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
