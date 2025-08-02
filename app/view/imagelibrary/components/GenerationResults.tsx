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

  // Advanced prompt engineering for jewelry and fashion photography
  const generateBackendPrompt = (userPrompt: string, type: GenerationStep['type']): string => {

    // Get item type specific details with wearability classification
    const jewelryTypeDetails = {
      earrings: 'earrings that frame the face beautifully',
      necklaces: 'necklace that elegantly adorns the neckline',
      bracelets: 'bracelet that gracefully wraps around the wrist',
      rings: 'ring that elegantly adorns the finger',
      pendants: 'pendant that hangs beautifully from a chain',
      sets: 'jewelry set that creates a cohesive, elegant look'
    }

    // Fashion items with wearability classification
    const fashionTypeDetails = {
      handbags: {
        description: 'handbag or purse',
        wearable: false,
        carryable: true,
        positioning: 'carried elegantly by the model, positioned to showcase design and functionality'
      },
      shoes: {
        description: 'footwear',
        wearable: true,
        carryable: false,
        positioning: 'worn by the model, showcasing fit, style, and comfort in natural poses'
      },
      clothing: {
        description: 'clothing item',
        wearable: true,
        carryable: false,
        positioning: 'worn by the model, fitted perfectly to showcase design, fabric, and silhouette'
      },
      accessories: {
        description: 'fashion accessory',
        wearable: true,
        carryable: false,
        positioning: 'worn by the model as a stylish accent piece, enhancing the overall look'
      },
      activewear: {
        description: 'activewear',
        wearable: true,
        carryable: false,
        positioning: 'worn by the model in active or athletic poses, demonstrating functionality and style'
      },
      outerwear: {
        description: 'outerwear piece',
        wearable: true,
        carryable: false,
        positioning: 'worn by the model, showcasing fit, style, and layering capabilities'
      }
    }

    // Get item details and wearability info
    const jewelryDetail = jewelryTypeDetails[jewelryType as keyof typeof jewelryTypeDetails] || 'jewelry piece'
    const fashionDetail = fashionTypeDetails[jewelryType as keyof typeof fashionTypeDetails]

    const itemDetail = isJewelry ? jewelryDetail : (fashionDetail?.description || 'fashion item')
    const isWearable = isJewelry ? true : (fashionDetail?.wearable || false)
    const isCarryable = isJewelry ? false : (fashionDetail?.carryable || false)
    const itemPositioning = isJewelry ? 'worn elegantly by the model' : (fashionDetail?.positioning || 'styled with the model')

    const dimensionInfo = dimensions ? ` (${dimensions})` : ''

    // Enhanced model reference instructions for fashion
    const modelReference = modelImage ? (
      isJewelry
        ? '\n- Use the provided model reference image as inspiration for model appearance and styling'
        : `\n- CRITICAL: Use the provided model reference image as the EXACT base for the model's appearance, facial features, hair, and overall styling
- The model in the generated image must look identical to the reference model provided
- Maintain consistent facial features, hair color, hair style, skin tone, and body type
- Ensure the model's pose and expression complement the reference while showcasing the ${itemDetail}`
    ) : ''

    // Base quality and technical specifications
    const technicalSpecs = `
TECHNICAL SPECIFICATIONS:
- Ultra-high resolution, professional photography quality
- Perfect focus and sharpness on ${isJewelry ? 'jewelry' : 'fashion item'} details
- Accurate color reproduction and material representation
- Professional lighting setup with no harsh shadows
- Clean, artifact-free image generation${modelReference}`

    // Model shots (3 shots with models) - Enhanced for fashion
    const modelShots = {
      classic: `
SHOT TYPE: ${isJewelry ? 'Professional Model Portrait - Classic Elegance' : 'High-Fashion Model Photography - Editorial Portrait'}
SUBJECT: Beautiful Indian model with the ${itemDetail}${dimensionInfo} ${itemPositioning}
${isJewelry ? 'JEWELRY' : 'FASHION ITEM'} FOCUS: The ${userPrompt} must be IDENTICAL to the reference image in every detail - exact colors, materials, design elements, and proportions${modelReference}

${isJewelry ? `MODEL SPECIFICATIONS:
- Age: 22-28 years old, professional model appearance
- Ethnicity: Indian/South Asian features${modelImage ? ' (match the reference model provided)' : ''}
- Expression: Confident, elegant, slight smile
- Hair: Styled to complement and not obstruct the jewelry${modelImage ? ' (similar to reference style)' : ''}
- Makeup: Professional, enhances natural beauty without overpowering${modelImage ? ' (consistent with reference)' : ''}
- Pose: Elegant, confident posture with jewelry prominently displayed${modelImage ? ' (inspired by reference pose)' : ''}

JEWELRY STYLING:
- Display: Jewelry positioned to catch light and show craftsmanship
- Coordination: Minimal additional jewelry to avoid distraction
- Focus: Primary attention on the featured jewelry piece` : `FASHION MODEL SPECIFICATIONS:
- Age: 22-28 years old, professional fashion model appearance
- Ethnicity: Indian/South Asian features${modelImage ? ' (MUST match the reference model exactly)' : ''}
- Expression: ${isWearable ? 'Confident, fashion-forward, editorial expression' : 'Elegant, sophisticated, showcasing the accessory naturally'}
- Hair: ${modelImage ? 'EXACT same hairstyle, color, and length as reference model' : 'Professional fashion styling that complements the item'}
- Makeup: ${modelImage ? 'Identical makeup style and intensity as reference model' : 'High-fashion editorial makeup enhancing natural features'}
- Body Type: ${modelImage ? 'Same body proportions and build as reference model' : 'Professional fashion model proportions'}
- Pose: ${isWearable ? 'Fashion-forward pose showcasing how the item fits and moves' : 'Elegant pose highlighting the accessory as a statement piece'}${modelImage ? ' (maintaining reference model\'s signature poses and expressions)' : ''}

FASHION STYLING & WARDROBE:
- Primary Item: The ${itemDetail} is the HERO piece - all styling supports this
- Outfit Coordination: ${isWearable ? 'Complementary clothing that enhances but doesn\'t compete with the main item' : 'Neutral, elegant outfit that makes the accessory the focal point'}
- Color Palette: ${isWearable ? 'Colors that harmonize with the item while maintaining fashion-forward appeal' : 'Sophisticated, neutral tones that highlight the accessory'}
- Styling Approach: ${isCarryable ? 'Model carrying/holding the item naturally and confidently' : 'Item integrated seamlessly into the overall look'}
- Fashion Context: High-end editorial styling suitable for luxury fashion magazines
- Fit & Proportion: ${isWearable ? 'Perfect fit showcasing the item\'s design and functionality' : 'Proportions that emphasize the accessory\'s impact on the overall look'}`}

${isJewelry ? `CAMERA & COMPOSITION:
- Shot type: Portrait/headshot focusing on jewelry area
- Angle: Straight-on or slight 3/4 angle for optimal jewelry visibility
- Framing: Close to medium shot highlighting the jewelry
- Depth of field: Sharp focus on jewelry and model, subtle background blur

LIGHTING SETUP:
- Key light: Soft, diffused professional studio lighting
- Fill light: Gentle fill to eliminate harsh shadows
- Jewelry lighting: Specialized lighting to make metals shine and gems sparkle
- Color temperature: Neutral white (5500K) for accurate color reproduction` : `FASHION PHOTOGRAPHY SETUP:
- Shot type: ${isWearable ? 'Full body or 3/4 shot showcasing the item in context' : 'Portrait to medium shot highlighting the accessory'}
- Angle: ${isWearable ? 'Dynamic angles that show fit, movement, and style' : 'Optimal angle to showcase the accessory\'s design and impact'}
- Framing: ${isWearable ? 'Composition that shows the item\'s relationship to the body and overall outfit' : 'Framing that makes the accessory the clear focal point'}
- Depth of field: Sharp focus on the fashion item and model, professional background blur

FASHION LIGHTING:
- Key light: High-end fashion photography lighting with dramatic direction
- Fill light: Controlled fill maintaining fashion editorial aesthetic
- Accent lighting: Specialized lighting to enhance textures and materials
- Color temperature: Fashion photography standard (5500K-6500K) for editorial quality`}

${isJewelry ? `BACKGROUND & SETTING:
- Clean, professional studio background
- Color: Neutral tones (soft white, light gray, or cream)
- Texture: Smooth, non-distracting surface
- Style: High-end jewelry photography aesthetic` : `FASHION BACKGROUND & SETTING:
- Background: ${isWearable ? 'Professional fashion studio or elegant lifestyle setting' : 'Clean, sophisticated backdrop that enhances the accessory'}
- Color: ${isWearable ? 'Neutral to complementary tones that enhance the fashion item' : 'Sophisticated neutrals that make the accessory pop'}
- Texture: ${isWearable ? 'Smooth studio or textured lifestyle background as appropriate' : 'Clean, professional surface highlighting the accessory'}
- Style: High-end fashion editorial photography aesthetic`}

STYLING & WARDROBE:
- Outfit: Elegant, complementary to jewelry without competing
- Colors: Neutral or colors that enhance the jewelry
- Style: Sophisticated, timeless fashion
- Accessories: Minimal, jewelry is the hero piece`,

      profile: `
SHOT TYPE: ${isJewelry ? 'Professional Model Portrait - Profile Showcase' : 'High-Fashion Profile Photography - Style Detail'}
SUBJECT: Beautiful Indian model in profile view with the ${itemDetail}${dimensionInfo} ${itemPositioning}
${isJewelry ? 'JEWELRY' : 'FASHION ITEM'} FOCUS: The ${userPrompt} must be IDENTICAL to the reference image, showcasing side profile and design details${modelReference}

${isJewelry ? `MODEL SPECIFICATIONS:
- Age: 22-28 years old, professional model appearance
- Ethnicity: Indian/South Asian features${modelImage ? ' (match the reference model provided)' : ''}
- Expression: Serene, contemplative, looking away from camera
- Hair: Styled away from jewelry side to show full profile${modelImage ? ' (similar to reference style)' : ''}
- Makeup: Professional, emphasizing profile features${modelImage ? ' (consistent with reference)' : ''}
- Pose: Elegant profile pose showcasing jewelry silhouette${modelImage ? ' (inspired by reference pose)' : ''}` : `FASHION MODEL SPECIFICATIONS:
- Age: 22-28 years old, professional fashion model appearance
- Ethnicity: Indian/South Asian features${modelImage ? ' (MUST match the reference model exactly)' : ''}
- Expression: ${isWearable ? 'Confident, editorial profile expression' : 'Sophisticated, serene expression highlighting the accessory'}
- Hair: ${modelImage ? 'EXACT same hairstyle and color as reference model' : `Styled to ${isWearable ? 'complement the fashion item' : 'showcase the accessory clearly'}`}
- Makeup: ${modelImage ? 'Identical makeup style as reference model' : 'High-fashion profile makeup emphasizing bone structure'}
- Body Type: ${modelImage ? 'Same proportions as reference model' : 'Professional fashion model proportions'}
- Pose: ${isWearable ? 'Dynamic profile pose showing the item\'s fit and silhouette' : 'Elegant profile highlighting the accessory\'s impact'}${modelImage ? ' (maintaining reference model\'s signature style)' : ''}

FASHION STYLING & WARDROBE:
- Primary Focus: The ${itemDetail} is the HERO piece in profile view
- Outfit Coordination: ${isWearable ? 'Complementary styling that shows the item\'s profile and fit' : 'Neutral outfit that makes the accessory the clear focal point'}
- Profile Emphasis: ${isWearable ? 'Styling that showcases the item\'s silhouette and design lines' : 'Positioning that highlights the accessory\'s profile and impact'}
- Fashion Context: High-end editorial profile photography suitable for luxury magazines`}

CAMERA & COMPOSITION:
- Shot type: Profile portrait emphasizing jewelry outline
- Angle: Perfect 90-degree profile or slight 3/4 turn
- Framing: Medium close-up capturing jewelry details
- Depth of field: Sharp jewelry focus with artistic background blur

LIGHTING SETUP:
- Key light: Side lighting to create dimension and depth
- Rim light: Subtle backlighting to separate subject from background
- Jewelry accent: Specialized lighting to highlight jewelry contours
- Shadow play: Gentle shadows to add artistic depth

BACKGROUND & SETTING:
- Artistic, softly blurred background
- Color: Warm, complementary tones
- Texture: Subtle, non-competing elements
- Style: Fine art photography aesthetic

STYLING & WARDROBE:
- Outfit: Elegant neckline showcasing jewelry
- Colors: Rich, sophisticated palette
- Style: Timeless, artistic fashion
- Hair styling: Sleek, away from jewelry side`,

      lifestyle: `
SHOT TYPE: ${isJewelry ? 'Lifestyle Model Photography - Natural Beauty' : 'Fashion Lifestyle Photography - Real-World Style'}
SUBJECT: Beautiful Indian model in natural setting with the ${itemDetail}${dimensionInfo} ${itemPositioning}
${isJewelry ? 'JEWELRY' : 'FASHION ITEM'} FOCUS: The ${userPrompt} must be IDENTICAL to reference, shown in authentic lifestyle context${modelReference}

${isJewelry ? `MODEL SPECIFICATIONS:
- Age: 22-28 years old, natural, approachable beauty
- Ethnicity: Indian/South Asian features${modelImage ? ' (match the reference model provided)' : ''}
- Expression: Genuine, warm, natural smile or laugh${modelImage ? ' (similar to reference expression)' : ''}
- Hair: Natural, flowing style that moves with pose${modelImage ? ' (similar to reference style)' : ''}
- Makeup: Natural, glowing skin with subtle enhancement${modelImage ? ' (consistent with reference)' : ''}
- Pose: Candid, authentic movement showcasing jewelry naturally${modelImage ? ' (inspired by reference pose)' : ''}` : `FASHION LIFESTYLE MODEL SPECIFICATIONS:
- Age: 22-28 years old, natural fashion model beauty
- Ethnicity: Indian/South Asian features${modelImage ? ' (MUST match the reference model exactly)' : ''}
- Expression: ${isWearable ? 'Genuine, confident, lifestyle-appropriate expression' : 'Natural, warm expression highlighting the accessory'}
- Hair: ${modelImage ? 'EXACT same hairstyle and color as reference model' : `Natural, lifestyle-appropriate styling that ${isWearable ? 'complements the fashion item' : 'showcases the accessory'}`}
- Makeup: ${modelImage ? 'Identical natural makeup as reference model' : 'Natural, glowing lifestyle makeup'}
- Body Type: ${modelImage ? 'Same proportions as reference model' : 'Natural, healthy fashion model proportions'}
- Pose: ${isWearable ? 'Authentic lifestyle poses showing the item in real-world use' : 'Natural, candid poses highlighting the accessory'}${modelImage ? ' (maintaining reference model\'s natural style)' : ''}

FASHION LIFESTYLE STYLING:
- Primary Focus: The ${itemDetail} integrated naturally into lifestyle context
- Outfit Coordination: ${isWearable ? 'Real-world styling that shows how the item fits into daily life' : 'Natural, lifestyle outfit that makes the accessory shine'}
- Lifestyle Context: ${isWearable ? 'Authentic scenarios where the item would naturally be worn' : 'Natural settings where the accessory enhances the lifestyle'}
- Fashion Approach: Aspirational yet authentic lifestyle fashion photography`}

CAMERA & COMPOSITION:
- Shot type: Lifestyle portrait with environmental context
- Angle: Natural, slightly candid perspective
- Framing: Medium shot including some environment
- Depth of field: Sharp subject with beautifully blurred background

LIGHTING SETUP:
- Natural lighting: Golden hour or soft daylight
- Direction: Flattering natural light on face and jewelry
- Quality: Soft, diffused light creating warm glow
- Color: Warm, natural color temperature

BACKGROUND & SETTING:
- Natural environment: Garden, terrace, or elegant interior
- Elements: Soft greenery, architectural details, or natural textures
- Mood: Relaxed, luxurious lifestyle setting
- Style: Aspirational yet approachable

STYLING & WARDROBE:
- Outfit: Casual elegance, lifestyle appropriate
- Colors: Natural, earth tones or soft pastels
- Style: Effortless sophistication
- Overall look: Authentic, lived-in luxury`
    }

    // Product shots (2 shots without models)
    const productShots = {
      festive: `
SHOT TYPE: ${isJewelry ? 'Professional Product Photography - Clean Studio' : 'Cinematic Product Photography - Studio'}
SUBJECT: The ${itemDetail}${dimensionInfo} as hero product
${isJewelry ? 'JEWELRY' : 'FASHION ITEM'} FOCUS: The ${userPrompt} must be identical to reference image in every detail

${isJewelry ? `
PRODUCT PRESENTATION:
- Display: Jewelry elegantly positioned on professional display
- Orientation: Optimal angle showing all key design elements
- Positioning: Stable, secure placement highlighting craftsmanship
- Scale: Appropriate size showing intricate details clearly

LIGHTING SETUP:
- Key light: Professional studio lighting eliminating shadows
- Fill lights: Multiple soft lights for even illumination
- Accent lights: Specialized jewelry lighting for sparkle and shine
- Background light: Separate lighting for clean background

TECHNICAL REQUIREMENTS:
- No shadows or reflections on background
- Perfect color accuracy for metals and gems
- Sharp detail in all jewelry elements
- Professional retouching quality` : `
CINEMATIC PRESENTATION:
- Display: Fashion item styled with premium presentation
- Composition: Dynamic angles showcasing design and functionality
- Styling: Professional fashion styling with attention to detail
- Scale: Perfect proportions highlighting key features

LIGHTING SETUP:
- Cinematic lighting: Dramatic, high-end fashion photography lighting
- Key light: Strong directional light creating depth and dimension
- Fill light: Soft fill to maintain detail in shadows
- Accent lights: Rim lighting to separate subject from background

TECHNICAL REQUIREMENTS:
- Cinematic color grading and contrast
- Perfect material representation (fabric, leather, metal)
- Sharp detail in textures and construction
- High-end fashion photography quality`}`,

      artistic: `
SHOT TYPE: ${isJewelry ? 'Artistic Product Photography - Dramatic Detail' : 'Editorial Fashion Photography - Premium Style'}
SUBJECT: The ${itemDetail}${dimensionInfo} in artistic composition
${isJewelry ? 'JEWELRY' : 'FASHION ITEM'} FOCUS: The ${userPrompt} must be identical to reference, shown artistically

${isJewelry ? `
ARTISTIC PRESENTATION:
- Composition: Dramatic, artistic arrangement
- Focus: Extreme detail on jewelry craftsmanship
- Perspective: Unique angle highlighting design elements
- Styling: Sophisticated, gallery-worthy presentation

LIGHTING SETUP:
- Dramatic lighting: High contrast, directional lighting
- Key light: Strong, focused light creating shadows and highlights
- Accent lights: Specialized lighting making gems and metals gleam
- Mood lighting: Atmospheric lighting for artistic effect

ARTISTIC ELEMENTS:
- Shadows: Dramatic shadows adding depth and mystery
- Reflections: Controlled reflections enhancing jewelry beauty
- Contrast: High contrast emphasizing jewelry details
- Mood: Luxurious, sophisticated, gallery-worthy` : `
EDITORIAL PRESENTATION:
- Composition: High-fashion editorial styling
- Focus: Premium fashion photography with artistic flair
- Perspective: Dynamic angles showcasing fashion design
- Styling: Editorial fashion magazine quality presentation

LIGHTING SETUP:
- Editorial lighting: Fashion photography lighting setup
- Key light: Dramatic directional light for fashion effect
- Fill light: Controlled fill maintaining fashion aesthetic
- Background light: Atmospheric lighting for editorial mood

EDITORIAL ELEMENTS:
- Fashion styling: Professional editorial fashion styling
- Color grading: High-end fashion magazine color treatment
- Composition: Editorial layout and framing
- Mood: Sophisticated, high-fashion, editorial quality`}`
    }

    // Select appropriate prompt based on shot type
    const isModelShot = ['classic', 'profile', 'lifestyle'].includes(type)
    const shotPrompt = isModelShot
      ? modelShots[type as keyof typeof modelShots]
      : productShots[type as keyof typeof productShots]

    return `${technicalSpecs}

${shotPrompt}

CRITICAL REQUIREMENTS:
- Jewelry must be IDENTICAL to reference image in all aspects
- Professional photography quality suitable for luxury brand marketing
- Perfect technical execution with no artifacts or imperfections
- Color accuracy and material representation must be flawless
- Final image must be suitable for high-end commercial use`
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

            // Add to successful generations for saving
            successfulGenerations.push({
              id: step.id,
              url: imageUrl,
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
  }, [isGenerating, category.id, uploadedImage, userPrompt, selectedModel, jewelryType, dimensions, modelImage])

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
            alt={`Original ${isJewelry ? 'jewelry' : 'fashion item'}`}
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
