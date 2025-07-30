'use client'

import React, { useState } from 'react'
import { Category } from '../page'
import { ArrowLeft, Sparkles, Wand2 } from 'lucide-react'

interface PromptInputProps {
  category: Category
  uploadedImage: string
  onGenerate: (prompt: string, model: string) => void
  onBack: () => void
}

const MODELS = [
  {
    id: 'flux-kontext-pro',
    name: 'Flux Kontext Pro',
    description: 'High-quality professional photography with excellent detail',
    recommended: true
  },
  {
    id: 'flux-kontext-max',
    name: 'Flux Kontext Max',
    description: 'Maximum quality with enhanced realism and lighting',
    premium: true
  }
]

const PROMPT_SUGGESTIONS = [
  "Beautiful gold earrings with intricate design",
  "Traditional Indian jewelry with kundan stones",
  "Elegant silver necklace with pendant",
  "Modern minimalist ring design",
  "Vintage-style bracelet with detailed work",
  "Statement earrings with pearl accents"
]

export default function PromptInput({ category, uploadedImage, onGenerate, onBack }: PromptInputProps) {
  const [prompt, setPrompt] = useState('')
  const [selectedModel, setSelectedModel] = useState('flux-kontext-pro')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = () => {
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    onGenerate(prompt.trim(), selectedModel)
  }

  const addSuggestion = (suggestion: string) => {
    if (prompt) {
      setPrompt(prompt + ', ' + suggestion.toLowerCase())
    } else {
      setPrompt(suggestion)
    }
  }

  const enhancePrompt = () => {
    if (!prompt.trim()) return
    
    const enhancedPrompt = `${prompt}, professional photography, high quality, detailed, beautiful lighting, elegant composition`
    setPrompt(enhancedPrompt)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Describe Your {category.name}</h1>
          <p className="text-gray-400">
            Tell us about your item to generate the perfect photos
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Preview */}
        <div className="space-y-6">
          <div className="bg-gray-800/50 rounded-xl p-4">
            <h3 className="font-semibold text-white mb-4">Your Image</h3>
            <img
              src={uploadedImage}
              alt="Uploaded jewelry"
              className="w-full h-64 object-contain bg-gray-900/50 rounded-lg"
            />
          </div>

          {/* AI Detection Preview */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
            <h3 className="font-semibold text-blue-300 mb-3">🤖 AI Analysis</h3>
            <p className="text-sm text-blue-200">
              Our AI will automatically detect the jewelry type, materials, and style from your image. 
              Your description will help create more accurate and detailed photos.
            </p>
          </div>
        </div>

        {/* Input Form */}
        <div className="space-y-6">
          {/* Prompt Input */}
          <div>
            <label className="block text-sm font-medium text-white mb-3">
              Describe your {category.name.toLowerCase()}
            </label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`e.g., "Beautiful gold jhumka earrings with green enamel work and pearl drops, traditional Indian design"`}
                className="w-full h-32 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#6C3BFF] focus:border-transparent resize-none"
                maxLength={500}
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                {prompt.length}/500
              </div>
            </div>
            
            <button
              onClick={enhancePrompt}
              disabled={!prompt.trim()}
              className="mt-2 flex items-center gap-2 px-3 py-1 bg-purple-600/20 hover:bg-purple-600/30 disabled:bg-gray-700/20 disabled:cursor-not-allowed text-purple-300 disabled:text-gray-500 rounded-lg text-sm transition-colors"
            >
              <Wand2 className="w-3 h-3" />
              Enhance with AI
            </button>
          </div>

          {/* Prompt Suggestions */}
          <div>
            <h4 className="text-sm font-medium text-white mb-3">Quick suggestions:</h4>
            <div className="flex flex-wrap gap-2">
              {PROMPT_SUGGESTIONS.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => addSuggestion(suggestion)}
                  className="px-3 py-1 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-full text-xs transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Model Selection */}
          <div>
            <label className="block text-sm font-medium text-white mb-3">
              AI Model
            </label>
            <div className="space-y-3">
              {MODELS.map((model) => (
                <div
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedModel === model.id
                      ? 'border-[#6C3BFF] bg-[#6C3BFF]/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedModel === model.id
                          ? 'border-[#6C3BFF] bg-[#6C3BFF]'
                          : 'border-gray-500'
                      }`}>
                        {selectedModel === model.id && (
                          <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                        )}
                      </div>
                      <span className="font-medium text-white">{model.name}</span>
                    </div>
                    <div className="flex gap-2">
                      {model.recommended && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
                          Recommended
                        </span>
                      )}
                      {model.premium && (
                        <span className="px-2 py-1 bg-amber-500/20 text-amber-300 text-xs rounded-full">
                          Premium
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">{model.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#6C3BFF] to-[#412399] hover:from-[#5A2FE6] hover:to-[#3A1F8A] disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-all transform hover:scale-[1.02] font-medium"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate 5 Professional Photos
              </>
            )}
          </button>

          {/* Info */}
          <div className="p-4 bg-gray-800/30 border border-gray-700/50 rounded-lg">
            <h4 className="font-medium text-white mb-2">What happens next?</h4>
            <ul className="space-y-1 text-sm text-gray-400">
              <li>• AI analyzes your image and description</li>
              <li>• Generates 5 different professional photos</li>
              <li>• Each photo has a unique angle and style</li>
              <li>• Process takes about 30-60 seconds</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
