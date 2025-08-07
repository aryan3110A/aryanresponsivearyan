"use client"

import Image from "next/image"
import { useState,  } from "react"
import { AttachmentsDropdown, UploadComponent, ImageOverlay } from "../../UI"
import { Download, Bookmark, Heart } from "lucide-react"
import { HoverBorderGradient } from "../../../Core/hover-border-gradient"

interface InputSectionProps {
  prompt: string
  setPrompt: (prompt: string) => void
  onGenerate: () => void
  isGenerating: boolean
  generatedImages: string[]
  selectedModel: string
  selectedStyle: string | null
  selectedQuality: string
  selectedAspectRatio: string
  numberOfImages: number
  uploadedImage: File | null
  setUploadedImage: (file: File | null) => void
}

export default function InputSection({
  prompt,
  setPrompt,
  onGenerate,
  isGenerating,
  generatedImages,
  selectedModel,
  selectedStyle,
  selectedQuality,
  selectedAspectRatio,
  numberOfImages,
  uploadedImage,
  setUploadedImage,
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
  }

  const handleUploadFromDevices = () => {
    setShowUploadComponent(true)
    console.log("Upload from devices clicked")
  }

  const handleFilesSelected = (files: File[]) => {
    console.log("Files selected:", files)
    if (files.length > 0) {
      setUploadedImage(files[0])
    }
    setShowUploadComponent(false)
  }

  const handleDownload = (imageUrl: string, index: number) => {
    try {
      console.log(`Downloading image ${index + 1}...`)

      const link = document.createElement("a")
      link.href = imageUrl
      link.download = `generated-image-${index + 1}-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.png`
      link.target = "_blank"

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      console.log(`✅ Image ${index + 1} download initiated successfully`)
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
    document.body.style.overflow = 'hidden' // ✅ Disable background scrolling
  }
  

  const closeImageOverlay = () => {
    setSelectedImageForOverlay(null)
    document.body.style.overflow = '' // ✅ Restore background scrolling
  }
  



  return (
    <div className="w-full flex flex-col items-center gap-8 min-h-[300px]">
      {/* Desktop Layout - Input with buttons inline */}
      <div className="hidden xl:flex items-center gap-4 w-full md:max-w-4xl lg:max-w-5xl px-4">
        <div className="flex-1 relative max-w-full">
          <div className="p-2 flex items-center bg-[#ffffff]/5 hover:bg-[#ffffff]/20 backdrop-blur-sm border border-[#8E8E8E] rounded-full transition-all duration-300 ease-in-out w-[1100px] max-w-full">
            <div className="relative mr-4">
              <AttachmentsDropdown
                onChooseFromLibrary={handleChooseFromLibrary}
                onUploadFromDevices={handleUploadFromDevices}
              />
              {/* Image selection indicator */}
              {uploadedImage && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" title="Image uploaded" />
              )}
            </div>

            <input
              type="text"
              placeholder="Type a prompt..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-gray-600 outline-none text-sm ml-4 w-full max-w-full"
              onKeyDown={(e) => e.key === "Enter" && onGenerate()}
            />
            <div className="flex items-center gap-4">
              <button className=" hover:bg-gray-700/50 rounded-full transition-colors border border-white/10">
                <Image src="/newt2image/enhancer.png" alt="enhancer" width={20} height={20} />
              </button>
              <HoverBorderGradient
                onClick={!prompt.trim() || isGenerating ? undefined : onGenerate}
                backgroundColor="bg-[#006aff]"
                className={`px-4 py-2 font-regular text-sm rounded-full ${(!prompt.trim() || isGenerating) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {isGenerating ? "Generating..." : "Generate"}
              </HoverBorderGradient>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Layout - Fully Responsive */}
      <div className="xl:hidden w-full max-w-full px-0 ">
        {/* Input Field Only - Full Width Responsive */}
        <div className="w-full max-w-full mb-2">
          <div className="flex items-center bg-[#ffffff]/5 hover:bg-[#ffffff]/20 backdrop-blur-sm border border-[#8E8E8E] rounded-full p-3 xs:p-4 sm:p-5 transition-all duration-300 ease-in-out w-full max-w-full">
            <div className="relative mr-2">
              <AttachmentsDropdown
                onChooseFromLibrary={handleChooseFromLibrary}
                onUploadFromDevices={handleUploadFromDevices}
              />
              {/* Image selection indicator */}
              {uploadedImage && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" title="Image uploaded" />
              )}
            </div>

            <input
              type="text"
              placeholder="Type a prompt..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-white outline-none text-base xs:text-lg sm:text-xl ml-2 mr-1 xs:ml-3 w-full max-w-full"
              onKeyDown={(e) => e.key === "Enter" && onGenerate()}
            />

            <button className="p-2 hover:bg-gray-700/50 rounded-full transition-colors border border-white/10 md:ml-2">
              <Image
                src="/newt2image/enhancer.png"
                alt="enhancer"
                width={24}
                height={24}
                className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8"
              />
            </button>
          </div>
        </div>

        {/* Buttons Below Input - Responsive Sizing */}
        <div className="flex items-center gap-3 xs:gap-4 justify-end w-full max-w-full">
          <HoverBorderGradient
            onClick={!prompt.trim() || isGenerating ? undefined : onGenerate}
            backgroundColor="bg-[#006aff]"
            className="px-6 py-3 xs:py-4 rounded-full font-medium text-base xs:text-lg flex-1 max-w-[100%]"
          >
            {isGenerating ? "Generating..." : "Generate"}
          </HoverBorderGradient>
        </div>
      </div>

      {/* Content Area - Fixed Height to Prevent Layout Shifts */}
      <div className="w-full flex flex-col items-center justify-center min-h-[200px]">
        {/* Generated Images - Fully Responsive Layout */}
        {generatedImages && generatedImages.length > 0 && (
          <div className="w-auto flex flex-row gap-6 flex-wrap justify-left">
            {generatedImages.map((image, index) => (
              <div
                onClick={() => handleInfo(image, index)}
                key={index}
                style={{width: 300, height: 300}}
                className="relative aspect-square bg-transparent rounded-xl overflow-hidden group cursor-pointer"
                onMouseEnter={() => setHoveredImageIndex(index)}
                onMouseLeave={() => setHoveredImageIndex(null)}
              >
                <div className="w-full  aspect-square bg-transparent rounded-lg overflow-hidden border border-white/10">
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
        )}

        {/* Enhanced Loading State with Progress */}
        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-8 xs:py-12 lg:py-16">
            <div className="animate-spin rounded-full h-8 w-8 xs:h-12 xs:w-12 lg:h-16 lg:w-16 border-b-2 border-white mb-4"></div>
            <div className="text-white text-sm xs:text-base text-center">
              <div>Generating with {selectedModel}</div>
              <div className="text-gray-400 text-xs xs:text-sm mt-1">
                {selectedAspectRatio} • {selectedQuality} • {numberOfImages} image{numberOfImages > 1 ? 's' : ''}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image Overlay Modal */}
      {selectedImageForOverlay && (
        <ImageOverlay
          isOpen={!!selectedImageForOverlay}
          onClose={closeImageOverlay}
          imageUrl={selectedImageForOverlay.url}
          prompt={prompt}
          modelSelection={selectedModel}
          stylePalette={selectedStyle || ""}
          imageQuality={selectedQuality}
          frameSize={selectedAspectRatio}
          numberOfItems={numberOfImages}
          itemLabel="Images"
        />
      )}

      {/* Upload Component Modal */}
      {showUploadComponent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 w-full max-w-md mx-4">
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
