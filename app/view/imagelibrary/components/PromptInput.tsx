'use client'

import React, { useState } from 'react'
import { Category } from '../page'
import { ArrowLeft, Sparkles, Upload, Wand2, X } from 'lucide-react'
import Image from 'next/image'

interface PromptInputProps {
  category: Category
  uploadedImage: string
  onGenerate: (prompt: string, model: string, itemType: string, dimensions: string, modelImage?: string) => void
  onBack: () => void
}

interface JewelryType {
  id: string
  name: string
  description: string
  commonSizes: string[]
}

const JEWELRY_TYPES: JewelryType[] = [
  {
    id: 'earrings',
    name: 'Earrings',
    description: 'Studs, hoops, chandeliers, jhumkas, drop earrings',
    commonSizes: ['Small (under 1 inch)', 'Medium (1-2 inches)', 'Large (2-3 inches)', 'Statement (over 3 inches)']
  },
  {
    id: 'necklaces',
    name: 'Necklaces',
    description: 'Chains, pendants, chokers, statement pieces',
    commonSizes: ['Choker (14-16 inches)', 'Princess (17-19 inches)', 'Matinee (20-24 inches)', 'Opera (28-34 inches)', 'Rope (over 45 inches)']
  },
  {
    id: 'bracelets',
    name: 'Bracelets & Bangles',
    description: 'Chain bracelets, bangles, cuffs, tennis bracelets',
    commonSizes: ['Small (6-6.5 inches)', 'Medium (7-7.5 inches)', 'Large (8-8.5 inches)', 'Extra Large (9+ inches)']
  },
  {
    id: 'rings',
    name: 'Rings',
    description: 'Engagement, wedding, cocktail, statement rings',
    commonSizes: ['Size 4-5', 'Size 6-7', 'Size 8-9', 'Size 10-11', 'Adjustable']
  },
  {
    id: 'pendants',
    name: 'Pendants & Charms',
    description: 'Standalone pendants, lockets, religious symbols',
    commonSizes: ['Delicate (under 0.5 inch)', 'Small (0.5-1 inch)', 'Medium (1-1.5 inches)', 'Large (over 1.5 inches)']
  },
  {
    id: 'sets',
    name: 'Jewelry Sets',
    description: 'Matching earrings and necklace, complete bridal sets',
    commonSizes: ['2-piece set', '3-piece set', '4-piece set', 'Complete bridal set']
  }
]

const FASHION_TYPES: JewelryType[] = [
  {
    id: 'handbags',
    name: 'Handbags & Purses',
    description: 'Tote bags, clutches, crossbody bags, shoulder bags, evening purses',
    commonSizes: ['Mini (under 8 inches)', 'Small (8-12 inches)', 'Medium (12-16 inches)', 'Large (16-20 inches)', 'Oversized (over 20 inches)']
  },
  {
    id: 'shoes',
    name: 'Shoes & Footwear',
    description: 'Heels, flats, sneakers, boots, sandals, loafers',
    commonSizes: ['Size 5-6', 'Size 7-8', 'Size 9-10', 'Size 11-12', 'Custom Size']
  },
  {
    id: 'clothing',
    name: 'Clothing & Apparel',
    description: 'Dresses, tops, jeans, jackets, skirts, pants',
    commonSizes: ['XS (0-2)', 'S (4-6)', 'M (8-10)', 'L (12-14)', 'XL (16-18)', 'XXL (20+)']
  },
  {
    id: 'accessories',
    name: 'Fashion Accessories',
    description: 'Scarves, belts, hats, sunglasses, watches, hair accessories',
    commonSizes: ['One Size', 'Small', 'Medium', 'Large', 'Adjustable']
  },
  {
    id: 'activewear',
    name: 'Activewear & Sportswear',
    description: 'Yoga pants, sports bras, athletic shoes, gym wear, swimwear',
    commonSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 'outerwear',
    name: 'Outerwear & Coats',
    description: 'Jackets, coats, blazers, cardigans, sweaters',
    commonSizes: ['XS (32-34)', 'S (36-38)', 'M (40-42)', 'L (44-46)', 'XL (48-50)']
  }
]

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

const JEWELRY_PROMPT_SUGGESTIONS = [
  "Beautiful gold earrings with intricate design",
  "Traditional Indian jewelry with kundan stones",
  "Elegant silver necklace with pendant",
  "Modern minimalist ring design",
  "Vintage-style bracelet with detailed work",
  "Statement earrings with pearl accents"
]

const FASHION_PROMPT_SUGGESTIONS = [
  "Luxury leather handbag with gold hardware",
  "Casual denim jacket with vintage wash",
  "Elegant black dress for evening wear",
  "Comfortable running shoes with modern design",
  "Designer sunglasses with UV protection",
  "Cozy wool sweater for winter",
  "Trendy crossbody bag for daily use",
  "Professional blazer for office wear",
  "Stylish ankle boots with block heel",
  "Minimalist watch with leather strap"
]

