'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, Upload, Wand2, Settings, Image as ImageIcon, Loader2 } from 'lucide-react'
import SafeImage from './SafeImage'
import { preloadAndCache } from '@/lib/imagePreloader'
import { ChatMessage, GeneratedImage } from '../page'
import MessageBubble from './MessageBubble'
import PromptEnhancer from './PromptEnhancer'

interface ChatInterfaceProps {
  messages: ChatMessage[]
  onAddMessage: (message: Omit<ChatMessage, 'id'>) => Promise<void>
  onAddGeneratedImage: (image: Omit<GeneratedImage, 'id'>) => Promise<void>
  isGenerating: boolean
  setIsGenerating: (generating: boolean) => void
  selectedImageForEdit: GeneratedImage | null
  onClearSelectedImage: () => void
  onClearChat?: () => void
}

const ASPECT_RATIOS = [
  { label: '1:1 Square', value: '1:1' },
  { label: '16:9 Landscape', value: '16:9' },
  { label: '9:16 Portrait', value: '9:16' },
  { label: '4:3 Standard', value: '4:3' },
  { label: '3:4 Portrait', value: '3:4' },
  { label: '21:9 Ultrawide', value: '21:9' },
  { label: '9:21 Tall', value: '9:21' }
]

const MODELS = [
  { 
    label: 'Flux Kontext Pro', 
    value: 'flux-kontext-pro',
    description: 'High-quality image generation with advanced context understanding'
  },
  { 
    label: 'Flux Kontext Max', 
    value: 'flux-kontext-max',
    description: 'Maximum quality with enhanced detail and precision'
  }
]

// Add interface for request body
// interface ImageGenerationRequestBody {
//   prompt: string;
//   aspect_ratio: string;
//   output_format: string;
//   prompt_upsampling: boolean;
//   safety_tolerance: number;
//   input_image?: string;
//   seed?: number;
// }

