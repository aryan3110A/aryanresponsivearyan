"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

import ModelPreset from "./model-preset"
import StylePalettes from "./style-palettes"
import AspectRatio from "./aspect-ratio"
import NumberOfImages from "./number-of-images"
import SaveButton from "./save-button"
import Models from "./phoenix-models"
import Logo from "./logo"

interface SelectionModelProps {
  onClose?: () => void;
}

export default function SelectionModel({ onClose }: SelectionModelProps) {
  const [isModelsOpen, setIsModelsOpen] = useState(false)
  const [selectedModel, setSelectedModel] = useState("Flux 1.0")

  const sidebarRef = useRef<HTMLDivElement>(null)
  const presetRef = useRef<HTMLDivElement>(null)
  const appContainerRef = useRef<HTMLDivElement>(null)

  const toggleModels = () => {
    setIsModelsOpen(!isModelsOpen)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        appContainerRef.current &&
        !appContainerRef.current.contains(event.target as Node)
      ) {
        if (onClose) {
          onClose();
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  return (
    <div 
      ref={appContainerRef}
      className="absolute left-0 top-0 w-[380px] h-screen overflow-hidden z-50 mb:w-[300px]"
    >
      <div className="absolute inset-0 h-full bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg"></div>
      <div className="relative w-full h-full flex flex-col bg-[#121212] p-4">
        <button 
          onClick={() => {
            if (onClose) onClose();
          }} 
          className="self-end text-white mb-4"
        >
          Close
        </button>
        <Logo />
        <div className="mt-4" ref={presetRef}>
          <ModelPreset isOpen={isModelsOpen} toggle={toggleModels} selectedModel={selectedModel} />
        </div>
        <div className="mt-6">
          <StylePalettes />
        </div>
        <div className="mt-6">
          <AspectRatio />
        </div>
        <div className="mt-6">
          <NumberOfImages />
        </div>
        <div className="mt-8 flex justify-start mb:justify-end">
          <SaveButton />
        </div>
      </div>

      <AnimatePresence>
        {isModelsOpen && (
          <motion.div
            ref={sidebarRef}
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 left-[380px] w-[724px] h-screen overflow-auto mb:left-0 mb:w-[350px]"
          > 
            <div>
              <Models setSelectedModel={setSelectedModel} toggleModels={toggleModels} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
