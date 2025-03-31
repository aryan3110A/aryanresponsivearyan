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
  // State to track if the models panel is open
  const [isModelsOpen, setIsModelsOpen] = useState(false)
  
  // Refs for click-outside detection
  const sidebarRef = useRef<HTMLDivElement>(null)
  const presetRef = useRef<HTMLDivElement>(null)
  const appContainerRef = useRef<HTMLDivElement>(null)
  
  // Function to toggle the models panel
  const toggleModels = () => {
    setIsModelsOpen(!isModelsOpen)
  }

  // Close SelectionModel when clicking outside its container
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
      className="absolute left-0 top-0 w-[380px] h-screen overflow-hidden z-50"
    >
      <div className="absolute inset-0 h-full bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg"></div>
      <div className="relative w-full h-full flex flex-col bg-[#121212] p-4">
        {/* Close button */}
        <button 
          onClick={() => {
            if (onClose) {
              onClose();
            }
          }} 
          className="self-end text-white mb-4"
        >
          Close
        </button>
        <Logo />
        <div className="mt-4" ref={presetRef}>
          <ModelPreset isOpen={isModelsOpen} toggle={toggleModels} />
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
        <div className="mt-8 flex justify-start">
          <SaveButton />
        </div>
      </div>

      {/* Models Panel with Animation */}
      <AnimatePresence>
        {isModelsOpen && (
          <motion.div
            ref={sidebarRef}
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 left-[380px] w-[724px] h-screen overflow-auto"
          > 
            <div>
              <Models />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