export default function PromptInput({ category, uploadedImage, onGenerate, onBack }: PromptInputProps) {
  const [prompt, setPrompt] = useState('')
  const [selectedModel, setSelectedModel] = useState('flux-kontext-pro')
  const [selectedJewelryType, setSelectedJewelryType] = useState<JewelryType | null>(null)
  const [selectedDimensions, setSelectedDimensions] = useState('')
  const [customDimensions, setCustomDimensions] = useState('')
  const [modelImage, setModelImage] = useState<string | null>(null)
  const [isUploadingModel, setIsUploadingModel] = useState(false)
  const [isGenerating] = useState(false)

  // Get the appropriate type list based on category
  const itemTypes = category.id === 'jewelry' ? JEWELRY_TYPES : FASHION_TYPES
  const itemLabel = category.id === 'jewelry' ? 'Jewelry Type' : 'Fashion Item Type'
  const promptSuggestions = category.id === 'jewelry' ? JEWELRY_PROMPT_SUGGESTIONS : FASHION_PROMPT_SUGGESTIONS

  const handleModelImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WEBP, GIF)')
      return
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }

    setIsUploadingModel(true)
    try {
      console.log('📤 Uploading model image:', file.name, file.size, 'bytes')

      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', file)

      // Upload to image upload endpoint
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Upload failed: ${response.status}`)
      }

      if (!data.success || !data.imageUrl) {
        throw new Error(data.error || 'Upload failed - no image URL returned')
      }

      setModelImage(data.imageUrl)
      console.log('✅ Model image uploaded successfully:', data.imageUrl)

      // Show success message
      const notification = document.createElement('div')
      notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50'
      notification.textContent = '✅ Model image uploaded successfully!'
      document.body.appendChild(notification)

      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 3000)

    } catch (error) {
      console.error('❌ Error uploading model image:', error)

      // Show detailed error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Failed to upload model image: ${errorMessage}`)

      // Reset file input
      event.target.value = ''
    } finally {
      setIsUploadingModel(false)
    }
  }

  const handleGenerate = () => {
    if (!prompt.trim() || !selectedJewelryType) return
    
    onGenerate(prompt.trim(), selectedModel, selectedJewelryType.id, selectedDimensions, modelImage || undefined)
  }

  const testPrompt = () => {
    if (!prompt.trim() || !selectedJewelryType) {
      alert('Please fill in the description and select jewelry type to test prompts.')
      return
    }

    console.log('🧪 TESTING PROMPT GENERATION')
    console.log('='.repeat(50))
    
    console.log('📋 Input Parameters:')
    console.log('- Category:', category.id)
    console.log('- Item Type:', selectedJewelryType.id)
    console.log('- User Prompt:', prompt.trim())
    console.log('- Dimensions:', selectedDimensions)
    console.log('- Model Image:', modelImage ? 'Provided' : 'Not provided')
    console.log('- Selected Model:', selectedModel)

    // Create item data for prompt generation
    const itemData = {
      description: prompt.trim(),
      itemType: selectedJewelryType.id,
      category: category.id,
      brandAesthetic: 'luxury' as const
    }

    // Photography Style Configuration (copied from GenerationResults)
      const MODEL_PHOTOGRAPHY_STYLES = {
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
  }

    const PRODUCT_PHOTOGRAPHY_STYLES = {
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
    }

    const BRAND_AESTHETICS = {
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
    }

      const CATEGORY_ENHANCEMENTS = {
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
  }

    const generatePrompts = (itemData: {
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

    console.log('\n🎨 Generated Prompts:')
    console.log('='.repeat(50))

    // Define the steps that would be generated
    const steps = [
      { id: '1', type: 'classic', title: 'Model - Classic Elegance', description: 'Professional model wearing the jewelry with elegant pose and studio lighting' },
      { id: '2', type: 'profile', title: 'Model - Profile Showcase', description: 'Side profile view of model highlighting jewelry details and craftsmanship' },
      { id: '3', type: 'lifestyle', title: 'Model - Lifestyle Portrait', description: 'Natural lifestyle shot with model in beautiful setting wearing the jewelry' },
      { id: '4', type: 'festive', title: 'Product - Clean Studio', description: 'Professional product photography with clean background and perfect lighting' },
      { id: '5', type: 'artistic', title: 'Product - Artistic Detail', description: 'Dramatic close-up product shot with artistic lighting and composition' }
    ]

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
      const dimensionInfo = selectedDimensions ? ` (${selectedDimensions})` : ''
      
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
            <Image
              src={uploadedImage}
              alt="Uploaded jewelry"
              width={400}
              height={256}
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

          {/* Item Type Selection */}
          <div>
            <label className="block text-sm font-medium text-white mb-3">
              {itemLabel} *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {itemTypes.map((type) => (
                <div
                  key={type.id}
                  onClick={() => setSelectedJewelryType(type)}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedJewelryType?.id === type.id
                      ? 'border-[#6C3BFF] bg-[#6C3BFF]/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-3 h-3 rounded-full border-2 ${
                      selectedJewelryType?.id === type.id
                        ? 'border-[#6C3BFF] bg-[#6C3BFF]'
                        : 'border-gray-500'
                    }`}>
                      {selectedJewelryType?.id === type.id && (
                        <div className="w-1 h-1 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                    <span className="font-medium text-white text-sm">{type.name}</span>
                  </div>
                  <p className="text-xs text-gray-400">{type.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Dimensions Selection */}
          {selectedJewelryType && (
            <div>
              <label className="block text-sm font-medium text-white mb-3">
                Size/Dimensions
              </label>
              <div className="space-y-2">
                {selectedJewelryType.commonSizes.map((size, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedDimensions(size)}
                    className={`p-2 border rounded-lg cursor-pointer transition-all ${
                      selectedDimensions === size
                        ? 'border-[#6C3BFF] bg-[#6C3BFF]/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full border-2 ${
                        selectedDimensions === size
                          ? 'border-[#6C3BFF] bg-[#6C3BFF]'
                          : 'border-gray-500'
                      }`}>
                        {selectedDimensions === size && (
                          <div className="w-1 h-1 bg-white rounded-full m-0.5"></div>
                        )}
                      </div>
                      <span className="text-white text-sm">{size}</span>
                    </div>
                  </div>
                ))}

                {/* Custom Dimensions */}
                <div
                  onClick={() => setSelectedDimensions('custom')}
                  className={`p-2 border rounded-lg cursor-pointer transition-all ${
                    selectedDimensions === 'custom'
                      ? 'border-[#6C3BFF] bg-[#6C3BFF]/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full border-2 ${
                      selectedDimensions === 'custom'
                        ? 'border-[#6C3BFF] bg-[#6C3BFF]'
                        : 'border-gray-500'
                    }`}>
                      {selectedDimensions === 'custom' && (
                        <div className="w-1 h-1 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                    <span className="text-white text-sm">Custom dimensions</span>
                  </div>
                  {selectedDimensions === 'custom' && (
                    <input
                      type="text"
                      value={customDimensions}
                      onChange={(e) => setCustomDimensions(e.target.value)}
                      placeholder="e.g., 2.5 inches length, 1 inch width"
                      className="mt-2 w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#6C3BFF] focus:border-transparent text-sm"
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Model Reference Image Upload */}
          <div>
            <label className="block text-sm font-medium text-white mb-3">
              Model Reference Image (Optional)
            </label>
            <p className="text-xs text-gray-400 mb-3">
              Upload a reference image of the model you&apos;d like to use for the jewelry shots. This will help create more consistent model photography.
              <br />
              <span className="text-amber-400">Supported: PNG, JPG, WEBP, GIF • Max size: 10MB</span>
            </p>

            {!modelImage ? (
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleModelImageUpload}
                  disabled={isUploadingModel}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  id="model-image-upload"
                />
                <label
                  htmlFor="model-image-upload"
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg transition-all ${
                    isUploadingModel
                      ? 'border-gray-600 bg-gray-800/50 cursor-not-allowed'
                      : 'border-gray-600 hover:border-[#6C3BFF] hover:bg-gray-800/30 cursor-pointer'
                  }`}
                >
                  {isUploadingModel ? (
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 border-2 border-[#6C3BFF] border-t-transparent rounded-full animate-spin mb-2"></div>
                      <span className="text-sm text-gray-400">Uploading model image...</span>
                      <span className="text-xs text-gray-500 mt-1">This may take a few seconds</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="w-8 h-8 text-gray-500 mb-2" />
                      <span className="text-sm text-gray-300 mb-1">Click to upload model reference</span>
                      <span className="text-xs text-gray-500">PNG, JPG, WEBP, GIF up to 10MB</span>
                      <span className="text-xs text-amber-400 mt-1">Optional - helps create consistent model shots</span>
                    </div>
                  )}
                </label>
              </div>
            ) : (
              <div className="relative">
                <Image
                  src={modelImage}
                  alt="Model reference"
                  width={400}
                  height={128}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => setModelImage(null)}
                  className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                  Model Reference
                </div>
              </div>
            )}
          </div>

          {/* Prompt Suggestions */}
          <div>
            <h4 className="text-sm font-medium text-white mb-3">Quick suggestions:</h4>
            <div className="flex flex-wrap gap-2">
              {promptSuggestions.map((suggestion, index) => (
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

          {/* Test Prompt Button */}
          <button
            onClick={testPrompt}
            disabled={!prompt.trim() || !selectedJewelryType}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-800/50 hover:bg-gray-700/50 disabled:cursor-not-allowed text-white rounded-lg transition-all transform hover:scale-[1.02] font-medium mb-4"
          >
            <Wand2 className="w-5 h-5" />
            Test Prompts
          </button>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || !selectedJewelryType || isGenerating}
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

          {(!prompt.trim() || !selectedJewelryType) && (
            <p className="text-sm text-amber-400 text-center">
              Please fill in the description and select jewelry type to continue
            </p>
          )}

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
