'use client'

import React, { useState, useEffect } from 'react'
import { Category, GeneratedSet } from '../page'
import { ArrowLeft, Download, Sparkles, Clock, CheckCircle } from 'lucide-react'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface GenerationResultsProps {
  category: Category
  uploadedImage: string
  userPrompt: string
  selectedModel: string
  isGenerating: boolean
  onGenerationComplete: (generatedSet: GeneratedSet) => void
  onBack: () => void
}

// Removed unused ApiResult interface

interface GenerationStep {
  id: string
  type: 'classic' | 'profile' | 'festive' | 'lifestyle' | 'artistic'
  title: string
  description: string
  status: 'pending' | 'generating' | 'complete' | 'error'
  imageUrl?: string
  prompt?: string
}

const GENERATION_STEPS: Omit<GenerationStep, 'status' | 'imageUrl' | 'prompt'>[] = [
  {
    id: '1',
    type: 'classic',
    title: 'Classic Product Showcase',
    description: 'Professional studio shot with clean background and perfect lighting'
  },
  {
    id: '2',
    type: 'profile',
    title: 'Profile Detail View',
    description: 'Side angle showcasing the jewelry\'s profile and intricate details'
  },
  {
    id: '3',
    type: 'festive',
    title: 'Festive Context',
    description: 'Traditional setting with warm lighting and cultural ambiance'
  },
  {
    id: '4',
    type: 'lifestyle',
    title: 'Lifestyle Shot',
    description: 'Natural, candid pose in beautiful outdoor or elegant indoor setting'
  },
  {
    id: '5',
    type: 'artistic',
    title: 'Artistic Detail',
    description: 'Dramatic close-up with artistic lighting and shallow depth of field'
  }
]

