'use client'

import React, { useState, useEffect } from 'react'
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import CategorySelector from './components/CategorySelector'
import ImageUploader from './components/ImageUploader'
import PromptInput from './components/PromptInput'
import GenerationResults from './components/GenerationResults'
import LibraryGrid from './components/LibraryGrid'
import { ArrowLeft, Sparkles, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'

export interface Category {
  id: string
  name: string
  description: string
  icon: string
  examples: string[]
}

export interface GeneratedSet {
  id: string
  category: string
  originalImage: string
  userPrompt: string
  detectedJewelryType?: string // AI will detect this
  generatedImages: {
    id: string
    url: string
    prompt: string
    type: 'classic' | 'profile' | 'festive' | 'lifestyle' | 'artistic'
    description: string
  }[]
  model: string
  timestamp: Date
  storedInFirebase?: boolean
}

const CATEGORIES: Category[] = [
  {
    id: 'jewelry',
    name: 'Jewelry',
    description: 'Upload any jewelry piece and AI will automatically detect the type and generate 5 professional photos with different angles and poses',
    icon: '💎',
    examples: [
      'Earrings (Jhumkas, Chandbali, Studs)',
      'Necklaces (Chokers, Long chains, Temple jewelry)',
      'Bangles & Bracelets',
      'Rings (Traditional, Modern)',
      'Complete Jewelry Sets'
    ]
  },
  {
    id: 'fashion',
    name: 'Fashion & Accessories',
    description: 'Coming soon - Upload fashion items and accessories for professional product photography',
    icon: '👗',
    examples: [
      'Handbags & Purses',
      'Scarves & Shawls',
      'Watches',
      'Sunglasses',
      'Fashion Accessories'
    ]
  },
  {
    id: 'home',
    name: 'Home Decor',
    description: 'Coming soon - Upload home decor items for lifestyle and product photography',
    icon: '🏠',
    examples: [
      'Decorative Items',
      'Vases & Pottery',
      'Candles',
      'Art Pieces',
      'Furniture Accessories'
    ]
  }
]

export default function ImageLibrary() {
  const [currentStep, setCurrentStep] = useState<'category' | 'upload' | 'generate' | 'results' | 'library'>('category')
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [userPrompt, setUserPrompt] = useState('')
  const [selectedModel, setSelectedModel] = useState('flux-kontext-pro')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedSets, setGeneratedSets] = useState<GeneratedSet[]>([])
  const [, setCurrentGeneratedSet] = useState<GeneratedSet | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Load generated sets from Firestore
  useEffect(() => {
    console.log('🔥 Loading generated sets from Firestore...')

    const q = query(collection(db, 'generatedSets'), orderBy('timestamp', 'desc'))
    const unsubscribe = onSnapshot(q,
      (querySnapshot) => {
        console.log(`📦 Loaded ${querySnapshot.size} generated sets from Firestore`)
        const sets: GeneratedSet[] = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          sets.push({
            id: doc.id,
            ...data,
            timestamp: data.timestamp?.toDate() || new Date()
          } as GeneratedSet)
        })
        setGeneratedSets(sets)
      },
      (error) => {
        console.error('❌ Error loading generated sets:', error)
      }
    )

    return () => unsubscribe()
  }, [])

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category)
    setCurrentStep('upload')
  }

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl)
    setCurrentStep('generate')
  }

  const handleGenerate = async (prompt: string, model: string) => {
    setUserPrompt(prompt)
    setSelectedModel(model)
    setIsGenerating(true)
    setCurrentStep('results')

    // The actual generation will be handled by the GenerationResults component
  }

  const handleGenerationComplete = (generatedSet: GeneratedSet) => {
    setCurrentGeneratedSet(generatedSet)
    setIsGenerating(false)
  }

  const resetToStart = () => {
    setCurrentStep('category')
    setSelectedCategory(null)
    setUploadedImage(null)
    setUserPrompt('')
    setCurrentGeneratedSet(null)
  }

  const goToLibrary = () => {
    setCurrentStep('library')
  }

  const deleteSet = async (setId: string) => {
    try {
      await deleteDoc(doc(db, 'generatedSets', setId))
      console.log('✅ Generated set deleted')
    } catch (error) {
      console.error('❌ Error deleting generated set:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <div className="border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/view/inchatHistory"
                className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                title="Back to Chat"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </Link>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#6C3BFF] to-[#412399] rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Jewelry Studio</h1>
                  <p className="text-gray-400 text-sm">
                    Generate professional jewelry photos with AI
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {currentStep !== 'category' && (
                <button
                  onClick={resetToStart}
                  className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors text-sm"
                >
                  New Project
                </button>
              )}

              <button
                onClick={goToLibrary}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentStep === 'library'
                    ? 'bg-[#6C3BFF] text-white'
                    : 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-300'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                Library ({generatedSets.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {currentStep === 'category' && (
          <CategorySelector
            categories={CATEGORIES}
            onSelect={handleCategorySelect}
          />
        )}

        {currentStep === 'upload' && selectedCategory && (
          <ImageUploader
            category={selectedCategory}
            onImageUpload={handleImageUpload}
            onBack={() => setCurrentStep('category')}
          />
        )}

        {currentStep === 'generate' && selectedCategory && uploadedImage && (
          <PromptInput
            category={selectedCategory}
            uploadedImage={uploadedImage}
            onGenerate={handleGenerate}
            onBack={() => setCurrentStep('upload')}
          />
        )}

        {currentStep === 'results' && (
          <GenerationResults
            category={selectedCategory!}
            uploadedImage={uploadedImage!}
            userPrompt={userPrompt}
            selectedModel={selectedModel}
            isGenerating={isGenerating}
            onGenerationComplete={handleGenerationComplete}
            onBack={() => setCurrentStep('generate')}
          />
        )}

        {currentStep === 'library' && (
          <LibraryGrid
            sets={generatedSets}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onDeleteSet={deleteSet}
            onNewProject={resetToStart}
          />
        )}
      </div>
    </div>
  )
}