'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Category, GeneratedSet } from '../page'
import { ArrowLeft, Download, Sparkles, Clock, CheckCircle } from 'lucide-react'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { downloadAndStoreImage } from '@/lib/firebaseStorage'
import Image from 'next/image'

interface GenerationResultsProps {
  category: Category
  uploadedImage: string
  userPrompt: string
  selectedModel: string
  jewelryType: string
  dimensions: string
  modelImage: string | null
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

const JEWELRY_GENERATION_STEPS: Omit<GenerationStep, 'status' | 'imageUrl' | 'prompt'>[] = [
  {
    id: '1',
    type: 'classic',
    title: 'Model - Classic Elegance',
    description: 'Professional model wearing the jewelry with elegant pose and studio lighting'
  },
  {
    id: '2',
    type: 'profile',
    title: 'Model - Profile Showcase',
    description: 'Side profile view of model highlighting jewelry details and craftsmanship'
  },
  {
    id: '3',
    type: 'lifestyle',
    title: 'Model - Lifestyle Portrait',
    description: 'Natural lifestyle shot with model in beautiful setting wearing the jewelry'
  },
  {
    id: '4',
    type: 'festive',
    title: 'Product - Clean Studio',
    description: 'Professional product photography with clean background and perfect lighting'
  },
  {
    id: '5',
    type: 'artistic',
    title: 'Product - Artistic Detail',
    description: 'Dramatic close-up product shot with artistic lighting and composition'
  }
]

const FASHION_GENERATION_STEPS: Omit<GenerationStep, 'status' | 'imageUrl' | 'prompt'>[] = [
  {
    id: '1',
    type: 'classic',
    title: 'Model - Fashion Portrait',
    description: 'Professional model wearing/using the fashion item with elegant styling'
  },
  {
    id: '2',
    type: 'profile',
    title: 'Model - Style Showcase',
    description: 'Dynamic pose showcasing the fashion item in action or detailed view'
  },
  {
    id: '3',
    type: 'lifestyle',
    title: 'Model - Lifestyle Scene',
    description: 'Natural lifestyle shot with model in real-world setting using the fashion item'
  },
  {
    id: '4',
    type: 'festive',
    title: 'Product - Cinematic Studio',
    description: 'High-end cinematic product photography with dramatic lighting and composition'
  },
  {
    id: '5',
    type: 'artistic',
    title: 'Product - Editorial Style',
    description: 'Editorial fashion photography with artistic styling and premium presentation'
  }
]

export default function GenerationResults({
  category,
  uploadedImage,
  userPrompt,
  selectedModel,
  jewelryType,
  dimensions,
  modelImage,
  isGenerating,
  onGenerationComplete,
  onBack
}: GenerationResultsProps) {
  // Get appropriate generation steps based on category
  const isJewelry = category.id === 'jewelry'
  const generationSteps = isJewelry ? JEWELRY_GENERATION_STEPS : FASHION_GENERATION_STEPS

  const [steps, setSteps] = useState<GenerationStep[]>(
    generationSteps.map(step => ({ ...step, status: 'pending' }))
  )
  const [currentProcessingStep, setCurrentProcessingStep] = useState(0)
  const [allComplete, setAllComplete] = useState(false)

  // Photography Style Configuration
  const MODEL_PHOTOGRAPHY_STYLES = useMemo(() => ({
    studio_portrait: {
      id: 'studio_portrait',
      name: 'Studio Portrait',
      angle: 'front-facing portrait',
      prompt_template: `Model wearing {item} identical to reference image, natural pose, studio lighting, {description}, exact product match`
    },
    lifestyle_candid: {
      id: 'lifestyle_candid',
      name: 'Lifestyle Candid',
      angle: 'three-quarter angle',
      prompt_template: `Model wearing {item} identical to reference image, natural setting, {description}, lifestyle photo, exact product match`
    },
    artistic_profile: {
      id: 'artistic_profile',
      name: 'Artistic Profile',
      angle: 'side profile',
      prompt_template: `Model wearing {item} identical to reference image, side view, {description}, fashion photo, exact product match`
    }
  }), [])

  const PRODUCT_PHOTOGRAPHY_STYLES = useMemo(() => ({
    professional_showcase: {
      id: 'professional_showcase',
      name: 'Professional Showcase',
      prompt_template: `Product photography, {description}, clean background, no model`
    },
    creative_display: {
      id: 'creative_display',
      name: 'Creative Display',
      prompt_template: `Product photo, {description}, artistic background, no model`
    },
    minimalist_hero: {
      id: 'minimalist_hero',
      name: 'Minimalist Hero',
      prompt_template: `Product photo, {description}, simple background, no model`
    }
  }), [])

  const BRAND_AESTHETICS = useMemo(() => ({
    luxury: {
      id: 'luxury',
      descriptor: 'luxury',
      lighting: 'soft lighting',
      background: 'elegant background',
      mood: 'refined',
      quality: 'premium'
    },
    casual: {
      id: 'casual',
      descriptor: 'casual',
      lighting: 'natural lighting',
      background: 'modern background',
      mood: 'friendly',
      quality: 'authentic'
    }
  }), [])

  const CATEGORY_ENHANCEMENTS = useMemo(() => ({
    jewelry: {
      model_addition: ', jewelry detail, close-up shot, elegant styling',
      product_addition: ', jewelry detail, premium presentation'
    },
    fashion: {
      model_addition: ', fashion styling, full body pose, natural wear',
      product_addition: ', fabric detail, clean presentation'
    },
    shoes: {
      model_addition: ', footwear styling, full body pose, natural walking stance',
      product_addition: ', shoe detail, professional showcase'
    },
    accessories: {
      model_addition: ', accessory styling, natural pose, lifestyle integration',
      product_addition: ', accessory detail, elegant display'
    }
  }), [])

  const generatePrompts = useCallback((itemData: {
    description: string
    itemType: string
    category: string
    brandAesthetic: 'luxury' | 'casual'
  }, hasModelImage = false) => {
    const { description, itemType, brandAesthetic = 'luxury' } = itemData
    const prompts: any[] = []

    if (hasModelImage) {
      Object.values(MODEL_PHOTOGRAPHY_STYLES).forEach(style => {
        const prompt = style.prompt_template
          .replace('{description}', description)
          .replace('{item}', itemType)
        prompts.push({
          type: 'model',
          style: style.id,
          angle: style.angle,
          prompt: `${prompt}, ${BRAND_AESTHETICS[brandAesthetic].lighting}, ${BRAND_AESTHETICS[brandAesthetic].background}, professional photo`,
          metadata: {
            category: 'model_photography',
            style_name: style.name,
            brand: brandAesthetic
          }
        })
      })
    }

    Object.values(PRODUCT_PHOTOGRAPHY_STYLES).forEach(style => {
      const prompt = style.prompt_template
        .replace('{description}', description)
      prompts.push({
        type: 'product',
        style: style.id,
        prompt: `${prompt}, ${BRAND_AESTHETICS[brandAesthetic].lighting}, ${BRAND_AESTHETICS[brandAesthetic].background}, no human models, professional photo`,
        metadata: {
          category: 'product_photography',
          style_name: style.name,
          brand: brandAesthetic
        }
      })
    })

    return prompts
  }, [BRAND_AESTHETICS, MODEL_PHOTOGRAPHY_STYLES, PRODUCT_PHOTOGRAPHY_STYLES])

  const generateBackendPrompt = useCallback((userPrompt: string, type: GenerationStep['type']): string => {
    const isJewelry = category.id === 'jewelry'
    const dimensionInfo = dimensions ? ` (${dimensions})` : ''
    
    // Determine if this is a model shot or product shot
    const isModelShot = ['classic', 'profile', 'lifestyle'].includes(type)
    
    // Create item data for prompt generation
    const itemData = {
      description: userPrompt.trim(),
      itemType: jewelryType,
      category: category.id,
      brandAesthetic: 'luxury' as const // Default to luxury, can be made configurable
    }

    // Generate prompts using the new system
    const generatedPrompts = generatePrompts(itemData, !!modelImage)
    
    // Add category-specific enhancements
    const enhancedPrompts = generatedPrompts.map(promptObj => {
      const enhancement = CATEGORY_ENHANCEMENTS[category.id as keyof typeof CATEGORY_ENHANCEMENTS]
      if (enhancement) {
        const addition = promptObj.type === 'model' ? enhancement.model_addition : enhancement.product_addition
        promptObj.prompt += addition
      }
      return promptObj
    })

    // Select the appropriate prompt based on shot type
    let selectedPrompt
    if (isModelShot) {
      // For model shots, select from the first 3 prompts (model photography styles)
      const modelPrompts = enhancedPrompts.filter(p => p.type === 'model')
      if (type === 'classic') selectedPrompt = modelPrompts[0]
      else if (type === 'profile') selectedPrompt = modelPrompts[1]
      else if (type === 'lifestyle') selectedPrompt = modelPrompts[2]
    } else {
      // For product shots, select from the last 3 prompts (product photography styles)
      const productPrompts = enhancedPrompts.filter(p => p.type === 'product')
      if (type === 'festive') selectedPrompt = productPrompts[0]
      else if (type === 'artistic') selectedPrompt = productPrompts[1]
    }

    // If no specific prompt found, use the first available
    if (!selectedPrompt) {
      selectedPrompt = enhancedPrompts[0]
    }

    // Build the final prompt with technical specifications
    const modelReference = modelImage ? (
      isJewelry
        ? '\n- Use model reference for styling'
        : `\n- Use model reference for styling`
    ) : ''

    const technicalSpecs = `
TECHNICAL SPECIFICATIONS:
- High resolution photo
- Focus on ${isJewelry ? 'jewelry' : 'fashion item'} details
- Accurate colors
- Professional lighting${modelReference}`

    // Build the final comprehensive prompt
    const finalPrompt = `${technicalSpecs}

${selectedPrompt.prompt}

REQUIREMENTS:
- ${isJewelry ? 'Jewelry' : 'Fashion item'} must match reference image EXACTLY
- Product identity, colors, materials, and design must be identical to uploaded image
- Professional photo quality
- ${isModelShot ? 'Model wears item naturally with full body pose for shoes/bags, close-up for jewelry' : 'NO HUMAN MODEL - Product only'}
- ${dimensionInfo ? `Dimensions: ${dimensionInfo}` : ''}
- Style: ${selectedPrompt.metadata.style_name}
- CRITICAL: Maintain exact product identity from reference image`

    return finalPrompt
  }, [category.id, dimensions, jewelryType, modelImage, CATEGORY_ENHANCEMENTS, generatePrompts])

  // Generate images one by one with proper queue management
  useEffect(() => {
    if (!isGenerating) return

    let isCancelled = false

    const generateImagesSequentially = async () => {
      try {
        console.log('🎨 Starting sequential jewelry generation...')

        // Mark all steps as pending initially
        setSteps(prev => prev.map(step => ({ ...step, status: 'pending' })))

        // Track successful generations for saving
        const successfulGenerations: Array<{
          id: string
          url: string
          prompt: string
          type: 'classic' | 'profile' | 'festive' | 'lifestyle' | 'artistic'
          description: string
        }> = []

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

            // Determine if this is a model shot that needs the model reference
            const isModelShot = ['classic', 'profile', 'lifestyle'].includes(step.type)

            // Prepare API request body
            interface APIRequestBody {
              prompt: string
              input_image: string
              aspect_ratio: string
              output_format: string
              prompt_upsampling: boolean
              safety_tolerance: number
              model_reference_image?: string
            }

            const requestBody: APIRequestBody = {
              prompt: backendPrompt,
              input_image: uploadedImage,
              aspect_ratio: '1:1',
              output_format: 'png',
              prompt_upsampling: true,
              safety_tolerance: 2
            }

            // Add model reference image for model shots if available
            if (isModelShot && modelImage) {
              requestBody.model_reference_image = modelImage
              console.log(`📸 Including model reference image for ${step.type} shot`)
            }

            console.log(`📡 API request for ${step.type}:`, {
              hasPrompt: !!requestBody.prompt,
              hasInputImage: !!requestBody.input_image,
              hasModelReference: !!requestBody.model_reference_image,
              isModelShot
            })

            // Make API call for this single image
            const response = await fetch(apiEndpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestBody),
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

            // Store the generated image in Firebase Storage
            console.log(`📤 Storing generated image in Firebase Storage: ${step.type}`)
            const storageResult = await downloadAndStoreImage(
              imageUrl,
              `${category.id}-${step.type}-${Date.now()}.jpg`,
              'generated-images'
            )

            let finalImageUrl = imageUrl
            if (storageResult.success) {
              console.log(`✅ Image stored in Firebase Storage: ${storageResult.url}`)
              // Use the Firebase Storage URL instead of the original bfl.ai URL
              finalImageUrl = storageResult.url!
            } else {
              console.warn(`⚠️ Failed to store image in Firebase Storage: ${storageResult.error}`)
              // Continue with the original URL if storage fails
            }

            // Add to successful generations for saving
            successfulGenerations.push({
              id: step.id,
              url: finalImageUrl,
              prompt: backendPrompt,
              type: step.type,
              description: step.description
            })

            // Mark step as complete
            if (!isCancelled) {
              setSteps(prev => prev.map((s, index) =>
                index === i ? {
                  ...s,
                  status: 'complete',
                  imageUrl: finalImageUrl,
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

          // Save to Firestore - use tracked successful generations
          try {
            console.log(`💾 Saving to Firestore: ${successfulGenerations.length} successful generations`)
            console.log('🔥 Testing Firestore connection...')

            if (successfulGenerations.length > 0) {
              const generatedSet: Omit<GeneratedSet, 'id'> = {
                category: category.id,
                originalImage: uploadedImage,
                userPrompt,
                itemType: jewelryType,
                dimensions,
                modelImage: modelImage || undefined,
                generatedImages: successfulGenerations,
                model: selectedModel,
                timestamp: new Date(),
                storedInFirebase: true
              }

              console.log('📝 Saving generated set to Firestore:', {
                category: generatedSet.category,
                userPrompt: generatedSet.userPrompt.substring(0, 50) + '...',
                itemType: generatedSet.itemType,
                dimensions: generatedSet.dimensions,
                hasModelImage: !!generatedSet.modelImage,
                imageCount: generatedSet.generatedImages.length,
                model: generatedSet.model
              })

              const docRef = await addDoc(collection(db, 'generatedSets'), generatedSet)
              console.log(`✅ Generated set saved to Firestore: ${docRef.id} (${successfulGenerations.length}/${steps.length} images)`)

              onGenerationComplete({ ...generatedSet, id: docRef.id })
            } else {
              console.warn('⚠️ No successful generations to save - all API calls failed')
              // Still call onGenerationComplete to update UI state
              onGenerationComplete({
                id: 'failed-generation',
                category: category.id,
                originalImage: uploadedImage,
                userPrompt,
                itemType: jewelryType,
                dimensions,
                modelImage: modelImage || undefined,
                generatedImages: [],
                model: selectedModel,
                timestamp: new Date(),
                storedInFirebase: false
              })
            }
          } catch (error) {
            console.error('❌ Error saving to Firestore:', error)
            console.error('❌ Error details:', {
              message: error instanceof Error ? error.message : 'Unknown error',
              stack: error instanceof Error ? error.stack : undefined
            })
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
  }, [isGenerating, category.id, uploadedImage, userPrompt, selectedModel, onGenerationComplete, dimensions, jewelryType, modelImage, steps, generateBackendPrompt])

  const downloadImage = async (imageUrl: string, filename: string) => {
    try {
      console.log('🔄 Downloading image:', imageUrl)
      
      let response: Response
      
      // Check if it's a Firebase Storage URL (no CORS issues) or bfl.ai URL (needs proxy)
      if (imageUrl.includes('firebasestorage.googleapis.com')) {
        // Direct download for Firebase Storage URLs
        response = await fetch(imageUrl)
      } else {
        // Use our proxy API to avoid CORS issues with bfl.ai
        const proxyUrl = `/api/download-image?url=${encodeURIComponent(imageUrl)}&filename=${encodeURIComponent(filename)}`
        response = await fetch(proxyUrl)
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
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
      
      console.log('✅ Successfully downloaded:', filename)
    } catch (error) {
      console.error('❌ Download failed:', error)
      // Show user-friendly error message
      alert(`Failed to download ${filename}. Please try again.`)
    }
  }

  const downloadAll = async () => {
    const imagesToDownload = steps.filter(step => step.imageUrl)
    
    if (imagesToDownload.length === 0) {
      alert('No images available to download.')
      return
    }
    
    console.log(`🔄 Starting download of ${imagesToDownload.length} images...`)
    
    // Download images sequentially to avoid overwhelming the server
    for (let i = 0; i < imagesToDownload.length; i++) {
      const step = imagesToDownload[i]
      const filename = `${category.id}-${step.type}-${i + 1}.jpg`
      
      try {
        await downloadImage(step.imageUrl!, filename)
        // Small delay between downloads
        if (i < imagesToDownload.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      } catch (error) {
        console.error(`❌ Failed to download ${filename}:`, error)
        // Continue with other downloads even if one fails
      }
    }
    
    console.log('✅ Download process completed')
  }

  const testPrompts = () => {
    console.log('🧪 TESTING PROMPT GENERATION')
    console.log('='.repeat(50))
    
    // Create item data for prompt generation
    const itemData = {
      description: userPrompt.trim(),
      itemType: jewelryType,
      category: category.id,
      brandAesthetic: 'luxury' as const
    }

    console.log('📋 Input Parameters:')
    console.log('- Category:', category.id)
    console.log('- Item Type:', jewelryType)
    console.log('- User Prompt:', userPrompt)
    console.log('- Dimensions:', dimensions)
    console.log('- Model Image:', modelImage ? 'Provided' : 'Not provided')
    console.log('- Selected Model:', selectedModel)
    console.log('- Brand Aesthetic:', itemData.brandAesthetic)

    // Generate prompts using the new system
    const generatedPrompts = generatePrompts(itemData, !!modelImage)
    
    // Add category-specific enhancements
    const enhancedPrompts = generatedPrompts.map(promptObj => {
      const enhancement = CATEGORY_ENHANCEMENTS[category.id as keyof typeof CATEGORY_ENHANCEMENTS]
      if (enhancement) {
        const addition = promptObj.type === 'model' ? enhancement.model_addition : enhancement.product_addition
        promptObj.prompt += addition
      }
      return promptObj
    })

    console.log('\n🎨 Generated Prompts:')
    console.log('='.repeat(50))

    // Show each step and its corresponding prompt
    steps.forEach((step, index) => {
      const isModelShot = ['classic', 'profile', 'lifestyle'].includes(step.type)
      
      let selectedPrompt
      if (isModelShot) {
        const modelPrompts = enhancedPrompts.filter(p => p.type === 'model')
        if (step.type === 'classic') selectedPrompt = modelPrompts[0]
        else if (step.type === 'profile') selectedPrompt = modelPrompts[1]
        else if (step.type === 'lifestyle') selectedPrompt = modelPrompts[2]
      } else {
        const productPrompts = enhancedPrompts.filter(p => p.type === 'product')
        if (step.type === 'festive') selectedPrompt = productPrompts[0]
        else if (step.type === 'artistic') selectedPrompt = productPrompts[1]
      }

      if (!selectedPrompt) {
        selectedPrompt = enhancedPrompts[0]
      }

      // Generate the final prompt with technical specifications
      const isJewelry = category.id === 'jewelry'
      const dimensionInfo = dimensions ? ` (${dimensions})` : ''
      
      const modelReference = modelImage ? (
        isJewelry
          ? '\n- Use model reference for styling'
          : `\n- Use model reference for styling`
      ) : ''

      const technicalSpecs = `
TECHNICAL SPECIFICATIONS:
- High resolution photo
- Focus on ${isJewelry ? 'jewelry' : 'fashion item'} details
- Accurate colors
- Professional lighting${modelReference}`

      const finalPrompt = `${technicalSpecs}

${selectedPrompt.prompt}

REQUIREMENTS:
- ${isJewelry ? 'Jewelry' : 'Fashion item'} must match reference image EXACTLY
- Product identity, colors, materials, and design must be identical to uploaded image
- Professional photo quality
- ${isModelShot ? 'Model wears item naturally with full body pose for shoes/bags, close-up for jewelry' : 'NO HUMAN MODEL - Product only'}
- ${dimensionInfo ? `Dimensions: ${dimensionInfo}` : ''}
- Style: ${selectedPrompt.metadata.style_name}
- CRITICAL: Maintain exact product identity from reference image`

      console.log(`\n📸 Step ${index + 1}: ${step.title}`)
      console.log(`Type: ${step.type} (${isModelShot ? 'Model Shot' : 'Product Shot'})`)
      console.log(`Style: ${selectedPrompt.metadata.style_name}`)
      console.log(`Category Enhancement: ${CATEGORY_ENHANCEMENTS[category.id as keyof typeof CATEGORY_ENHANCEMENTS] ? 'Applied' : 'Standard'}`)
      console.log('\n🔤 PROMPT:')
      console.log(finalPrompt)
      console.log('\n' + '='.repeat(50))
    })

    console.log('\n✅ Prompt testing completed! Check the console above for all 5 prompts.')
    alert('Prompt testing completed! Check the browser console to see all 5 generated prompts.')
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

        {/* Test Prompt Button - Always visible */}
        <button
          onClick={testPrompts}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          Test Prompt
        </button>
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
                <Image
                  src={step.imageUrl}
                  alt={step.title}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
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
          <Image
            src={uploadedImage}
            alt="Original jewelry"
            width={128}
            height={128}
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
