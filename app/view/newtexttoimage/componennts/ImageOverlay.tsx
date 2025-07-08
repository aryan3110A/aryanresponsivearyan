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
  modelSelection: string
  stylePalette: string
  imageQuality: string
  frameSize: string
  numberOfImages: number
  likes?: number
}

export default function ImageOverlay({
  isOpen,
  onClose,
  imageUrl,
  prompt,
  
  modelSelection,
  stylePalette,
  imageQuality,
  frameSize,
  numberOfImages,
  likes = 8,
}: ImageOverlayProps) {
  const [isOriginalImageOpen, setIsOriginalImageOpen] = useState(true)
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
    <div className="fixed inset-0  bg:transparent backdrop-blur-3xl shadow-sm z-50 flex items-center justify-center md:py-10 lg:py-10 ">
      {/* Close Button */}

      {/* Modal Container */}
      <div className="w-full md:max-w-6xl lg:max-w-7xl h-full max-h-[90vh] bg-white/10 backdrop-blur-3xl shadow-3xl rounded-2xl overflow-hidden flex md:p-10 lg:p-10">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-white hover:bg-white/10 rounded-lg transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>
        {/* Left Side - Image */}
        <div className="flex-1 flex items-center justify-center  ">
          <div className="relative w-full h-full md:max-w-2xl lg:max-w-3xl max-h-full ">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt="Generated image"
              width={1080}
              height={1080}
              className="w-full h-full object-contain rounded-3xl "
            />
          </div>
        </div>

        {/* Right Side - Info Panel */}
        <div className="w-80 md:w-80 lg:w-96 bg-white/15  flex flex-col md:mr-6 lg:mr-10 rounded-xl">
          {/* Header with Remix and Action Buttons */}
          <div className="px-6 pt-6">
            <div className="flex items-center justify-between mb-4">
              {/* Remix Button */}
              <button
                onClick={handleRemix}
                className="bg-transparent  text-white py-1 px-8 rounded-lg  font-medium border border-[#00F0FF]"
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
            <div className="flex items-center bg-white/10 rounded-md px-3 py-2 justify-between w-full">
              <p className="text-white md:text-xs lg:text-sm leading-relaxed truncate">Prompt: {prompt}</p>
              <button
                onClick={handleCopyPrompt}
                className="p-2 text-gray-400 hover:text-white transition-colors flex-shrink-0 "
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Settings Summary - Styled like SettingsPanel */}
          <div className="px-6 py-4 flex-1 overflow-y-auto">
            <div className="bg-white/5 backdrop-blur-3xl hover:bg-white/20 rounded-lg p-4 space-y-3 md:text-xs lg:text-  text-gray-300 transition-colors">
              <div className="flex justify-between">
                <span className="text-white">Model Selection: {modelSelection}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Style Palette: {stylePalette}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Image Quality: {imageQuality}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Frame Size: {frameSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Number of Image: {numberOfImages}</span>
              </div>
            </div>
          </div>

          {/* Original Image Section */}
          <div className="px-8 pb-10 ">
            <button
              onClick={() => setIsOriginalImageOpen(!isOriginalImageOpen)}
              className="w-full flex items-center justify-between text-white text-sm mb-4 hover:text-gray-300 transition-colors"
            >
              <span>Original Image</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${isOriginalImageOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isOriginalImageOpen && (
              <div className="w-full aspect-square bg-trasnparent rounded-lg overflow-hidden border border-white/10 ">
                <Image
                  src={imageUrl || "/placeholder.svg"}
                  alt="Original image"
                  width={200}
                  height={200}
                  className="w-full h-full object-contain  "
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
