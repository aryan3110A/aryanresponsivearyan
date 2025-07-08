"use client"

import Image from "next/image"
import { useState, useRef } from "react"
import AttachmentsDropdown from "./AttachmentsDropdown"
import UploadComponent from "./UploadComponent"
import { Download, Bookmark, Heart, Sparkles } from "lucide-react"
import ImageOverlay from "./ImageOverlay"

interface InputSectionProps {
  prompt: string
  setPrompt: (prompt: string) => void
  onGenerate: () => void
  onSettingsToggle: () => void
  isGenerating: boolean
  generatedImages: string[]
  selectedModel: string
  selectedStyle: string | null
  selectedQuality: string
  selectedAspectRatio: string
  numberOfImages: number
}

export default function InputSection({
  prompt,
  setPrompt,
  onGenerate,
  onSettingsToggle,
  isGenerating,
  generatedImages,
  selectedModel,
  selectedStyle,
  selectedQuality,
  selectedAspectRatio,
  numberOfImages,
}: InputSectionProps) {
  const [showUploadComponent, setShowUploadComponent] = useState(false)
  const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(null)
  const [likedImages, setLikedImages] = useState<Set<number>>(new Set())
  const [bookmarkedImages, setBookmarkedImages] = useState<Set<number>>(new Set())
  const [selectedImageForOverlay, setSelectedImageForOverlay] = useState<{
    url: string
    index: number
  } | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const handleChooseFromLibrary = () => {
    console.log("Choose from library clicked")
  }

  const handleUploadFromDevices = () => {
    setShowUploadComponent(true)
    console.log("Upload from devices clicked")
  }

  const handleFilesSelected = (files: File[]) => {
    console.log("Files selected:", files)
  }

  const handleDownload = async (imageUrl: string, index: number) => {
    try {
      console.log(`Downloading image ${index + 1}...`)

      const response = await fetch(imageUrl)
      if (!response.ok) {
        throw new Error("Failed to fetch image")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url

      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-")
      const filename = `generated-image-${index + 1}-${timestamp}.png`
      link.download = filename

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      console.log(`Image ${index + 1} downloaded successfully as ${filename}`)
    } catch (error) {
      console.error("Download failed:", error)
      alert("Failed to download image. Please try again.")
    }
  }

  const handleBookmark = (index: number) => {
    setBookmarkedImages((prev) => {
      const updated = new Set(prev)
      if (updated.has(index)) {
        updated.delete(index)
      } else {
        updated.add(index)
      }
      return updated
    })
  }

  const handleLike = (index: number) => {
    setLikedImages((prev) => {
      const updated = new Set(prev)
      if (updated.has(index)) {
        updated.delete(index)
      } else {
        updated.add(index)
      }
      return updated
    })
  }

  const handleInfo = (imageUrl: string, index: number) => {
    setSelectedImageForOverlay({ url: imageUrl, index })
  }

  const closeImageOverlay = () => {
    setSelectedImageForOverlay(null)
  }

  return (
    <div className="flex flex-col items-center space-y-6 mb:space-y-4 lg:space-y-12">
      {/* Desktop Layout - Input with buttons inline */}
      <div className="hidden xl:flex items-center gap-4 w-full max-w-7xl">
        <div className="flex-1 relative">
          <div className="flex items-center bg-[#ffffff]/5 hover:bg-[#ffffff]/20 backdrop-blur-sm border border-[#8E8E8E] rounded-2xl lg:rounded-3xl p-4 transition-all duration-300 ease-in-out">
            <AttachmentsDropdown
              onChooseFromLibrary={handleChooseFromLibrary}
              onUploadFromDevices={handleUploadFromDevices}
            />

            <input
              type="text"
              placeholder="Type a prompt..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-white outline-none text-lg ml-4"
              onKeyDown={(e) => e.key === "Enter" && onGenerate()}
            />
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors border border-white/10">
                <Image src="/newt2image/enhancer.png" alt="enhancer" width={28} height={28} />
              </button>
              <button
                onClick={onGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="bg-gradient-to-b from-[#6C3BFF] to-[#412399] transition-colors text-white px-12 py-3 rounded-2xl font-medium text-base"
              >
                {isGenerating ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={onSettingsToggle}
          className="p-3 bg-[#1F1F1F] backdrop-blur-sm rounded-2xl hover:bg-gradient-to-b from-[#6C3BFF] to-[#412399] transition-colors border border-[#8E8E8E]"
        >
          <Image src="/mockupgeneration/setting.png" alt="Settings" width={32} height={32} className="w-12 h-12" />
        </button>
      </div>

      {/* Mobile & Tablet Layout - Input field separate from buttons */}
      <div className="xl:hidden mobile:w-full max-w-[40rem] mobile:max-w-xl px-0 mobile:px-0">
        {/* Input Field Only */}
        <div className="w-[100%] mb-4">
          <div className="flex items-center bg-[#ffffff]/5 hover:bg-[#ffffff]/20 backdrop-blur-sm border border-[#8E8E8E] rounded-2xl p-4 mobile:p-1 transition-all duration-300 ease-in-out">
            <AttachmentsDropdown
              onChooseFromLibrary={handleChooseFromLibrary}
              onUploadFromDevices={handleUploadFromDevices}
            />

            <input
              type="text"
              placeholder="Type a prompt..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-white outline-none text-base mobile:text-sm ml-3"
              onKeyDown={(e) => e.key === "Enter" && onGenerate()}
            />

            <button className="p-2 mobile:p-1.5 hover:bg-gray-700/50 rounded-lg transition-colors border border-white/10 ml-2">
              <Image
                src="/newt2image/enhancer.png"
                alt="enhancer"
                width={24}
                height={24}
                className="mobile:w-5 mobile:h-5"
              />
            </button>
          </div>
        </div>

        {/* Buttons Below Input */}
        <div className="flex items-center gap-4 mobile:gap-3 justify-center">
          <button
            onClick={onGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="bg-gradient-to-b from-[#6C3BFF] to-[#412399] transition-colors text-white px-8 mobile:px-6 py-3 mobile:py-2.5 rounded-xl font-medium text-base mobile:text-sm flex-1 max-w-[200px]"
          >
            {isGenerating ? "Generating..." : "Generate"}
          </button>

          <button
            onClick={onSettingsToggle}
            className="p-3 mobile:p-2.5 bg-[#1F1F1F] backdrop-blur-sm rounded-xl hover:bg-gradient-to-b from-[#6C3BFF] to-[#412399] transition-colors border border-[#8E8E8E]"
          >
            <Image
              src="/mockupgeneration/setting.png"
              alt="Settings"
              width={28}
              height={28}
              className="mobile:w-6 mobile:h-6"
            />
          </button>
        </div>
      </div>

      {/* Upload Component Modal */}
      {showUploadComponent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium text-lg">Upload Files</h3>
              <button
                onClick={() => setShowUploadComponent(false)}
                className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                <span className="text-white text-xl">×</span>
              </button>
            </div>
            <UploadComponent onFilesSelected={handleFilesSelected} />
          </div>
        </div>
      )}

      {/* Loading State */}
      {isGenerating && (
        <div className="flex items-center justify-center py-12 lg:py-16">
          <div className="animate-spin rounded-full h-12 w-12 lg:h-16 lg:w-16 border-b-2 border-white"></div>
        </div>
      )}

      {/* Generated Images - Responsive Layout */}
      {generatedImages && generatedImages.length > 0 && (
        <div className="w-full max-w-8xl mx-auto">
          {/* Desktop Layout - Grid */}
          <div className="hidden xl:block">
            <div className="flex items-center gap-2 mb-4 px-6">
              <div className="bg-white/10 rounded-lg p-2">
                <Sparkles className="w-5 h-5 text-gray-400" />
              </div>
              <span className="text-white text-sm font-medium">{prompt}</span>
            </div>

            <div className="relative bg-transparent backdrop-blur-sm border border-gray-700/30 rounded-xl p-6 lg:p-8 min-h-[400px] overflow-hidden">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                {generatedImages.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square bg-gray-900/50 rounded-xl overflow-hidden group cursor-pointer"
                    onMouseEnter={() => setHoveredImageIndex(index)}
                    onMouseLeave={() => setHoveredImageIndex(null)}
                  >
                    <div className="w-full aspect-square bg-transparent rounded-lg overflow-hidden border border-white/10">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Generated image ${index + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div
                      className={`absolute inset-0 bg-black/10 transition-all duration-300 ${
                        hoveredImageIndex === index ? "opacity-100" : "opacity-0 pointer-events-none"
                      }`}
                    >
                      <button
                        onClick={() => handleInfo(image, index)}
                        className="text-black font-semibold absolute top-3 right-3 px-[.5vw] bg-gradient-to-b from-[#00F0FF] to-[#009099] backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200"
                      >
                        !
                      </button>

                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <button
                          onClick={() => handleDownload(image, index)}
                          className="p-2 bg-gradient-to-b from-[#00F0FF] to-[#009099] backdrop-blur-sm rounded-lg hover:bg-[#5AD7FF]/30 transition-all duration-200 group/btn"
                        >
                          <Download className="w-4 h-4 text-[#000] group-hover/btn:scale-110 transition-transform" />
                        </button>

                        <button onClick={() => handleBookmark(index)}>
                          <Bookmark
                            className={`w-6 h-6 transition-colors duration-200 ${
                              bookmarkedImages.has(index) ? "fill-[#a4c48c] text-[#a4c48c]" : "text-[#fff]"
                            }`}
                          />
                        </button>

                        <button onClick={() => handleLike(index)}>
                          <Heart
                            className={`w-6 h-6 transition-colors duration-200 ${
                              likedImages.has(index) ? "fill-red-500 text-red-500" : "text-[#fff]"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile & Tablet Layout - Horizontal Scrolling Row */}
          <div className="xl:hidden w-full">
            {/* Prompt Display - Fixed above scrollable area */}
            <div className="flex items-center gap-2 mb-4 px-4 mobile:px-2">
              <div className="bg-white/10 rounded-lg p-2 mobile:p-1.5">
                <Sparkles className="w-4 h-4 mobile:w-3 mobile:h-3 text-gray-400" />
              </div>
              <span className="text-white text-sm mobile:text-xs font-medium line-clamp-2">{prompt}</span>
            </div>

            {/* Horizontal Scrolling Images Container */}
            <div className="relative">
              <div
                ref={scrollContainerRef}
                className="flex gap-4 mobile:gap-3 overflow-x-auto scrollbar-hide px-4 mobile:px-2 pb-4"
                style={{
                  scrollSnapType: "x mandatory",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {generatedImages.map((image, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-80 mobile:w-72 tablet:w-80"
                    style={{ scrollSnapAlign: "start" }}
                  >
                    {/* Image Container */}
                    <div className="relative bg-transparent backdrop-blur-sm border border-gray-700/30 rounded-xl p-4 mobile:p-3 overflow-hidden">
                      <div className="relative w-full aspect-square bg-gray-900/50 rounded-xl overflow-hidden">
                        <div className="w-full aspect-square bg-transparent rounded-lg overflow-hidden border border-white/10">
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`Generated image ${index + 1}`}
                            width={400}
                            height={400}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        {/* Mobile Action Buttons - Always Visible */}
                        <div className="absolute inset-0 bg-black/5">
                          {/* Info Button - Top Right */}
                          <button
                            onClick={() => handleInfo(image, index)}
                            className="text-black font-semibold absolute top-3 mobile:top-2 right-3 mobile:right-2 w-8 h-8 mobile:w-6 mobile:h-6 bg-gradient-to-b from-[#00F0FF] to-[#009099] backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200 flex items-center justify-center text-sm mobile:text-xs"
                          >
                            !
                          </button>

                          {/* Action Buttons - Bottom Left */}
                          <div className="absolute bottom-3 mobile:bottom-2 left-3 mobile:left-2 flex items-center gap-2 mobile:gap-1.5">
                            <button
                              onClick={() => handleDownload(image, index)}
                              className="p-2 mobile:p-1.5 bg-gradient-to-b from-[#00F0FF] to-[#009099] backdrop-blur-sm rounded-lg hover:bg-[#5AD7FF]/30 transition-all duration-200"
                            >
                              <Download className="w-4 h-4 mobile:w-3 mobile:h-3 text-[#000]" />
                            </button>

                            <button onClick={() => handleBookmark(index)}>
                              <Bookmark
                                className={`w-5 h-5 mobile:w-4 mobile:h-4 transition-colors duration-200 ${
                                  bookmarkedImages.has(index) ? "fill-[#a4c48c] text-[#a4c48c]" : "text-[#fff]"
                                }`}
                              />
                            </button>

                            <button onClick={() => handleLike(index)}>
                              <Heart
                                className={`w-5 h-5 mobile:w-4 mobile:h-4 transition-colors duration-200 ${
                                  likedImages.has(index) ? "fill-red-500 text-red-500" : "text-[#fff]"
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Scroll Indicators (Optional) */}
              {generatedImages.length > 1 && (
                <div className="flex justify-center mt-4 gap-2">
                  {generatedImages.map((_, index) => (
                    <div key={index} className="w-2 h-2 mobile:w-1.5 mobile:h-1.5 rounded-full bg-gray-600" />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image Overlay Modal */}
      {selectedImageForOverlay && (
        <ImageOverlay
          isOpen={!!selectedImageForOverlay}
          onClose={closeImageOverlay}
          imageUrl={selectedImageForOverlay.url}
          prompt={prompt}
          model={selectedModel}
          modelSelection={selectedModel}
          stylePalette={selectedStyle || ""}
          imageQuality={selectedQuality}
          frameSize={selectedAspectRatio}
          numberOfImages={numberOfImages}
        />
      )}

      {/* Add scrollbar hide styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar { 
          display: none;
        }
      `}</style>
    </div>
  )
}
