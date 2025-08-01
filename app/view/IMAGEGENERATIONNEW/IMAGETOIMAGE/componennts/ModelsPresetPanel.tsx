"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface ModelsPresetPanelProps {
  isOpen: boolean
  onClose: () => void
  selectedModel: string
  onModelSelect: (model: string) => void
  excludeRef?: React.RefObject<HTMLButtonElement | null>
}

// Define a type for model
type Model = {
  id: string
  title: string
  shortName: string
  image: string
  description: string
  tokenCost: number
}

// Only Flux models for Image to Image
const models = [
  {
    id: "6",
    title: "Flux.1 KONTEXT MAX",
    shortName: "FM",
    image: "/imagegenerationnew/models/model5.png",
    description:
      "Flux.1 KONTEXT MAX, a powerful 12B parameter flow transformer model from the FLUX series. This model delivers high-quality image-to-image generation with exceptional detail and efficiency.",
    tokenCost: 20,
  },  
  {
    id: "7",
    title: "Flux.1 KONTEXT PRO",
    shortName: "FP",
    image: "/imagegenerationnew/models/model5.png",
    description:
      "Flux.1 KONTEXT PRO, a powerful 12B parameter flow transformer model from the FLUX series. This model delivers high-quality image-to-image generation with exceptional detail and efficiency.",
    tokenCost: 20,
  },  
]

export default function ModelsPresetPanel({
  isOpen,
  onClose,
  selectedModel,
  onModelSelect,
 
}: ModelsPresetPanelProps) {
  const [hoveredModel, setHoveredModel] = useState<string | null>(null)

  const handleModelClick = (model: Model) => {
    console.log("ModelsPresetPanel - Model clicked:", model.title)
    console.log("ModelsPresetPanel - onModelSelect function:", onModelSelect)
    
    // Call the callback with the model title
    onModelSelect(model.title)
    
    console.log("ModelsPresetPanel - Called onModelSelect with:", model.title)
    
    // Close the panel
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Desktop Layout - Dropdown */}
          <div className="hidden md:block">
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="py-4 px-2 space-y-2">
                {/* Models List - Single column for desktop */}
                <div className="space-y-2">
                  {models.map((model) => (
                    <ModelCard
                      key={model.id}
                      model={model}
                      isSelected={selectedModel === model.title}
                      isHovered={hoveredModel === model.id}
                      onSelect={handleModelClick}  // This should call handleModelClick
                      onHover={setHoveredModel}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Mobile/Tablet Layout - Dropdown within Settings Panel */}
          <div className="md:hidden">
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="py-4 px-2 space-y-4">
                {/* Models Grid - 2x2 for mobile */}
                <div className="grid grid-cols-2 gap-3">
                  {models.map((model) => (
                    <MobileModelCard
                      key={model.id}
                      model={model}
                      isSelected={selectedModel === model.title}
                      onSelect={handleModelClick}  // This should call handleModelClick
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

// Desktop Model Card Component with Seamless Hover Description
function ModelCard({
  model,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}: {
  model: Model
  isSelected: boolean
  isHovered: boolean
  onSelect: (model: Model) => void  // Change this to accept full model
  onHover: (modelId: string | null) => void
}) {
  return (
    <motion.div
      className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
        isSelected ? "" : ""
      }`}
      onClick={() => onSelect(model)}  // Pass full model object
      onMouseEnter={() => onHover(model.id)}
      onMouseLeave={() => onHover(null)}
      layout
    >
      {/* Main Card Content - Matches the exact design from your image */}
      <div className="bg-white/10 rounded-xl p-4">
        <div className="flex items-start items-center gap-3">
          {/* Model Icon */}
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
            <Image
              src={model.image || "/placeholder.svg"}
              alt={model.title}
              width={48}
              height={48}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Hide the image on error and show a gradient background instead
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement?.classList.add('bg-gradient-to-br', 'from-purple-500', 'to-blue-600');
              }}
            />
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            {/* Model Name */}
            <h3 className="text-white flex items-center  text-md font-poppins mb-1">{model.title}</h3>

            {/* Seamless Description - No borders, appears directly below name */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="text-white text-sm leading-relaxed">{model.description}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Mobile Model Card Component (unchanged)
function MobileModelCard({
  model,
  isSelected,
  onSelect,
}: {
  model: Model
  isSelected: boolean
  onSelect: (model: Model) => void  // Change this to accept full model
}) {
  return (
    <div
      className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${
        isSelected ? "" : ""
      }`}
      onClick={() => onSelect(model)}  // Pass full model object
    >
      {/* Card Background */}
      <div className="w-full h-[8vh]  aspect-square bg-white/10 flex flex-col items-left justify-left relative py-4 pl-2">
        {/* Content */}
        <div className="relative z-10 flex flex-col items-left justify-end h-auto">
          {/* Model Name */}
          <div className="flex items-center gap-2 text-left md:text-left">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center border border-white/10">
              <Image
                src={model.image || "/placeholder.svg"}
                alt={model.title}
                height={40}
                width={40}
                className="w-8 h-8 object-cover rounded-full"
                onError={(e) => {
                  // Hide the image on error and show a gradient background instead
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement?.classList.add('bg-gradient-to-br', 'from-purple-500', 'to-blue-600');
                }}
              />
            </div>
            <p className="text-white text-xs font-normal">{model.title}</p>
          </div>
        </div>
      </div>
    </div>
  )
} 