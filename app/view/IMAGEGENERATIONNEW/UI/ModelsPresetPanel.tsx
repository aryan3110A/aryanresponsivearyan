"use client"

import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface Model {
  id: string
  title: string
  shortName: string
  description: string
  tokenCost: number
}

interface ModelsPresetPanelProps {
  isOpen: boolean
  onClose: () => void
  selectedModel: string
  onModelSelect: (model: string) => void
  models?: Model[]
  className?: string
}

const defaultModels: Model[] = [
  {
    id: "1",
    title: "Stable XL",
    shortName: "S",
    description: "Unique turnkey solution for video analytics, optimized for real-time performance on off-the-grid Edge AI devices and green computing.",
    tokenCost: 20,
  },
  {
    id: "2",
    title: "Flux.1 Dev",
    shortName: "F",
    description: "Flux.1 Dev, a powerful 12B parameter flow transformer model from the FLUX series. This model delivers high-quality image generation with exceptional detail and efficiency.",
    tokenCost: 20,
  },
  {
    id: "3",
    title: "Stable Diffusion 3.5 Large",
    shortName: "S",
    description: "Google's Imagen - generating images with even better detail, richer lighting and fewer distracting artifacts than our previous models.",
    tokenCost: 25,
  },
  {
    id: "4",
    title: "Stable Diffusion 3.5 Medium",
    shortName: "S",
    description: "Stable Diffusion 3.5 Medium With 2.5B parameters and enhanced MMDiT-X architecture, this model runs efficiently on consumer hardware, balancing quality and customization while generating images from 0.25 to 2 MP.",
    tokenCost: 15,
  },
  {
    id: "5",
    title: "Flux.1 Schnell",
    shortName: "F",
    description: "A powerful fusion of MidJourney's artistic capabilities, Flux-Dev's efficiency, and LoRA fine-tuning, enabling highly customized, stylistic, and efficient AI-generated imagery.",
    tokenCost: 30,
  },
  {
    id: "6",
    title: "Stable Turbo",
    shortName: "S",
    description: "Get involved with the fastest growing open software project. Download and join other developers in creating incredible applications with Stable Diffusion XL as a foundation model.",
    tokenCost: 18,
  },
]

export default function ModelsPresetPanel({ 
  isOpen, 
  onClose, 
  selectedModel, 
  onModelSelect,
  models = defaultModels,
  className = ""
}: ModelsPresetPanelProps) {
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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${className}`}
      >
        <motion.div
          ref={panelRef}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-[#1A1A1A] rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-white text-xl font-semibold">Select Model</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Models Grid */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {models.map((model) => (
                <div
                  key={model.id}
                  onClick={() => {
                    onModelSelect(model.title)
                    onClose()
                  }}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:border-[#6C3BFF] ${
                    selectedModel === model.title
                      ? "border-[#6C3BFF] bg-[#6C3BFF]/10"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold ${
                      selectedModel === model.title ? "bg-[#6C3BFF]" : "bg-white/10"
                    }`}>
                      {model.shortName}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium mb-1">{model.title}</h3>
                      <p className="text-gray-400 text-sm mb-2 line-clamp-2">{model.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Token Cost</span>
                        <span className="text-sm text-[#6C3BFF] font-medium">{model.tokenCost}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