export default function ChatInterface({
  messages,
  onAddMessage,
  onAddGeneratedImage,
  isGenerating,
  setIsGenerating,
  selectedImageForEdit,
  onClearSelectedImage,
  onClearChat
}: ChatInterfaceProps) {
  const [prompt, setPrompt] = useState('')
  const [selectedModel, setSelectedModel] = useState('flux-kontext-pro')
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [seed, setSeed] = useState<number | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [promptUpsampling, setPromptUpsampling] = useState(false)
  const [safetyTolerance, setSafetyTolerance] = useState(2)
  const [showPromptEnhancer, setShowPromptEnhancer] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Determine if we're in edit mode
  const isEditMode = !!selectedImageForEdit
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const generateImage = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)

    // Add user message (clean undefined values)
    const userMessage: Omit<ChatMessage, 'id'> = {
      type: 'user',
      content: isEditMode ? `[EDIT MODE] ${prompt}` : prompt,
      timestamp: new Date(),
      model: selectedModel,
      aspectRatio
    }

    // Only add optional fields if they have values
    if (uploadedImage) {
      userMessage.imageUrl = uploadedImage
    } else if (isEditMode && selectedImageForEdit) {
      userMessage.imageUrl = selectedImageForEdit.imageUrl
    }
    if (seed) {
      userMessage.seed = seed
    }

    await onAddMessage(userMessage)

    try {
      // Prepare request body
      const requestBody: {
        prompt: string
        aspect_ratio: string
        output_format: string
        prompt_upsampling: boolean
        safety_tolerance: number
        input_image?: string
        seed?: number
      } = {
        prompt: prompt.trim(),
        aspect_ratio: aspectRatio,
        output_format: 'png',
        prompt_upsampling: promptUpsampling,
        safety_tolerance: safetyTolerance
      }

      // In edit mode, use selected image; otherwise use uploaded image
      let inputImageBase64 = null
      if (isEditMode && selectedImageForEdit) {
        // Convert selected image URL to base64 for editing
        try {
          const response = await fetch(selectedImageForEdit.imageUrl)
          const blob = await response.blob()
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onload = () => {
              const result = reader.result as string
              const base64Data = result.includes(',') ? result.split(',')[1] : result
              resolve(base64Data)
            }
            reader.readAsDataURL(blob)
          })
          inputImageBase64 = base64
          console.log('🖼️ Using selected image for editing:', selectedImageForEdit.id)
        } catch (error) {
          console.error('❌ Failed to convert selected image to base64:', error)
        }
      } else if (uploadedImage) {
        // Convert uploaded data URL to base64
        inputImageBase64 = uploadedImage.includes(',') ? uploadedImage.split(',')[1] : uploadedImage
        console.log('📤 Using uploaded reference image')
      }

      if (inputImageBase64) {
        requestBody.input_image = inputImageBase64
      }

      if (seed) {
        requestBody.seed = seed
      }

      // Call the API - map model names to correct endpoints
      const apiUrl = `/api/${selectedModel}`  // selectedModel already includes 'flux-'
      console.log('🌐 Calling API:', apiUrl)
      console.log('📤 Request body:', requestBody)

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      console.log('📥 API Response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API Error:', response.status, errorText)
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log('📊 API Response data:', data)

      if (data.error) {
        console.error('❌ API returned error:', data.error)
        throw new Error(data.error)
      }

      // Validate response format
      if (!data.id && !data.result && !data.imageUrl) {
        console.error('❌ Invalid API response format:', data)
        throw new Error('Invalid response format from API')
      }

      // Add assistant message with generated image (clean undefined values)
      const assistantMessage: Omit<ChatMessage, 'id'> = {
        type: 'assistant',
        content: isEditMode ? 'Image edited successfully!' : 'Image generated successfully!',
        timestamp: new Date(),
        prompt,
        model: selectedModel,
        aspectRatio,
        taskId: data.id
      }

      // Add edit mode information
      if (isEditMode && selectedImageForEdit) {
        // Note: Edit mode information is handled in the content
      }

      // Only add imageUrl if it exists
      const generatedImageUrl = data.result?.sample || data.imageUrl
      if (generatedImageUrl) {
        assistantMessage.imageUrl = generatedImageUrl
      }
      if (seed) {
        assistantMessage.seed = seed
      }

      await onAddMessage(assistantMessage)

      // Add to generated images collection
      if (generatedImageUrl) {
        const generatedImage: Omit<GeneratedImage, 'id'> = {
          imageUrl: generatedImageUrl,
          originalImageUrl: data.originalImageUrl || null,
          storagePath: data.storagePath || null,
          storedInFirebase: data.metadata?.storedInFirebase || false,
          prompt,
          model: selectedModel,
          aspectRatio,
          timestamp: new Date(),
          taskId: data.id
        }

        // Only add seed if it exists
        if (seed) {
          generatedImage.seed = seed
        }

        await onAddGeneratedImage(generatedImage)

        // Preload the image for better UX
        if (generatedImageUrl) {
          console.log('🔄 Preloading generated image...')
          const preloadSuccess = await preloadAndCache(generatedImageUrl)
          if (preloadSuccess) {
            console.log('✅ Image preloaded and cached')
          } else {
            console.log('⚠️ Image preload failed')
          }
        }

        // Log storage status and show warnings
        if (data.metadata?.storedInFirebase) {
          console.log('✅ Image permanently stored in Firebase Storage')
        } else {
          console.log('⚠️ Image using temporary URL - may expire')

          // Show warning to user about temporary URL
          if (data.metadata?.storageError) {
            console.error('🚨 Firebase Storage Error:', data.metadata.storageError)

            // Add a warning message to chat
            await onAddMessage({
              type: 'assistant',
              content: `⚠️ Warning: Image stored temporarily due to Firebase Storage error: ${data.metadata.storageError}. The image may expire after some time.`,
              timestamp: new Date()
            })
          }
        }
      }

      // Reset form and clear edit mode
      setPrompt('')
      setUploadedImage(null)
      setSeed(null)
      if (isEditMode) {
        onClearSelectedImage()
        console.log('✅ Edit mode cleared after successful generation')
      }

    } catch (error) {
      console.error('Generation error:', error)
      await onAddMessage({
        type: 'assistant',
        content: `Error generating image: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isGenerating && prompt.trim()) {
      generateImage()
    }
  }

  const handleEnhancedPrompt = (enhancedPrompt: string) => {
    setPrompt(enhancedPrompt)
    setShowPromptEnhancer(false)
  }

  // Test API connectivity
  const testAPI = async () => {
    try {
      console.log('🧪 Testing API connectivity...')
      const response = await fetch(`/api/${selectedModel}`, {
        method: 'GET'
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ API test successful:', data)
        alert(`API is working! ${data.message}`)
      } else {
        console.error('❌ API test failed:', response.status)
        alert(`API test failed: ${response.status}`)
      }
    } catch (error) {
      console.error('❌ API test error:', error)
      alert(`API test error: ${error}`)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-[#6C3BFF] to-[#412399] rounded-full flex items-center justify-center mb-4">
              <ImageIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {isEditMode ? 'Edit Mode Active' : 'Start Creating'}
            </h3>
            <p className="text-gray-400 max-w-md">
              {isEditMode
                ? 'Describe how you want to modify the selected image and I\'ll edit it for you.'
                : 'Describe the image you want to create, upload a reference image, and let AI bring your vision to life.'
              }
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        
        {isGenerating && (
          <div className="flex items-center gap-3 p-4 bg-gray-800/30 rounded-xl">
            <Loader2 className="w-5 h-5 animate-spin text-[#6C3BFF]" />
            <span className="text-gray-300">Generating your image...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-700/50 bg-gray-900/50 backdrop-blur-sm p-4">
        {/* Edit Mode Indicator */}
        {isEditMode && selectedImageForEdit && (
          <div className="mb-4 p-4 bg-purple-900/20 border border-purple-500/30 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-purple-300 font-medium">Edit Mode Active</span>
              <button
                onClick={onClearSelectedImage}
                className="ml-auto text-purple-400 hover:text-purple-300 transition-colors"
                title="Exit edit mode"
              >
                ×
              </button>
            </div>
            <div className="flex items-center gap-3">
              <SafeImage
                src={selectedImageForEdit.imageUrl}
                alt="Selected for editing"
                width={60}
                height={60}
                className="w-15 h-15 object-cover rounded-lg"
                fallbackText="Preview unavailable"
              />
              <div className="flex-1">
                <p className="text-sm text-purple-200 mb-1">Editing this image:</p>
                <p className="text-xs text-purple-300 line-clamp-2">{selectedImageForEdit.prompt}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-purple-400">
                  <span>{selectedImageForEdit.model.replace('flux-', '').replace('-', ' ')}</span>
                  <span>•</span>
                  <span>{selectedImageForEdit.aspectRatio}</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-purple-400 mt-2">
              💡 Your prompt will be applied to modify this image
            </p>
          </div>
        )}
        {/* Settings Panel */}
        {showSettings && (
          <div className="mb-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Model Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#6C3BFF] focus:border-transparent"
                >
                  {MODELS.map((model) => (
                    <option key={model.value} value={model.value}>
                      {model.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Aspect Ratio */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Aspect Ratio</label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#6C3BFF] focus:border-transparent"
                >
                  {ASPECT_RATIOS.map((ratio) => (
                    <option key={ratio.value} value={ratio.value}>
                      {ratio.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Seed */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Seed (Optional)</label>
                <input
                  type="number"
                  value={seed || ''}
                  onChange={(e) => setSeed(e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="Random"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#6C3BFF] focus:border-transparent"
                />
              </div>

              {/* Safety Tolerance */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Safety Level</label>
                <select
                  value={safetyTolerance}
                  onChange={(e) => setSafetyTolerance(parseInt(e.target.value))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#6C3BFF] focus:border-transparent"
                >
                  <option value={0}>Most Strict</option>
                  <option value={1}>Very Strict</option>
                  <option value={2}>Moderate</option>
                  <option value={3}>Relaxed</option>
                  <option value={4}>Very Relaxed</option>
                  <option value={5}>Minimal</option>
                  <option value={6}>Least Strict</option>
                </select>
              </div>
            </div>

            {/* Prompt Upsampling */}
            <div className="mt-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={promptUpsampling}
                  onChange={(e) => setPromptUpsampling(e.target.checked)}
                  className="rounded border-gray-600 bg-gray-700 text-[#6C3BFF] focus:ring-[#6C3BFF]"
                />
                <span className="text-sm text-gray-300">
                  Enable prompt upsampling (automatically enhances prompts for more creative generation)
                </span>
              </label>
            </div>

            {/* API Test Buttons */}
            <div className="mt-4 space-y-2">
              <button
                onClick={testAPI}
                className="w-full px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors text-sm"
              >
                🧪 Test BFL API Connection
              </button>

              <button
                onClick={async () => {
                  try {
                    console.log('🔍 Testing Firebase Storage...')
                    const response = await fetch('/api/test-firebase-storage')
                    const result = await response.json()

                    if (result.success) {
                      console.log('✅ Firebase Storage test successful:', result)
                      alert('✅ Firebase Storage is working correctly!')
                    } else {
                      console.error('❌ Firebase Storage test failed:', result)
                      alert(`❌ Firebase Storage test failed: ${result.error}`)
                    }
                  } catch (error) {
                    console.error('❌ Firebase Storage test error:', error)
                    alert('❌ Firebase Storage test failed - check console for details')
                  }
                }}
                className="w-full px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition-colors text-sm"
              >
                🔥 Test Firebase Storage
              </button>
            </div>

            {/* Clear Chat Button */}
            {onClearChat && messages.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear all chat messages? This action cannot be undone.')) {
                      onClearChat()
                    }
                  }}
                  className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors text-sm"
                >
                  🗑️ Clear Chat History
                </button>
              </div>
            )}
          </div>
        )}

        {/* Uploaded Image Preview */}
        {uploadedImage && (
          <div className="mb-4 p-3 bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="flex items-center gap-3">
              <SafeImage
                src={uploadedImage}
                alt="Uploaded reference"
                width={48}
                height={48}
                className="w-12 h-12 object-cover rounded-lg"
                fallbackText="Upload preview unavailable"
              />
              <div className="flex-1">
                <p className="text-sm text-gray-300">Reference image uploaded</p>
                <p className="text-xs text-gray-500">This will be used as context for generation</p>
              </div>
              <button
                onClick={() => setUploadedImage(null)}
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  isEditMode
                    ? "Describe how you want to modify the selected image..."
                    : "Describe the image you want to create..."
                }
                className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#6C3BFF] focus:border-transparent resize-none"
                rows={3}
                disabled={isGenerating}
              />
            </div>
            
            <div className="flex flex-col gap-2">
              {/* Upload Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"
                title="Upload reference image"
              >
                <Upload className="w-5 h-5 text-gray-300" />
              </button>

              {/* Prompt Enhancer */}
              <button
                type="button"
                onClick={() => setShowPromptEnhancer(true)}
                className="p-3 bg-purple-600/20 hover:bg-purple-600/30 rounded-xl transition-colors"
                title="Enhance prompt with AI"
              >
                <Wand2 className="w-5 h-5 text-purple-400" />
              </button>

              {/* Settings */}
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className={`p-3 rounded-xl transition-colors ${
                  showSettings 
                    ? 'bg-[#6C3BFF] text-white' 
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
                title="Generation settings"
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!prompt.trim() || isGenerating}
                className="p-3 bg-[#6C3BFF] hover:bg-[#5A2FD9] disabled:bg-gray-700 disabled:text-gray-500 rounded-xl transition-colors"
              >
                {isGenerating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </form>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Prompt Enhancer Modal */}
      {showPromptEnhancer && (
        <PromptEnhancer
          initialPrompt={prompt}
          onEnhance={handleEnhancedPrompt}
          onClose={() => setShowPromptEnhancer(false)}
        />
      )}
    </div>
  )
}
