'use client'

import React from 'react'
import { Category } from '../page'
import { ChevronRight, Sparkles } from 'lucide-react'

interface CategorySelectorProps {
  categories: Category[]
  onSelect: (category: Category) => void
}

export default function CategorySelector({ categories, onSelect }: CategorySelectorProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="w-8 h-8 text-[#6C3BFF]" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            AI Product Studio
          </h1>
        </div>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Transform your product photos with AI-powered professional photography. 
          Upload any item and get 5 stunning photos with different angles and styles.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          // Check if category is available (not containing "Coming soon" in description)
          const isAvailable = !category.description.toLowerCase().includes('coming soon')

          return (
            <div
              key={category.id}
              onClick={() => isAvailable ? onSelect(category) : null}
              className={`group relative p-6 rounded-2xl border transition-all duration-300 ${
                isAvailable
                  ? 'bg-gradient-to-br from-[#6C3BFF]/10 to-[#412399]/10 border-[#6C3BFF]/30 hover:border-[#6C3BFF]/50 cursor-pointer transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#6C3BFF]/20'
                  : 'bg-gray-800/30 border-gray-700/50 cursor-not-allowed opacity-60'
              }`}
            >
              {/* Coming Soon Badge */}
              {!isAvailable && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full">
                  <span className="text-amber-300 text-xs font-medium">Coming Soon</span>
                </div>
              )}

            {/* Category Icon */}
            <div className="text-4xl mb-4">{category.icon}</div>

            {/* Category Info */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                {category.name}
                {category.id === 'jewelry' && (
                  <ChevronRight className="w-5 h-5 text-[#6C3BFF] group-hover:translate-x-1 transition-transform" />
                )}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {category.description}
              </p>
            </div>

            {/* Examples */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-300">Examples:</h4>
              <ul className="space-y-1">
                {category.examples.slice(0, 3).map((example, index) => (
                  <li key={index} className="text-xs text-gray-500 flex items-center gap-2">
                    <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                    {example}
                  </li>
                ))}
                {category.examples.length > 3 && (
                  <li className="text-xs text-gray-600">
                    +{category.examples.length - 3} more...
                  </li>
                )}
              </ul>
            </div>

            {/* Active Category Indicator */}
            {isAvailable && (
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#6C3BFF]/5 to-[#412399]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            )}
          </div>
          )
        })}
      </div>

      {/* Info Section */}
      <div className="mt-16 p-8 bg-gray-800/30 border border-gray-700/50 rounded-2xl">
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-4">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#6C3BFF]/20 rounded-full flex items-center justify-center mb-3">
                <span className="text-[#6C3BFF] font-bold">1</span>
              </div>
              <h4 className="font-medium text-white mb-2">Upload Your Item</h4>
              <p className="text-sm text-gray-400 text-center">
                Take a photo of your product from any angle
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#6C3BFF]/20 rounded-full flex items-center justify-center mb-3">
                <span className="text-[#6C3BFF] font-bold">2</span>
              </div>
              <h4 className="font-medium text-white mb-2">Add Description</h4>
              <p className="text-sm text-gray-400 text-center">
                Describe your item and any specific requirements
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#6C3BFF]/20 rounded-full flex items-center justify-center mb-3">
                <span className="text-[#6C3BFF] font-bold">3</span>
              </div>
              <h4 className="font-medium text-white mb-2">Get 5 Pro Photos</h4>
              <p className="text-sm text-gray-400 text-center">
                Receive professional photos with different angles and styles
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
