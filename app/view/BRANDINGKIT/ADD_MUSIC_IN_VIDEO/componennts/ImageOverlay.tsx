"use client"

import { useState } from "react"
import { X, Share2, Bookmark, Heart, Download, Copy, ChevronDown } from "lucide-react"
import Image from "next/image"

interface ImageOverlayProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  prompt: string
  model: string
  musicType: string
  likes?: number
}

export default function ImageOverlay({
  isOpen,
  onClose,
  imageUrl,
  prompt,
  model,
  musicType,
  likes = 8,
}: ImageOverlayProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  if (!isOpen) return null

  const handleRemix = () => {
    console.log("Remix clicked")
    // Implement remix functionality
  }

  const handleShare = () => {
    console.log("Share clicked")
    // Implement share functionality
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    console.log("Bookmark clicked")
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    console.log("Like clicked")
  }

  const handleDownload = async () => {
    try {
      console.log("Starting download...")

      // Fetch the image
      const response = await fetch(imageUrl)
      if (!response.ok) {
        throw new Error("Failed to fetch image")
      }

      // Convert to blob
      const blob = await response.blob()

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url

      // Set filename based on prompt and timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-")
      const promptSlug = prompt
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .slice(0, 30)
      const filename = `${promptSlug}-${timestamp}.png`
      link.download = filename

      // Trigger download
      document.body.appendChild(link)
      link.click()

      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      console.log(`Image downloaded successfully as ${filename}`)
    } catch (error) {
      console.error("Download failed:", error)
      // You could show a toast notification here
      alert("Failed to download image. Please try again.")
    }
  }

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt)
    console.log("Prompt copied")
  }

  return (
    <>
      {/* Desktop Layout - Properly Centered */}
      <div className="hidden md:flex fixed inset-0 bg:transparent backdrop-blur-3xl shadow-sm z-50 items-center justify-center md:py-10 lg:py-10">
        {/* Modal Container - Centered */}
        <div className="relative w-full md:max-w-6xl lg:max-w-7xl h-full max-h-[90vh] bg-white/10 backdrop-blur-3xl shadow-3xl rounded-2xl overflow-hidden flex md:p-10 lg:p-10">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-white hover:bg-white/10 rounded-lg transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>
          {/* Left Side - Image with Play Button */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-full h-full md:max-w-2xl lg:max-w-3xl max-h-full">
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt="Generated image"
                width={1080}
                height={1080}
                className="w-full h-full object-contain rounded-3xl"
              />
              {/* Play Button Overlay */}
              <button className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center shadow-lg">
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="18" cy="18" r="18" fill="#6C3BFF" fillOpacity="0.8"/>
                    <polygon points="14,11 27,18 14,25" fill="white" />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          {/* Right Side - Info Panel */}
          <div className="w-80 md:w-80 lg:w-96 bg-white/15 flex flex-col md:mr-6 lg:mr-10 rounded-xl">
            {/* Header with Remix and Action Buttons */}
            <div className="px-6 lg:pt-6 md:pt-4 ">
              <div className="flex items-center justify-between mb-4 md:mb-2">
                {/* Remix Button */}
                <button
                  onClick={handleRemix}
                  className="bg-transparent text-white py-1 px-8 rounded-lg font-medium border border-[#00F0FF]"
                >
                  Remix
                </button>

                {/* Action Buttons */}
                <div className="flex items-center gap-0">
                  <button onClick={handleShare} className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleBookmark}
                    className={`p-2 transition-colors ${isBookmarked ? "text-yellow-400" : "text-gray-400 hover:text-white"}`}
                  >
                    <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
                  </button>
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-1 p-2 transition-colors ${isLiked ? "text-red-400" : "text-gray-400 hover:text-white"}`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                    <span className="text-sm">{isLiked ? likes + 1 : likes}</span>
                  </button>
                  <button onClick={handleDownload} className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Prompt Section */}
            <div className="px-6">
              <div className="flex items-center bg-white/10 rounded-md px-3 py-2 md:py-1 lg:py-2 justify-between w-full">
                <p className="text-white md:text-xs lg:text-sm leading-relaxed truncate">Prompt: {prompt}</p>
                <button
                  onClick={handleCopyPrompt}
                  className="p-2 text-gray-400 hover:text-white transition-colors flex-shrink-0"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Info Fields */}
            <div className="px-6 pt-4 space-y-2">
              <div className="bg-white/10 rounded-md px-3 py-2 text-white text-sm flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span>Model :</span>
                  <span className="font-semibold">{model}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Type of music :</span>
                  <span className="font-semibold">{musicType}</span>
                </div>
              </div>
            </div>

            {/* Original Video Section */}
            <div className="px-6 pt-4">
              <span className="text-white text-sm font-medium mb-2 block">Original Video <ChevronDown className="inline w-4 h-4 ml-1" /></span>
              <div className="w-full aspect-square bg-transparent rounded-lg overflow-hidden border border-white/10 relative">
                <Image
                  src={imageUrl || "/placeholder.svg"}
                  alt="Original video thumbnail"
                  width={200}
                  height={200}
                  className="w-full h-full object-contain"
                />
                {/* Play Button Overlay */}
                <button className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center shadow-lg">
                    <svg width="28" height="28" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="18" cy="18" r="18" fill="#6C3BFF" fillOpacity="0.8"/>
                      <polygon points="14,11 27,18 14,25" fill="white" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Layout - New responsive design */}
      <div className="md:hidden fixed inset-0 bg:transparent backdrop-blur-3xl shadow-sm z-50 pt-14 px-6 ">
        {/* Close Button - Fixed position */}
        <button
          onClick={onClose}
          className="fixed top-14 right-6 p-2 text-white hover:bg-white/10 rounded-lg transition-colors z-20"
        >
          <X className="w-7 h-7" />
        </button>

        {/* Scrollable Content Container */}
        <div className="h-full overflow-y-auto bg-white/10 rounded-xl ">
          {/* Image Section - Top */}
          <div className="flex items-center justify-center px-4  min-h-[50vh] ">
            <div className="relative w-full max-w-sm">
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt="Generated image"
                width={400}
                height={400}
                className="w-full h-auto object-contain rounded-2xl "
              />
              {/* Play Button Overlay */}
              <button className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center shadow-lg">
                  <svg width="28" height="28" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="18" cy="18" r="18" fill="#6C3BFF" fillOpacity="0.8"/>
                    <polygon points="14,11 27,18 14,25" fill="white" />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          {/* Info Panel Section - Bottom */}
          <div className="bg-white/15 mx-4 mb-4 rounded-xl -mt-4">
            {/* Header with Remix and Action Buttons */}
            <div className="px-4 pt-4">
              <div className="flex items-center justify-between mb-4">
                {/* Remix Button */}
                <button
                  onClick={handleRemix}
                  className="bg-transparent text-white py-1 px-6 rounded-lg font-medium border border-[#00F0FF] text-sm"
                >
                  Remix
                </button>

                {/* Action Buttons */}
                <div className="flex items-center gap-1">
                  <button onClick={handleShare} className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleBookmark}
                    className={`p-2 transition-colors ${isBookmarked ? "text-yellow-400" : "text-gray-400 hover:text-white"}`}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                  </button>
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-1 p-2 transition-colors ${isLiked ? "text-red-400" : "text-gray-400 hover:text-white"}`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                    <span className="text-xs">{isLiked ? likes + 1 : likes}</span>
                  </button>
                  <button onClick={handleDownload} className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Prompt Section */}
            <div className="px-4 mb-4">
              <div className="flex items-center bg-white/10 rounded-md px-3 py-2 justify-between w-full">
                <p className="text-white text-xs leading-relaxed truncate flex-1">Prompt: {prompt}</p>
                <button
                  onClick={handleCopyPrompt}
                  className="p-1 text-gray-400 hover:text-white transition-colors flex-shrink-0 ml-2"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Info Fields */}
            <div className="px-4 mb-4">
              <div className="bg-white/10 rounded-md px-3 py-2 text-white text-xs flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span>Model :</span>
                  <span className="font-semibold">{model}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Type of music :</span>
                  <span className="font-semibold">{musicType}</span>
                </div>
              </div>
            </div>

            {/* Original Video Section */}
            <div className="px-4 pb-4">
              <span className="text-white text-xs font-medium mb-2 block">Original Video <ChevronDown className="inline w-3 h-3 ml-1" /></span>
              <div className="w-full max-w-48 mx-auto aspect-square bg-transparent rounded-lg overflow-hidden border border-white/10 relative">
                <Image
                  src={imageUrl || "/placeholder.svg"}
                  alt="Original video thumbnail"
                  width={200}
                  height={200}
                  className="w-full h-full object-contain"
                />
                {/* Play Button Overlay */}
                <button className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-lg">
                    <svg width="20" height="20" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="18" cy="18" r="18" fill="#6C3BFF" fillOpacity="0.8"/>
                      <polygon points="14,11 27,18 14,25" fill="white" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
