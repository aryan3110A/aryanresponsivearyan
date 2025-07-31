"use client"

import { X, ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  selectedModel: string
  setSelectedModel: (model: string) => void
  sampleRate: number
  setSampleRate: (rate: number) => void
  bitrate: number
  setBitrate: (rate: number) => void
  audioFormat: string
  setAudioFormat: (format: string) => void
  outputFormat: string
  setOutputFormat: (format: string) => void
  lyrics: string
  songStructure: string[]
  setSongStructure: (structure: string[]) => void
}

export default function SettingsPanel({
  isOpen,
  onClose,
  selectedModel,
  setSelectedModel,
  sampleRate,
  setSampleRate,
  bitrate,
  setBitrate,
  audioFormat,
  setAudioFormat,
  outputFormat,
  setOutputFormat,
  lyrics,
  songStructure,
  setSongStructure,
}: SettingsPanelProps) {
  // State for music generation settings
  const [isModelsOpen, setIsModelsOpen] = useState(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  // Debug: Log whenever selectedModel changes
  console.log("SettingsPanel render - selectedModel:", selectedModel);

  useEffect(() => {
    console.log("SettingsPanel useEffect - selectedModel changed to:", selectedModel);
  }, [selectedModel]);

  const handleReset = () => {
    setIsModelsOpen(false);
    setSelectedModel("music-1.5");
    setSampleRate(44100);
    setBitrate(256000);
    setAudioFormat("mp3");
    setOutputFormat("hex");
    setSongStructure(["verse", "chorus", "verse", "chorus", "bridge", "chorus"]);
  };

  const handleSave = () => {
    // Handle save logic here
    console.log("Music settings saved:", {
      selectedModel,
      sampleRate,
      bitrate,
      audioFormat,
      outputFormat,
      lyrics: lyrics.substring(0, 50) + "...",
      songStructure,
    })
    onClose()
  }

  // Create structured lyrics preview
  const createStructuredLyrics = () => {
    if (songStructure.length === 0 || !lyrics.trim()) {
      return lyrics;
    }

    const lyricsLines = lyrics.split('\n').filter(line => line.trim());
    const linesPerSection = Math.ceil(lyricsLines.length / songStructure.length);

    let structuredLyrics = '';
    songStructure.forEach((section, index) => {
      const startIndex = index * linesPerSection;
      const endIndex = Math.min(startIndex + linesPerSection, lyricsLines.length);
      const sectionLines = lyricsLines.slice(startIndex, endIndex);

      if (sectionLines.length > 0) {
        structuredLyrics += `[${section}]\n${sectionLines.join('\n')}\n\n`;
      }
    });

    return structuredLyrics.trim();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />}

      {/* Settings Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-[90%] md:w-[560px] bg-transparent backdrop-blur-lg shadow-3xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-end p-4">
            <button onClick={onClose} className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors">
              <X className="w-6 h-6 text-white" />
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

            {/* Model & Preset Section */}
            <div className="relative">
              <button
                onClick={() => setIsModelsOpen(!isModelsOpen)}
                className="px-6 md:px-10 w-full py-6 md:py-8 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg border border-white/10 cursor-pointer hover:from-gray-700 hover:to-gray-600 transition-all mb-4 text-left relative overflow-hidden"
                style={{
                  backgroundImage: "url('/placeholder.svg?height=80&width=400')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <h3 className="text-white text-lg md:text-xl font-bold">
                      Model & <span className="text-[#6C3BFF]">Preset</span>
                    </h3>
                    <p className="text-gray-300 text-sm mt-1">
                      Selected: <span className="text-[#5AD7FF]">{selectedModel}</span>
                    </p>
                  </div>
                  <ChevronDown
                    className={`text-white text-xl md:text-3xl transition-transform duration-300 ${
                      isModelsOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Simple Models Dropdown */}
              {isModelsOpen && (
                <div className="space-y-2 px-2 md:px-6 mb-4">
                  {[
                    { title: "music-1.5", image: "/imagegenerationnew/models/model1.png", description: "Generate AI music with text prompt and lyrics" }
                  ].map((model) => (
                    <div
                      key={model.title}
                      className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all ${
                        selectedModel === model.title
                          ? "bg-white/20 border border-[#6C3BFF] ring-2 ring-[#6C3BFF]/50"
                          : "bg-white/10 hover:bg-white/15"
                      }`}
                      onClick={() => {
                        setSelectedModel(model.title);
                        setIsModelsOpen(false);
                      }}
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={model.image}
                          alt={model.title}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white text-base font-medium">{model.title}</h4>
                      </div>
                      {selectedModel === model.title && (
                        <div className="w-4 h-4 rounded-full bg-[#6C3BFF] flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Song Structure Section */}
            <div className="mb-6">
              <div className="mx-2 md:mx-6 border-t border-white/15 mb-6"></div>
              
              <div className="mb-4">
                <h3 className="text-white text-lg font-medium mb-4 px-2 md:px-6">Song Structure</h3>
                <div className="px-2 md:px-6">
                  <p className="text-sm text-gray-400 mb-3">Add sections to build your song:</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['intro', 'verse', 'chorus', 'bridge', 'outro'].map((section) => (
                      <button
                        key={section}
                        onClick={() => {
                          if (!songStructure.includes(section)) {
                            setSongStructure([...songStructure, section]);
                          }
                        }}
                        disabled={songStructure.includes(section)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          songStructure.includes(section)
                            ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                            : "bg-[#6C3BFF]/20 border border-[#6C3BFF] text-[#6C3BFF] hover:bg-[#6C3BFF]/30"
                        }`}
                      >
                        {songStructure.includes(section) ? "✓" : "+"} {section.charAt(0).toUpperCase() + section.slice(1)}
                      </button>
                    ))}
                  </div>

                  {/* Current Structure */}
                  {songStructure.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-400">Your song structure:</p>
                      <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                        <div className="flex flex-wrap gap-2">
                          {songStructure.map((section, index) => (
                            <div key={index} className="flex items-center gap-2 px-3 py-2 bg-[#6C3BFF] text-white rounded-lg text-sm font-medium">
                              <span>{index + 1}. {section.charAt(0).toUpperCase() + section.slice(1)}</span>
                              <button
                                onClick={() => setSongStructure(songStructure.filter((_, i) => i !== index))}
                                className="ml-1 w-5 h-5 flex items-center justify-center rounded-full hover:bg-red-500 transition-colors"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                        {songStructure.length > 0 && (
                          <button
                            onClick={() => setSongStructure([])}
                            className="mt-3 text-xs text-red-400 hover:text-red-300 transition-colors"
                          >
                            Clear all
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Preview Section */}
                  {showPreview && songStructure.length > 0 && lyrics.trim() && (
                    <div className="bg-gray-800/50 border border-gray-600 rounded-xl p-4 space-y-3 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        <span className="text-sm text-green-400 font-medium">Structured Preview</span>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-3 max-h-32 overflow-y-auto">
                        <pre className="text-sm text-gray-200 whitespace-pre-wrap font-mono leading-relaxed">
                          {createStructuredLyrics()}
                        </pre>
                      </div>
                      <p className="text-xs text-gray-400">This is how your lyrics will be sent to the AI music generator</p>
                    </div>
                  )}

                  {songStructure.length > 0 && lyrics.trim() && (
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className="mt-3 px-4 py-2 bg-[#6C3BFF]/20 border border-[#6C3BFF] text-[#6C3BFF] rounded-lg text-sm hover:bg-[#6C3BFF]/30 transition-colors"
                    >
                      {showPreview ? "Hide Preview" : "Show Preview"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Audio Settings Section - MinMax API Supported Only */}
            <div className="mb-6">
              <div className="mx-2 md:mx-6 border-t border-white/15 mb-6"></div>

              {/* Sample Rate - Fixed to MinMax recommended */}
              <div className="mb-4">
                <h3 className="text-white text-lg font-medium mb-4 px-2 md:px-6">Sample Rate</h3>
                <div className="px-2 md:px-6">
                  <div className="w-full h-[60px] border border-[#6C3BFF] rounded-lg flex items-center justify-center bg-white/10">
                    <span className="text-[#6C3BFF] text-sm font-medium">44100Hz (Recommended)</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">MinMax API recommended sample rate</p>
                </div>
              </div>

              {/* Bitrate - Fixed to MinMax recommended */}
              <div className="mb-4">
                <h3 className="text-white text-lg font-medium mb-4 px-2 md:px-6">Bitrate</h3>
                <div className="px-2 md:px-6">
                  <div className="w-full h-[60px] border border-[#6C3BFF] rounded-lg flex items-center justify-center bg-white/10">
                    <span className="text-[#6C3BFF] text-sm font-medium">256k (Recommended)</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">MinMax API recommended bitrate</p>
                </div>
              </div>

              {/* Audio Format - Fixed to MinMax supported */}
              <div className="mb-4">
                <h3 className="text-white text-lg font-medium mb-4 px-2 md:px-6">Audio Format</h3>
                <div className="px-2 md:px-6">
                  <div className="w-full h-[60px] border border-[#6C3BFF] rounded-lg flex items-center justify-center bg-white/10">
                    <span className="text-[#6C3BFF] text-sm font-medium">MP3</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">MinMax API supported format</p>
                </div>
              </div>

              {/* Output Format - MinMax supported options */}
              <div className="mb-4">
                <h3 className="text-white text-lg font-medium mb-4 px-2 md:px-6">Output Format</h3>
                <div className="grid grid-cols-2 gap-2 md:gap-4 px-2 md:px-6">
                  {["hex", "url"].map((format) => (
                    <div
                      key={format}
                      className={`w-full h-[60px] border rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all
                        ${outputFormat === format
                          ? "border-[#6C3BFF] text-[#6C3BFF] bg-white/10"
                          : "border-gray-700 text-white hover:border-[#6C3BFF] bg-white/10"
                        }`}
                      onClick={() => setOutputFormat(format)}
                    >
                      <span className="text-sm uppercase">{format}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 px-2 md:px-6 mt-2">
                  Choose &quot;url&quot; to receive a direct downloadable file link
                </p>
              </div>
            </div>

            {/* Reset to Defaults Section */}
            <div className="mb-6">
              <div className="px-2 md:px-6">
                <button
                  onClick={handleReset}
                  className="w-full bg-gray-800/50 hover:bg-gray-700/50 text-white py-3 rounded-lg font-medium transition-colors border border-gray-600"
                >
                  Reset to Defaults
                </button>
              </div>
            </div>
              
            {/* Save Button */}
            <div className="mb-6 px-2 md:px-6">
              <button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-[#6C3BFF] to-[#412399] hover:from-[#5A2FE6] hover:to-[#3A1F8A] text-white py-4 rounded-lg font-medium text-lg transition-all"
              >
                Save
              </button>

              {/* Summary Section */}
              <div className="bg-white/10 backdrop-blur-3xl hover:bg-white/20 rounded-lg p-4 space-y-2 text-sm text-gray-300 mt-6">
                <div className="text-white font-medium mb-3">Music Generation Settings</div>
                <div>Model: <span className="text-[#5AD7FF]">{selectedModel}</span></div>
                <div>Sample Rate: <span className="text-[#5AD7FF]">44100Hz (Fixed)</span></div>
                <div>Bitrate: <span className="text-[#5AD7FF]">256k (Fixed)</span></div>
                <div>Format: <span className="text-[#5AD7FF]">MP3 (Fixed)</span></div>
                <div>Output Format: <span className="text-[#5AD7FF]">{outputFormat.toUpperCase()}</span></div>
                <div>Lyrics Length: <span className="text-[#5AD7FF]">{lyrics.length}/600</span></div>
                <div>Song Structure: <span className="text-[#5AD7FF]">{songStructure.length} sections</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
