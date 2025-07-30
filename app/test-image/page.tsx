'use client'

import React, { useState } from 'react'
import SafeImage from '../view/inchatHistory/components/SafeImage'
import Image from 'next/image'

const testImageUrl = "https://firebasestorage.googleapis.com/v0/b/wild-mind-ai.firebasestorage.app/o/generated-images%2F1753770522559_kontext_pro_a_cat_and_a_dog_1753770519235.png?alt=media&token=3dd3cf1b-3c72-4bf4-99df-07724c8d871d"

export default function TestImagePage() {
  const [showNativeImg, setShowNativeImg] = useState(false)

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-8">Image Rendering Test</h1>
      
      <div className="space-y-8">
        {/* Test with SafeImage component */}
        <div>
          <h2 className="text-xl font-semibold mb-4">SafeImage Component Test</h2>
          <div className="w-64 h-64 border border-gray-600 rounded-lg overflow-hidden">
            <SafeImage
              src={testImageUrl}
              alt="Test image"
              width={256}
              height={256}
              className="w-full h-full object-cover"
              fallbackText="SafeImage test failed"
            />
          </div>
        </div>

        {/* Test with native img tag */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Native IMG Tag Test</h2>
          <button 
            onClick={() => setShowNativeImg(!showNativeImg)}
            className="mb-4 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            {showNativeImg ? 'Hide' : 'Show'} Native IMG
          </button>
          
          {showNativeImg && (
            <div className="w-64 h-64 border border-gray-600 rounded-lg overflow-hidden">
              <Image
                src={testImageUrl}
                alt="Test image native"
                width={400}
                height={400}
              />
            </div>
          )}
        </div>

        {/* URL Info */}
        <div>
          <h2 className="text-xl font-semibold mb-4">URL Information</h2>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-sm break-all">{testImageUrl}</p>
          </div>
        </div>

        {/* Test buttons */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Manual Tests</h2>
          <div className="space-x-4">
            <button
              onClick={async () => {
                try {
                  console.log('🔍 Testing fetch...')
                  const response = await fetch(testImageUrl, { method: 'HEAD' })
                  console.log('✅ Fetch test result:', response.status, response.statusText)
                  alert(`Fetch test: ${response.status} ${response.statusText}`)
                } catch (error) {
                  console.error('❌ Fetch test failed:', error)
                  alert(`Fetch test failed: ${error}`)
                }
              }}
              className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700"
            >
              Test Fetch
            </button>
            
            <button
              onClick={() => {
                window.open(testImageUrl, '_blank')
              }}
              className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              Open in New Tab
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}