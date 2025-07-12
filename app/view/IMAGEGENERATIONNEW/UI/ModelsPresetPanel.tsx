"use client"

import { useEffect, useRef } from "react"
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
    image: "/placeholder.svg?height=60&width=60",
    description:
      "Unique turnkey solution for video analytics, optimized for real-time performance on off-the-grid Edge AI devices and green computing.",
    tokenCost: 20,
  },
  {
    id: "2",
    title: "Flux.1 Dev",
    shortName: "F",
    image: "/placeholder.svg?height=60&width=60",
    description:
      "Flux.1 Dev, a powerful 12B parameter flow transformer model from the FLUX series. This model delivers high-quality image generation with exceptional detail and efficiency.",
    tokenCost: 20,
  },
  {
    id: "3",
    title: "Stable Diffusion 3.5 Large",
    shortName: "S",
    image: "/placeholder.svg?height=60&width=60",
    description:
      "Google's Imagen - generating images with even better detail, richer lighting and fewer distracting artifacts than our previous models.",
    tokenCost: 25,
  },
  {
    id: "4",
    title: "Stable Diffusion 3.5 Medium",
    shortName: "S",
    image: "/placeholder.svg?height=60&width=60",
    description:
      "Stable Diffusion 3.5 Medium With 2.5B parameters and enhanced MMDiT-X architecture, this model runs efficiently on consumer hardware, balancing quality and customization while generating images from 0.25 to 2 MP.",
    tokenCost: 15,
  },
  {
    id: "5",
    title: "Flux.1 Schnell",
    shortName: "F",
    image: "/placeholder.svg?height=60&width=60",
    description:
      "A powerful fusion of MidJourney's artistic capabilities, Flux-Dev's efficiency, and LoRA fine-tuning, enabling highly customized, stylistic, and efficient AI-generated imagery.",
    tokenCost: 30,
  },
  {
    id: "6",
    title: "Stable Turbo",
    shortName: "S",
    image: "/placeholder.svg?height=60&width=60",
    description:
      "Get involved with the fastest growing open software project. Download and join other developers in creating incredible applications with Stable Diffusion XL as a foundation model.",
    tokenCost: 18,
  },
]

export default function ModelsPresetPanel({ isOpen, onClose, selectedModel, onModelSelect, excludeRef }: ModelsPresetPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)

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
              <div className="py-4 px-2 space-y-4">
                {/* Models Grid - 4 columns for desktop */}
                <div className="grid grid-cols-1 gap-3">
                  {models.map((model) => (
                    <MobileModelCard
                      key={model.id}
                      model={model}
                      isSelected={selectedModel === model.title}
                      onSelect={handleModelSelect}
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



// Mobile Model Card Component
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
        isSelected ? "ring-2 ring-[#412399]" : ""
      }`}
      onClick={() => onSelect(model.title)}
    >
      {/* Card Background with Gradient */}
      <div className="w-full h-auto md:h-[10vh] aspect-square bg-white/10 flex flex-col items-left justify-left relative p-4">
        {/* Artistic Background Overlay */}
        <div className="absolute inset-0 "></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-left justify-end h-full">
          {/* Model Name */}
          <div className=" flex items-center gap-2 text-left md:text-left">
            <Image 
            src={""}
            alt=""
            height={10}
            width={10}
            className="w-10 h-10 object-cover rounded-full bg-black border border-white/10"
            ></Image>
            <p className="text-white text-sm font-bold">{model.title}</p>
          </div>
        </div>

        {/* Selection Indicator */}
        {/* {isSelected && (
          <div className="absolute top-2 right-2 w-5 h-5 bg-[#412399] rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">.</span>
          </div>
        )} */}
      </div>
    </div>
  )
}