export default function GenerationResults({
  category,
  uploadedImage,
  userPrompt,
  selectedModel,
  isGenerating,
  onGenerationComplete,
  onBack
}: GenerationResultsProps) {
  const [steps, setSteps] = useState<GenerationStep[]>(
    GENERATION_STEPS.map(step => ({ ...step, status: 'pending' }))
  )
  const [currentProcessingStep, setCurrentProcessingStep] = useState(0)
  const [allComplete, setAllComplete] = useState(false)

  // Generate backend prompts for each shot type
  const generateBackendPrompt = (userPrompt: string, type: GenerationStep['type']): string => {
    const baseInstruction = `Using the provided image of the jewelry, generate a photorealistic image of a beautiful Indian model wearing this exact piece of jewelry. The jewelry in the generated image must be an identical, high-fidelity match to the one in the reference photo, capturing all its specific details, materials, and colors (${userPrompt}).`

    const shotInstructions = {
      classic: `
Model & Pose: Model with an elegant, neutral expression, looking directly at the camera. Her hair is tied back in a neat bun to fully expose the jewelry.
Camera Angle & Shot: A clean, close-up shot focusing on the face and jewelry.
Lighting: Bright, even, professional studio lighting that minimizes shadows and highlights the jewelry's details.
Background & Setting: A solid, neutral-colored studio background (light grey or beige).
Overall Mood: Clean, professional, e-commerce.`,

      profile: `
Model & Pose: Model in a three-quarter or full profile view, looking away from the camera to showcase the jewelry's side profile and how it hangs. A gentle, serene expression.
Camera Angle & Shot: Medium close-up, focusing on the side of the head, jawline, and neck.
Lighting: Soft, diffused side-lighting to create gentle depth and dimension on the face and jewelry.
Background & Setting: A soft, out-of-focus background with a hint of texture.
Overall Mood: Elegant, graceful, detailed.`,

      festive: `
Model & Pose: Model smiling warmly, as if at a wedding or festival. She is dressed in a traditional, richly colored silk saree (e.g., deep green or maroon) that complements the jewelry.
Camera Angle & Shot: A medium shot that includes her shoulders and neckline, showing how the jewelry pairs with an outfit.
Lighting: Warm, golden hour lighting, mimicking the ambiance of an evening celebration.
Background & Setting: A beautifully decorated, out-of-focus background with bokeh lights or floral decorations.
Overall Mood: Festive, celebratory, traditional, vibrant.`,

      lifestyle: `
Model & Pose: Model in a natural, candid pose, perhaps laughing or tucking a strand of hair behind her ear. The pose should create a sense of movement and authenticity.
Camera Angle & Shot: A slightly angled, lifestyle shot that feels spontaneous.
Lighting: Bright, natural daylight, as if taken outdoors in a beautiful garden or on an elegant balcony.
Background & Setting: A soft-focus natural environment with greenery.
Overall Mood: Natural, authentic, effortless, beautiful.`,

      artistic: `
Model & Pose: A dramatic pose where the model's hand is gently touching her face or neck near the jewelry, drawing attention to it.
Camera Angle & Shot: An artistic macro shot, extremely close-up on the jewelry itself, with parts of the model's face and skin providing context. Shallow depth of field.
Lighting: Dramatic, high-contrast lighting that makes the stones and metals glint and sparkle.
Background & Setting: A dark, minimalist background to make the jewelry pop.
Overall Mood: Luxurious, artistic, dramatic, high-fashion.`
    }

    return `${baseInstruction}

The composition for this shot should be:
${shotInstructions[type]}

Critical Rules:
- The jewelry must be the absolute hero of the image.
- The final output must be hyper-realistic, suitable for a high-end e-commerce catalog.
- Avoid any digital or AI-generated artifacts.`
  }

  // Generate images one by one with proper queue management
  useEffect(() => {
    if (!isGenerating) return

    let isCancelled = false

    const generateImagesSequentially = async () => {
      try {
        console.log('🎨 Starting sequential jewelry generation...')

        // Mark all steps as pending initially
        setSteps(prev => prev.map(step => ({ ...step, status: 'pending' })))

        // Process each image one by one
        for (let i = 0; i < steps.length; i++) {
          if (isCancelled) break

          const step = steps[i]
          console.log(`🚀 Processing step ${i + 1}/${steps.length}: ${step.type}`)

          // Update current processing step
          setCurrentProcessingStep(i)

          // Mark current step as generating
          setSteps(prev => prev.map((s, index) =>
            index === i ? { ...s, status: 'generating' } : s
          ))

          try {
            // Generate the backend prompt for this specific shot
            const backendPrompt = generateBackendPrompt(userPrompt, step.type)

            // Determine API endpoint
            const apiEndpoint = selectedModel === 'flux-kontext-max'
              ? '/api/flux-kontext-max'
              : '/api/flux-kontext-pro'

            console.log(`📡 Calling ${apiEndpoint} for ${step.type}`)

            // Make API call for this single image
            const response = await fetch(apiEndpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                prompt: backendPrompt,
                input_image: uploadedImage,
                aspect_ratio: '1:1',
                output_format: 'png',
                prompt_upsampling: true,
                safety_tolerance: 2
              }),
            })

            if (!response.ok) {
              const errorData = await response.text()
              throw new Error(`API error: ${response.status} - ${errorData}`)
            }

            const data = await response.json()

            if (!data.success) {
              throw new Error(data.error || 'Generation failed')
            }

            const imageUrl = data.imageUrl || data.result?.sample

            if (!imageUrl) {
              throw new Error('No image URL in response')
            }

            console.log(`✅ Successfully generated ${step.type}`)

            // Mark step as complete
            if (!isCancelled) {
              setSteps(prev => prev.map((s, index) =>
                index === i ? {
                  ...s,
                  status: 'complete',
                  imageUrl: imageUrl,
                  prompt: backendPrompt
                } : s
              ))
            }

            // Add delay between requests to avoid rate limiting
            if (i < steps.length - 1) {
              console.log('⏳ Waiting 3 seconds before next request...')
              await new Promise(resolve => setTimeout(resolve, 3000))
            }

          } catch (error) {
            console.error(`❌ Error generating ${step.type}:`, error)

            // Mark step as error (not complete)
            if (!isCancelled) {
              setSteps(prev => prev.map((s, index) =>
                index === i ? {
                  ...s,
                  status: 'error',
                  prompt: generateBackendPrompt(userPrompt, step.type)
                } : s
              ))
            }

            console.log(`❌ Failed to generate ${step.type}`)
          }
        }

        if (!isCancelled) {
          // All steps complete
          setAllComplete(true)
          console.log('🎉 All images generated successfully!')

          // Save to Firestore - only save successful generations
          try {
            // Filter out failed generations - only save steps with actual image URLs
            const successfulSteps = steps.filter(step =>
              step.status === 'complete' && step.imageUrl && !step.imageUrl.includes('picsum.photos')
            )

            if (successfulSteps.length > 0) {
              const generatedSet: Omit<GeneratedSet, 'id'> = {
                category: category.id,
                originalImage: uploadedImage,
                userPrompt,
                generatedImages: successfulSteps.map(step => ({
                  id: step.id,
                  url: step.imageUrl!,
                  prompt: step.prompt || generateBackendPrompt(userPrompt, step.type),
                  type: step.type,
                  description: step.description
                })),
                model: selectedModel,
                timestamp: new Date(),
                storedInFirebase: true
              }

              const docRef = await addDoc(collection(db, 'generatedSets'), generatedSet)
              console.log(`✅ Generated set saved to Firestore: ${docRef.id} (${successfulSteps.length}/${steps.length} images)`)

              onGenerationComplete({ ...generatedSet, id: docRef.id })
            } else {
              console.warn('⚠️ No successful generations to save - all API calls failed')
              // Still call onGenerationComplete to update UI state
              onGenerationComplete({
                id: 'failed-generation',
                category: category.id,
                originalImage: uploadedImage,
                userPrompt,
                generatedImages: [],
                model: selectedModel,
                timestamp: new Date(),
                storedInFirebase: false
              })
            }
          } catch (error) {
            console.error('❌ Error saving to Firestore:', error)
          }
        }

      } catch (error) {
        console.error('❌ Error in sequential generation:', error)

        if (!isCancelled) {
          // Mark all remaining steps as error (don't use placeholders)
          setSteps(prev => prev.map((step) => ({
            ...step,
            status: step.status === 'complete' ? 'complete' : 'error',
            prompt: step.prompt || generateBackendPrompt(userPrompt, step.type)
          })))

          setAllComplete(true)
          console.log('❌ Generation completed with errors')
        }
      }
    }

    generateImagesSequentially()

    // Cleanup function to cancel generation if component unmounts
    return () => {
      isCancelled = true
    }
  }, [isGenerating, category.id, uploadedImage, userPrompt, selectedModel])

  const downloadImage = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const downloadAll = () => {
    steps.forEach((step, index) => {
      if (step.imageUrl) {
        setTimeout(() => {
          downloadImage(step.imageUrl!, `jewelry-${step.type}-${index + 1}.jpg`)
        }, index * 500)
      }
    })
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Generating Your Photos</h1>
            <p className="text-gray-400">
              Creating 5 professional photos with different angles and styles
            </p>
          </div>
        </div>

        {allComplete && (
          <button
            onClick={downloadAll}
            className="flex items-center gap-2 px-4 py-2 bg-[#6C3BFF] hover:bg-[#5A2FE6] text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Download All
          </button>
        )}
      </div>

      {/* Progress Overview */}
      <div className="mb-8 p-6 bg-gray-800/50 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">Generation Progress</h3>
          <span className="text-sm text-gray-400">
            {steps.filter(s => s.status === 'complete').length} of {steps.length} complete
          </span>
        </div>

        <div className="flex gap-2 mb-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex-1 h-2 rounded-full transition-all ${
                step.status === 'complete' ? 'bg-green-500' :
                step.status === 'generating' ? 'bg-[#6C3BFF] animate-pulse' :
                step.status === 'error' ? 'bg-red-500' :
                'bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Queue Status */}
        {isGenerating && !allComplete && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#6C3BFF]/20 border border-[#6C3BFF]/30 rounded-lg">
              <div className="w-4 h-4 border-2 border-[#6C3BFF] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-[#6C3BFF] text-sm font-medium">
                Processing {steps[currentProcessingStep]?.title || 'image'}... ({currentProcessingStep + 1}/{steps.length})
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Images are generated one at a time to ensure quality and avoid rate limits
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Estimated time remaining: {Math.max(0, (steps.length - currentProcessingStep - 1) * 30)} seconds
            </p>
          </div>
        )}
      </div>

      {/* Generation Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`p-6 rounded-xl border transition-all ${
              step.status === 'generating' ? 'border-[#6C3BFF] bg-[#6C3BFF]/5' :
              step.status === 'complete' ? 'border-green-500/30 bg-green-500/5' :
              step.status === 'error' ? 'border-red-500/30 bg-red-500/5' :
              'border-gray-700 bg-gray-800/30'
            }`}
          >
            {/* Status Icon */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-400">#{index + 1}</span>
              {step.status === 'generating' && (
                <div className="w-5 h-5 border-2 border-[#6C3BFF] border-t-transparent rounded-full animate-spin" />
              )}
              {step.status === 'complete' && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              {step.status === 'error' && (
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✕</span>
                </div>
              )}
              {step.status === 'pending' && (
                <Clock className="w-5 h-5 text-gray-500" />
              )}
            </div>

            {/* Image */}
            <div className="mb-4">
              {step.imageUrl ? (
                <img
                  src={step.imageUrl}
                  alt={step.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-48 bg-gray-700/50 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-gray-500" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-2">
              <h4 className="font-semibold text-white">{step.title}</h4>
              <p className="text-sm text-gray-400">{step.description}</p>
              
              {step.status === 'complete' && step.imageUrl && (
                <button
                  onClick={() => downloadImage(step.imageUrl!, `jewelry-${step.type}.jpg`)}
                  className="w-full mt-3 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                >
                  Download
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Original Image Reference */}
      <div className="mt-8 p-6 bg-gray-800/30 border border-gray-700/50 rounded-xl">
        <h3 className="font-semibold text-white mb-4">Original Reference</h3>
        <div className="flex gap-4">
          <img
            src={uploadedImage}
            alt="Original jewelry"
            className="w-32 h-32 object-contain bg-gray-900/50 rounded-lg"
          />
          <div className="flex-1">
            <p className="text-gray-300 mb-2"><strong>Your Description:</strong></p>
            <p className="text-gray-400 text-sm">{userPrompt}</p>
            <p className="text-gray-500 text-xs mt-2">Model: {selectedModel}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
