"use client"

import Image from "next/image"
import { useState } from "react"
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

  const handleChooseFromLibrary = () => {
    console.log("Choose from library clicked")
    // Implement library selection logic here
  }

  const handleUploadFromDevices = () => {
    setShowUploadComponent(true)
    console.log("Upload from devices clicked")
  }

  const handleFilesSelected = (files: File[]) => {
    console.log("Files selected:", files)
    // Handle the selected files here
  }

  const handleDownload = async (imageUrl: string, index: number) => {
    try {
      // Show loading state (optional)
      console.log(`Downloading image ${index + 1}...`)

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

      // Set filename - you can customize this
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-")
      const filename = `generated-image-${index + 1}-${timestamp}.png`
      link.download = filename

      // Trigger download
      document.body.appendChild(link)
      link.click()

      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      console.log(`Image ${index + 1} downloaded successfully as ${filename}`)
    } catch (error) {
      console.error("Download failed:", error)
      // You could show a toast notification here
      alert("Failed to download image. Please try again.")
    }
  }

  const handleBookmark = (index: number) => {
    setBookmarkedImages(prev => {
      const updated = new Set(prev);
      if (updated.has(index)) {
        updated.delete(index);
      } else {
        updated.add(index);
      }
      return updated;
    });
  };
  
  const handleLike = (index: number) => {
    setLikedImages(prev => {
      const updated = new Set(prev);
      if (updated.has(index)) {
        updated.delete(index);
      } else {
        updated.add(index);
      }
      return updated;
    });
  };

  const handleInfo = (imageUrl: string, index: number) => {
    setSelectedImageForOverlay({ url: imageUrl, index })
  }

  const closeImageOverlay = () => {
    setSelectedImageForOverlay(null)
  }

  return (
    <div className="flex flex-col items-center space-y-8 lg:space-y-12">
      {/* Input Section */}
      <div className="flex items-center gap-4 md:w-full md:max-w-7xl">
        <div className="flex-1 relative">
          <div className="flex items-center bg-[#ffffff]/5 hover:bg-[#ffffff]/20 backdrop-blur-sm border border-[#8E8E8E] rounded-2xl lg:rounded-3xl p-4 md:p-4 transition-all duration-300 ease-in-out">
            {/* Attachments Dropdown */}
            <AttachmentsDropdown
              onChooseFromLibrary={handleChooseFromLibrary}
              onUploadFromDevices={handleUploadFromDevices}
            />

            <input
              type="text"
              placeholder="Type a prompt..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-white outline-none text-sm lg:text-base xl:text-lg ml-4"
              onKeyDown={(e) => e.key === "Enter" && onGenerate()}
            />
            <div className="flex items-center gap-3 lg:gap-4">
              <button className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors border border-white/10">
                <Image className="" src="/newt2image/enhancer.png" alt="enhancer" width={28} height={28} />
              </button>
              <button
                onClick={onGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="bg-gradient-to-b from-[#6C3BFF] to-[#412399] transition-colors text-white px-6 md:px-12 py-2.5 md:py-3 rounded-xl lg:rounded-2xl font-medium text-sm lg:text-base transition-colors"
              >
                {isGenerating ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={onSettingsToggle}
          className="p-4 md:p-3 bg-[#1F1F1F] backdrop-blur-sm rounded-2xl hover:bg-gradient-to-b from-[#6C3BFF] to-[#412399] transition-colors border border-[#8E8E8E]"
        >
          <Image
            src="/mockupgeneration/setting.png"
            alt="Settings"
            width={32}
            height={32}
            className="w-8 h-8 md:w-12 md:h-12"
          />
        </button>
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

      {/* Generated Images Grid UI (from ResultSection) */}
      {generatedImages && generatedImages.length > 0 && (
        <div className="max-w-8xl mx-auto w-full">
          {/* Compact Prompt Display - Positioned directly above images */}
          <div className="flex items-center gap-2 mb-4 pr-6">
            <div className="bg-white/10 rounded-lg p-2">
            <Sparkles className="w-5 h-5 text-gray-400" /></div>
            <span className="text-white text-sm font-medium">{prompt}</span>
          </div>

          {/* Images Grid Container */}
          <div className="relative bg-transparent backdrop-blur-sm border border-gray-700/30 rounded-xl md:rounded-xl p-6 lg:p-8 min-h-[400px] md:min-h-[400px] overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {generatedImages.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square bg-gray-900/50 rounded-xl md:rounded-lg overflow-hidden group cursor-pointer"
                  onMouseEnter={() => { setHoveredImageIndex(index); }}
                  onMouseLeave={() => { setHoveredImageIndex(null); }}
                >
                  {/* <Image
                    src={image || "/placeholder.svg"}
                    alt={`Generated image ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-auto h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  /> */}

<div className="w-full aspect-square bg-trasnparent rounded-lg overflow-hidden border border-white/10 ">
                <Image
                  src={image || "/placeholder.svg"}
                  alt="Original image"
                  width={200}
                  height={200}
                  className="w-full h-full object-contain  "
                />
              </div>

                  {/* Hover Overlay with Action Buttons */}
                  <div
                    className={`absolute inset-0 bg-black/10 transition-all duration-300 ${
                      hoveredImageIndex === index ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                  >
                    {/* Info Button - Top Right */}
                    <button
                      onClick={() => handleInfo(image, index)}
                      className="text-black font-semibold absolute top-3 right-3 px-[.5vw] bg-gradient-to-b from-[#00F0FF] to-[#009099] backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200"
                    >
                      !
                    </button>

                    {/* Action Buttons - Bottom Left */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      {/* Download Button */}
                      <button
                        onClick={() => handleDownload(image, index)}
                        className="p-2 bg-gradient-to-b from-[#00F0FF] to-[#009099] backdrop-blur-sm rounded-lg hover:bg-[#5AD7FF]/30 transition-all duration-200 group/btn"
                      >
                        <Download className="w-4 h-4 text-[#000] group-hover/btn:scale-110 transition-transform" />
                      </button>

                      {/* Bookmark Button */}
                      <button onClick={() => handleBookmark(index)}>
                        <Bookmark
                          className={`w-6 h-6 transition-colors duration-200 ${
                            bookmarkedImages.has(index) ? "fill-[#a4c48c] text-[#a4c48c]" : "text-[#fff]"
                          }`}
                        />
                      </button>

                      {/* Like Button */}
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
    </div>
  )
}
