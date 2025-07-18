"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
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

const models = [
  {
    id: "1",
    title: "Stable XL",
    shortName: "S",
    image: "/imagegenerationnew/models/model1.png",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since",
    tokenCost: 20,
  },
  {
    id: "2",
    title: "Flux.1 Dev",
    shortName: "F",
    image: "/imagegenerationnew/models/model2.png",
    description:
      "Flux.1 Dev, a powerful 12B parameter flow transformer model from the FLUX series. This model delivers high-quality image generation with exceptional detail and efficiency.",
    tokenCost: 20,
  },
  {
    id: "3",
    title: "Stable Diffusion 3.5 Large",
    shortName: "S",
    image: "/imagegenerationnew/models/model3.png",
    description:
      "Google's Imagen - generating images with even better detail, richer lighting and fewer distracting artifacts than our previous models.",
    tokenCost: 25,
  },
  {
    id: "4",
    title: "Stable Diffusion 3.5 Medium",
    shortName: "S",
    image: "/imagegenerationnew/models/model4.png",
    description:
      "Stable Diffusion 3.5 Medium With 2.5B parameters and enhanced MMDiT-X architecture, this model runs efficiently on consumer hardware, balancing quality and customization while generating images from 0.25 to 2 MP.",
    tokenCost: 15,
  },
  {
    id: "5",
    title: "Flux.1 Schnell",
    shortName: "F",
    image: "/imagegenerationnew/models/model5.png",
    description:
      "A powerful fusion of MidJourney's artistic capabilities, Flux-Dev's efficiency, and LoRA fine-tuning, enabling highly customized, stylistic, and efficient AI-generated imagery.",
    tokenCost: 30,
  },
  {
    id: "6",
    title: "Stable Turbo",
    shortName: "S",
    image: "/imagegenerationnew/models/model6.png",
    description:
      "Get involved with the fastest growing open software project. Download and join other developers in creating incredible applications with Stable Diffusion XL as a foundation model.",
    tokenCost: 18,
  },
]

export default function ModelsPresetPanel({
  isOpen,
  onClose,
  selectedModel,
  onModelSelect,
  excludeRef,
}: ModelsPresetPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [hoveredModel, setHoveredModel] = useState<string | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const isClickInsidePanel = panelRef.current && panelRef.current.contains(target)
      const isClickOnToggleButton = excludeRef?.current && excludeRef.current.contains(target)

      if (!isClickInsidePanel && !isClickOnToggleButton) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen, onClose, excludeRef])

  const handleModelSelect = (model: string) => {
    onModelSelect(model)
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
                      onSelect={handleModelSelect}
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
                  {models.slice(0, 4).map((model) => (
                    <MobileModelCard
                      key={model.id}
                      model={model}
                      isSelected={selectedModel === model.title}
                      onSelect={handleModelSelect}
                    />
                  ))}
                </div>
                {/* Show more models if needed */}
                {models.length > 4 && (
                  <div className="grid grid-cols-2 gap-3">
                    {models.slice(4).map((model) => (
                      <MobileModelCard
                        key={model.id}
                        model={model}
                        isSelected={selectedModel === model.title}
                        onSelect={handleModelSelect}
                      />
                    ))}
                  </div>
                )}
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
  onSelect: (model: string) => void
  onHover: (modelId: string | null) => void
}) {
  return (
    <motion.div
      className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
        isSelected ? "" : ""
      }`}
      onClick={() => onSelect(model.title)}
      onMouseEnter={() => onHover(model.id)}
      onMouseLeave={() => onHover(null)}
      layout
    >
      {/* Main Card Content - Matches the exact design from your image */}
      <div className="bg-white/10 rounded-xl p-4">
        <div className="flex items-start items-center gap-3">
          {/* Model Icon */}
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={model.image || "/placeholder.svg"}
              alt={model.title}
              width={48}
              height={48}
              className="w-full h-full object-cover"
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
  onSelect: (model: string) => void
}) {
  return (
    <div
      className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${
        isSelected ? "" : ""
      }`}
      onClick={() => onSelect(model.title)}
    >
      {/* Card Background */}
      <div className="w-full h-[8vh]  aspect-square bg-white/10 flex flex-col items-left justify-left relative py-4 pl-2">
        {/* Content */}
        <div className="relative z-10 flex flex-col items-left justify-end h-auto">
          {/* Model Name */}
          <div className="flex items-center gap-2 text-left md:text-left">
            <Image
              src={model.image || "/placeholder.svg"}
              alt={model.title}
              height={40}
              width={40}
              className="w-8 h-8 object-cover rounded-full bg-black border border-white/10"
            />
            <p className="text-white text-xs font-normal">{model.title}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
