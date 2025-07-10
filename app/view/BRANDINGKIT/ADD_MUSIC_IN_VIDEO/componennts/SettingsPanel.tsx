"use client"

import { useState } from "react"
import Image from "next/image"
import { ExternalLink } from "lucide-react"

export default function SettingsPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  // Music type state
  const [selectedMusic, setSelectedMusic] = useState("Classic")
  const [privateMode, setPrivateMode] = useState(false)
  const [isCollectionOpen, setIsCollectionOpen] = useState(true)
  const [collections, setCollections] = useState<string[]>([])
  const [isAdvanceOpen, setIsAdvanceOpen] = useState(true)
  const [photoReal, setPhotoReal] = useState(false)
  const [negativePrompt, setNegativePrompt] = useState(false)
  const [transparency, setTransparency] = useState(false)
  const [tiling, setTiling] = useState(false)
  const [fixedSeed, setFixedSeed] = useState(false)
  const [promptEnhance, setPromptEnhance] = useState("Auto")
  const promptEnhanceOptions = ["Auto", "Standard", "Creative"]
  const [isPromptEnhanceOpen, setIsPromptEnhanceOpen] = useState(false)

  const handleReset = () => {
    setSelectedMusic("Classic")
    setPrivateMode(false)
    setIsCollectionOpen(true)
    setCollections([])
    setIsAdvanceOpen(true)
    setPhotoReal(false)
    setNegativePrompt(false)
    setTransparency(false)
    setTiling(false)
    setFixedSeed(false)
    setPromptEnhance("Auto")
    setIsPromptEnhanceOpen(false)
  }

  const musicOptions = [
    {
      label: "Classic",
      icon: "/BRANDINGKIT/ADD_MUSIC_IN_VIDEO/classic.svg"
    },
    {
      label: "Hiphop",
      icon: "/BRANDINGKIT/ADD_MUSIC_IN_VIDEO/hiphop.svg"
    }
  ]

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />}
      <div className={`fixed top-0 left-0 h-full w-[90%] md:w-[420px] bg-[#18181b] shadow-3xl transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-end p-4">
            <button onClick={onClose} className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors">
              <span className="text-white text-2xl">×</span>
            </button>
          </div>
          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 space-y-6 scrollbar-hide pb-6">
            <style jsx>{`
              .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
              .scrollbar-hide::-webkit-scrollbar { 
                display: none;
              }
            `}</style>
            {/* Type of music */}
            <div className="mb-6">
              <h3 className="text-white text-lg md:text-xl font-medium mb-4">Type of music</h3>
              <div className="space-y-4">
                {musicOptions.map(option => (
                  <button
                    key={option.label}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left bg-black/30 hover:bg-white/10 border-white/10 ${selectedMusic === option.label ? "border-[#6C3BFF] ring-2 ring-[#6C3BFF]" : ""}`}
                    onClick={() => setSelectedMusic(option.label)}
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-white/10 flex items-center justify-center">
                      <Image src={option.icon} alt={option.label} width={40} height={40} />
                    </div>
                    <span className="text-white text-base font-medium flex-1">{option.label}</span>
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMusic === option.label ? "border-[#6C3BFF]" : "border-gray-500"}`}>
                      {selectedMusic === option.label && <span className="block w-3 h-3 rounded-full bg-[#6C3BFF]" />}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            {/* Private Mode Section */}
            <div className="mb-6 flex items-center justify-between border-t border-white/10 pt-6">
              <div className="flex items-center gap-2">
                <span className="text-white text-lg font-medium">Private Mode</span>
                <Image src="/BRANDINGKIT/ADD_MUSIC_IN_VIDEO/Iicon.svg" alt="Info" width={18} height={18} />
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center">
                  <Image src="/BRANDINGKIT/ADD_MUSIC_IN_VIDEO/diamondicon.svg" alt="Premium" width={32} height={30} />
                </span>
                <button
                  className={`relative w-12 h-6 flex items-center rounded-full transition-colors duration-200 ${privateMode ? 'bg-[#6C3BFF]' : 'bg-gray-700'}`}
                  onClick={() => setPrivateMode(v => !v)}
                  aria-label="Toggle Private Mode"
                >
                  <span
                    className={`absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ${privateMode ? 'translate-x-6' : ''}`}
                  />
                </button>
              </div>
            </div>
            {/* Add To Collection Section */}
            <div className="mb-6 border-t border-white/10 pt-6">
              <div className="flex items-center mb-2 cursor-pointer" onClick={() => setIsCollectionOpen((v) => !v)}>
                <h3 className="text-white text-lg md:text-xl font-medium mr-2">Add To Collection</h3>
                <Image src="/BRANDINGKIT/ADD_MUSIC_IN_VIDEO/Iicon.svg" alt="Info" width={18} height={18} />
                <span className={`transition-transform ml-2 ${isCollectionOpen ? "rotate-180" : ""}`} style={{ display: 'inline-block' }}>
                  <Image src="/BRANDINGKIT/ADD_MUSIC_IN_VIDEO/dropdownicon.svg" alt="Dropdown" width={18} height={18} />
                </span>
              </div>
              {isCollectionOpen && (
                <div className="space-y-3">
                  <button
                    className="flex items-center gap-3 p-0 bg-transparent border-none shadow-none focus:outline-none"
                    onClick={() => setCollections([...collections, `Collection ${collections.length + 1}`])}
                  >
                    <span className="w-10 h-10 flex items-center justify-center rounded-lg bg-black/40 border border-white/10 mr-2">
                      <Image src="/BRANDINGKIT/ADD_MUSIC_IN_VIDEO/Frame.svg" alt="Add Collection" width={24} height={24} />
                    </span>
                    <span className="text-white text-base font-medium">Add New Collection</span>
                  </button>
                  <button
                    className="w-full flex items-center justify-between p-3 rounded-lg border-2 border-[#6C3BFF] bg-black/30 hover:bg-white/10 transition-all text-white text-base font-medium mt-2"
                  >
                    <span>View All</span>
                    <ExternalLink className="w-5 h-5 text-white ml-2" />
                  </button>
                </div>
              )}
            </div>
            {/* Advance Setting Section */}
            <div className="mb-6 border-t border-white/10 pt-6">
              <div className="flex items-center justify-between mb-2 cursor-pointer" onClick={() => setIsAdvanceOpen((v) => !v)}>
                <div className="flex items-center gap-2">
                  <h3 className="text-white text-lg md:text-xl font-medium">Advance Setting</h3>
                  <Image src="/BRANDINGKIT/ADD_MUSIC_IN_VIDEO/Iicon.svg" alt="Info" width={18} height={18} />
                </div>
                <span className={`transition-transform ${isAdvanceOpen ? 'rotate-180' : ''}`} style={{ display: 'inline-block' }}>
                  <Image src="/BRANDINGKIT/ADD_MUSIC_IN_VIDEO/dropdownicon.svg" alt="Dropdown" width={18} height={18} />
                </span>
              </div>
              {isAdvanceOpen && (
                <div className="space-y-3 w-full min-w-full">
                  {/* Photo Real Toggle */}
                  <div className="flex items-center justify-between w-full bg-white/5 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-base">Photo Real</span>
                      <Image src="/BRANDINGKIT/ADD_MUSIC_IN_VIDEO/Iicon.svg" alt="Info" width={18} height={18} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center">
                        <Image src="/BRANDINGKIT/ADD_MUSIC_IN_VIDEO/diamondicon.svg" alt="Premium" width={28} height={26} />
                      </span>
                      <button
                        className={`relative w-12 h-6 flex items-center rounded-full transition-colors duration-200 ${photoReal ? 'bg-[#6C3BFF]' : 'bg-gray-700'}`}
                        onClick={() => setPhotoReal(v => !v)}
                        aria-label="Toggle Photo Real"
                      >
                        <span
                          className={`absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ${photoReal ? 'translate-x-6' : ''}`}
                        />
                      </button>
                    </div>
                  </div>
                  {/* Negative Prompt Toggle */}
                  <div className="flex items-center justify-between w-full bg-white/5 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-base">Negative Prompt</span>
                      <Image src="/BRANDINGKIT/ADD_MUSIC_IN_VIDEO/Iicon.svg" alt="Info" width={18} height={18} />
                    </div>
                    <button
                      className={`relative w-12 h-6 flex items-center rounded-full transition-colors duration-200 ${negativePrompt ? 'bg-[#6C3BFF]' : 'bg-gray-700'}`}
                      onClick={() => setNegativePrompt(v => !v)}
                      aria-label="Toggle Negative Prompt"
                    >
                      <span
                        className={`absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ${negativePrompt ? 'translate-x-6' : ''}`}
                      />
                    </button>
                  </div>
                  {/* Transparency Toggle */}
                  <div className="flex items-center justify-between w-full bg-white/5 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-base">Transparency</span>
                      <Image src="/BRANDINGKIT/ADD_MUSIC_IN_VIDEO/Iicon.svg" alt="Info" width={18} height={18} />
                    </div>
                    <button
                      className={`relative w-12 h-6 flex items-center rounded-full transition-colors duration-200 ${transparency ? 'bg-[#6C3BFF]' : 'bg-gray-700'}`}
                      onClick={() => setTransparency(v => !v)}
                      aria-label="Toggle Transparency"
                    >
                      <span
                        className={`absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ${transparency ? 'translate-x-6' : ''}`}
                      />
                    </button>
                  </div>
                  {/* Tilling Toggle */}
                  <div className="flex items-center justify-between w-full bg-white/5 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-base">Tilling</span>
                      <Image src="/BRANDINGKIT/ADD_MUSIC_IN_VIDEO/Iicon.svg" alt="Info" width={18} height={18} />
                    </div>
                    <button
                      className={`relative w-12 h-6 flex items-center rounded-full transition-colors duration-200 ${tiling ? 'bg-[#6C3BFF]' : 'bg-gray-700'}`}
                      onClick={() => setTiling(v => !v)}
                      aria-label="Toggle Tilling"
                    >
                      <span
                        className={`absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ${tiling ? 'translate-x-6' : ''}`}
                      />
                    </button>
                  </div>
                  {/* Use Fixed Seed Toggle */}
                  <div className="flex items-center justify-between w-full bg-white/5 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-base">Use Fixed Seed</span>
                      <Image src="/BRANDINGKIT/ADD_MUSIC_IN_VIDEO/Iicon.svg" alt="Info" width={18} height={18} />
                    </div>
                    <button
                      className={`relative w-12 h-6 flex items-center rounded-full transition-colors duration-200 ${fixedSeed ? 'bg-[#6C3BFF]' : 'bg-gray-700'}`}
                      onClick={() => setFixedSeed(v => !v)}
                      aria-label="Toggle Use Fixed Seed"
                    >
                      <span
                        className={`absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ${fixedSeed ? 'translate-x-6' : ''}`}
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* Reset to Defaults Button */}
            <div className="mb-4">
              <button className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-base transition-all"
                onClick={handleReset}>
                <Image src="/BRANDINGKIT/ADD_MUSIC_IN_VIDEO/reply.svg" alt="Reset" width={22} height={22} />
                Reset to Defaults
              </button>
            </div>
            {/* Prompt Enhance Dropdown */}
            <div className="mb-4">
              <div className="relative">
                <button
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-base transition-all flex-col items-start"
                  onClick={() => setIsPromptEnhanceOpen(v => !v)}
                  style={{ alignItems: 'stretch' }}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="flex items-center gap-2">
                      <Image src="/BRANDINGKIT/ADD_MUSIC_IN_VIDEO/stars.svg" alt="Prompt Enhance" width={22} height={22} />
                      <span className="text-xs text-white/80">Prompt Enhance</span>
                    </span>
                    <span className={`transition-transform ${isPromptEnhanceOpen ? 'rotate-180' : ''}`} style={{ display: 'inline-block' }}>
                      <Image src="/BRANDINGKIT/ADD_MUSIC_IN_VIDEO/dropdownicon.svg" alt="Dropdown" width={18} height={18} />
                    </span>
                  </div>
                  <span className="block mt-1 ml-7 text-white text-base font-bold text-left">{promptEnhance}</span>
                </button>
                {isPromptEnhanceOpen && (
                  <div className="absolute left-0 right-0 mt-1 bg-[#18181b] rounded-lg shadow-lg z-10">
                    {promptEnhanceOptions.map(option => (
                      <button
                        key={option}
                        className={`w-full text-left px-4 py-2 text-white hover:bg-[#23232a] rounded-lg transition-all ${promptEnhance === option ? 'bg-[#6C3BFF]/20' : ''}`}
                        onClick={() => { setPromptEnhance(option); setIsPromptEnhanceOpen(false); }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* Save Button */}
            <div className="mb-6">
              <button className="w-full flex items-center justify-center gap-2 py-4 rounded-lg bg-gradient-to-r from-[#6C3BFF] to-[#412399] hover:from-[#5A2FE6] hover:to-[#3A1F8A] text-white font-semibold text-lg transition-all"
                onClick={() => {}}>
                Save
                <span className="flex items-center ml-2 text-base font-medium">
                  (
                  <Image src="/BRANDINGKIT/ADD_MUSIC_IN_VIDEO/coins.svg" alt="Tokens" width={24} height={24} className="mx-1" />
                  100
                  )
                </span>
              </button>
            </div>
            {/* Summary Section */}
            <div className="bg-white/10 backdrop-blur-3xl rounded-lg p-4 space-y-2 text-sm text-gray-300 mt-2 mb-6">
              <div className="flex justify-between">
                <span className="font-semibold text-white">Type of music :</span>
                <span className="text-white">{selectedMusic}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
