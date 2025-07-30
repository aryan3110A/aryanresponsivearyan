'use client'

import React, { useState } from 'react'
import { X, Wand2, Loader2, RefreshCw, Copy, Check } from 'lucide-react'

interface PromptEnhancerProps {
  initialPrompt: string
  onEnhance: (enhancedPrompt: string) => void
  onClose: () => void
}

const ENHANCEMENT_STYLES = [
  {
    name: 'Artistic',
    description: 'Add artistic flair and creative elements',
    keywords: ['artistic', 'creative', 'expressive', 'stylized', 'aesthetic']
  },
  {
    name: 'Photorealistic',
    description: 'Enhance for realistic photography style',
    keywords: ['photorealistic', 'detailed', 'high resolution', 'professional photography', 'sharp focus']
  },
  {
    name: 'Cinematic',
    description: 'Add cinematic lighting and composition',
    keywords: ['cinematic', 'dramatic lighting', 'film grain', 'wide shot', 'atmospheric']
  },
  {
    name: 'Fantasy',
    description: 'Add magical and fantastical elements',
    keywords: ['fantasy', 'magical', 'ethereal', 'mystical', 'enchanted']
  },
  {
    name: 'Minimalist',
    description: 'Clean, simple, and focused composition',
    keywords: ['minimalist', 'clean', 'simple', 'elegant', 'uncluttered']
  },
  {
    name: 'Vintage',
    description: 'Add retro and nostalgic elements',
    keywords: ['vintage', 'retro', 'nostalgic', 'aged', 'classic']
  }
]

const QUALITY_ENHANCERS = [
  'highly detailed',
  'masterpiece',
  'best quality',
  'ultra high resolution',
  'professional',
  'award winning',
  'stunning',
  'breathtaking'
]

const TECHNICAL_ENHANCERS = [
  '8k resolution',
  'sharp focus',
  'perfect composition',
  'professional lighting',
  'depth of field',
  'rule of thirds',
  'golden hour lighting',
  'studio lighting'
]

export default function PromptEnhancer({ initialPrompt, onEnhance, onClose }: PromptEnhancerProps) {
  const [enhancedPrompt, setEnhancedPrompt] = useState('')
  const [selectedStyle, setSelectedStyle] = useState<string>('')
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [copied, setCopied] = useState(false)

  const enhancePrompt = async (style?: string) => {
    setIsEnhancing(true)
    
    try {
      // Simulate AI enhancement (in a real app, you'd call an AI service)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      let enhanced = initialPrompt.trim()
      
      // Add style-specific enhancements
      if (style) {
        const styleConfig = ENHANCEMENT_STYLES.find(s => s.name === style)
        if (styleConfig) {
          const randomKeywords = styleConfig.keywords
            .sort(() => 0.5 - Math.random())
            .slice(0, 2)
          enhanced += `, ${randomKeywords.join(', ')}`
        }
      }
      
      // Add quality enhancers
      const qualityEnhancer = QUALITY_ENHANCERS[Math.floor(Math.random() * QUALITY_ENHANCERS.length)]
      enhanced += `, ${qualityEnhancer}`
      
      // Add technical enhancers
      const techEnhancer = TECHNICAL_ENHANCERS[Math.floor(Math.random() * TECHNICAL_ENHANCERS.length)]
      enhanced += `, ${techEnhancer}`
      
      // Add some creative variations
      const creativeAdditions = [
        'perfect lighting',
        'beautiful composition',
        'intricate details',
        'vibrant colors',
        'smooth textures',
        'professional grade'
      ]
      
      const randomCreative = creativeAdditions[Math.floor(Math.random() * creativeAdditions.length)]
      enhanced += `, ${randomCreative}`
      
      setEnhancedPrompt(enhanced)
    } catch (error) {
      console.error('Enhancement failed:', error)
      setEnhancedPrompt(initialPrompt + ', enhanced with artistic details, high quality, professional')
    } finally {
      setIsEnhancing(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  const handleStyleSelect = (styleName: string) => {
    setSelectedStyle(styleName)
    enhancePrompt(styleName)
  }

  const handleRandomEnhance = () => {
    const randomStyle = ENHANCEMENT_STYLES[Math.floor(Math.random() * ENHANCEMENT_STYLES.length)]
    setSelectedStyle(randomStyle.name)
    enhancePrompt(randomStyle.name)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Prompt Enhancer</h2>
              <p className="text-gray-400 text-sm">Improve your prompt with AI-powered suggestions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Original Prompt */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Original Prompt</label>
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
              <p className="text-gray-200">{initialPrompt}</p>
            </div>
          </div>

          {/* Style Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Enhancement Style</label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {ENHANCEMENT_STYLES.map((style) => (
                <button
                  key={style.name}
                  onClick={() => handleStyleSelect(style.name)}
                  disabled={isEnhancing}
                  className={`p-4 rounded-lg border transition-all text-left ${
                    selectedStyle === style.name
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                  } ${isEnhancing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <h3 className="font-medium text-white mb-1">{style.name}</h3>
                  <p className="text-xs text-gray-400">{style.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Random Enhancement */}
          <div className="flex justify-center">
            <button
              onClick={handleRandomEnhance}
              disabled={isEnhancing}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${isEnhancing ? 'animate-spin' : ''}`} />
              Surprise Me!
            </button>
          </div>

          {/* Enhanced Prompt */}
          {(enhancedPrompt || isEnhancing) && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Enhanced Prompt</label>
              <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 min-h-[100px]">
                {isEnhancing ? (
                  <div className="flex items-center justify-center h-20">
                    <div className="flex items-center gap-3 text-purple-400">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Enhancing your prompt...</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-200 mb-3">{enhancedPrompt}</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(enhancedPrompt)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors text-sm"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3 h-3 text-green-400" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <h3 className="text-blue-300 font-medium mb-2">💡 Enhancement Tips</h3>
            <ul className="text-blue-200 text-sm space-y-1">
              <li>• Be specific about what you want to see in the image</li>
              <li>• Include style, mood, and technical details</li>
              <li>• Mention lighting, composition, and quality preferences</li>
              <li>• Use descriptive adjectives and artistic terms</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onEnhance(enhancedPrompt || initialPrompt)}
            disabled={!enhancedPrompt && !isEnhancing}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg transition-colors"
          >
            Use Enhanced Prompt
          </button>
        </div>
      </div>
    </div>
  )
}
