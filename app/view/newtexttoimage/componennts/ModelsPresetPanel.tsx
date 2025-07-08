"use client"

import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface ModelsPresetPanelProps {
  isOpen: boolean
  onClose: () => void
  selectedModel: string
  onModelSelect: (model: string) => void
}

// Define a type for model
type Model = {
  id: string;
  title: string;
  shortName: string;
  description: string;
  tokenCost: number;
};

const models = [
  {
    id: "1",
    title: "Stable XL",
    shortName: "S",
    description:
      "Unique turnkey solution for video analytics, optimized for real-time performance on off-the-grid Edge AI devices and green computing.",
    tokenCost: 20,
  },
  {
    id: "2",
    title: "Flux.1 Dev",
    shortName: "F",
    description:
      "Flux.1 Dev, a powerful 12B parameter flow transformer model from the FLUX series. This model delivers high-quality image generation with exceptional detail and efficiency.",
    tokenCost: 20,
  },
  {
    id: "3",
    title: "Stable Diffusion 3.5 Large",
    shortName: "S",
    description:
      "Google's Imagen - generating images with even better detail, richer lighting and fewer distracting artifacts than our previous models.",
    tokenCost: 25,
  },
  {
    id: "4",
    title: "Stable Diffusion 3.5 Medium",
    shortName: "S",
    description:
      "Stable Diffusion 3.5 Medium With 2.5B parameters and enhanced MMDiT-X architecture, this model runs efficiently on consumer hardware, balancing quality and customization while generating images from 0.25 to 2 MP.",
    tokenCost: 15,
  },
  {
    id: "5",
    title: "Flux.1 Schnell",
    shortName: "F",
    description:
      "A powerful fusion of MidJourney's artistic capabilities, Flux-Dev's efficiency, and LoRA fine-tuning, enabling highly customized, stylistic, and efficient AI-generated imagery.",
    tokenCost: 30,
  },
  {
    id: "6",
    title: "Stable Turbo",
    shortName: "S",
    description:
      "Get involved with the fastest growing open software project. Download and join other developers in creating incredible applications with Stable Diffusion XL as a foundation model.",
    tokenCost: 18,
  },
]

export default function ModelsPresetPanel({ isOpen, onClose, selectedModel, onModelSelect }: ModelsPresetPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen, onClose])

  const handleModelSelect = (model: string) => {
    onModelSelect(model)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-transparent backdrop-blur-sm z-40" onClick={onClose} />

          {/* Models Panel positioned next to settings panel */}
          <motion.div
            ref={panelRef}
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 left-[560px] w-[500px] lg:w-[600px] h-screen bg-transparent  backdrop-blur-xl z-50 overflow-hidden"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="bg-white/10 p-6 border-b border-gray-600 ">
                <div className="flex items-center justify-between">
                  <h1 className="text-[#5AD7FF] text-xl font-semibold ">Models and Presets</h1>
                  <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Models Grid */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="grid grid-cols-3 gap-4">
                  {models.map((model) => (
                    <ModelCard
                      key={model.id}
                      model={model}
                      isSelected={selectedModel === model.title}
                      onSelect={handleModelSelect}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function ModelCard({
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
      className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 ${
        isSelected ? "ring-2 ring-[#5AD7FF]" : ""
      }`}
      onClick={() => onSelect(model.title)}
    >
      {/* Card Background */}
      <div className="w-full h-40 bg-white/10 flex flex-col items-center justify-center relative">
        {/* Large Letter */}
        <div className="text-white text-4xl font-bold mb-2">{model.shortName}</div>

        {/* Model Name */}
        <div className="absolute bottom-2 left-2 right-2">
          <p className="text-white text-xs font-medium text-center truncate">{model.title}</p>
        </div>

        {/* Selection Checkmark */}
        {/* {isSelected && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-[#5AD7FF] rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">✓</span>
          </div>
        )} */}

        {/* Hover Overlay with Description */}
        <div className="absolute inset-0 bg-black/90 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-3">
          <p className="text-white text-xs text-center leading-relaxed">{model.description}</p>
        </div>
      </div>
    </div>
  )
}
