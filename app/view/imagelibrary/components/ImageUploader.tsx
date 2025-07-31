'use client'

import React, { useState, useRef } from 'react'
import { Category } from '../page'
import { Upload, ArrowLeft, X, Camera, FileImage } from 'lucide-react'
import { uploadToFirebaseStorage } from '@/lib/firebaseStorage'
import Image from 'next/image'

interface ImageUploaderProps {
  category: Category
  onImageUpload: (imageUrl: string) => void
  onBack: () => void
}

export default function ImageUploader({ category, onImageUpload, onBack }: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image file')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size must be less than 10MB')
      return
    }

    setUploadError(null)
    setIsUploading(true)

    try {
      // Create preview first
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('❌ Error creating preview:', error)
      setUploadError(error instanceof Error ? error.message : 'Failed to create preview')
      setIsUploading(false)
    }
  }

  const handleConfirmUpload = async () => {
    if (!uploadedImage) return

    try {
      setIsUploading(true)

      // Convert base64 to blob and upload to Firebase Storage
      const response = await fetch(uploadedImage)
      const blob = await response.blob()
      const file = new File([blob], 'reference-image.jpg', { type: 'image/jpeg' })

      console.log('📤 Uploading reference image to Firebase Storage...')
      const uploadResult = await uploadToFirebaseStorage(file, 'reference-images')

      if (uploadResult.success && uploadResult.url) {
        console.log('✅ Reference image uploaded successfully:', uploadResult.url)
        onImageUpload(uploadResult.url)
      } else {
        throw new Error(uploadResult.error || 'Upload failed')
      }
    } catch (error) {
      console.error('❌ Upload error:', error)
      setUploadError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const clearImage = () => {
    setUploadedImage(null)
    setUploadError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
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
          <h1 className="text-2xl font-bold text-white">Upload {category.name}</h1>
          <p className="text-gray-400">
            Upload a clear photo of your {category.name.toLowerCase()} item
          </p>
        </div>
      </div>

      {!uploadedImage ? (
        /* Upload Area */
        <div
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
            dragActive
              ? 'border-[#6C3BFF] bg-[#6C3BFF]/5'
              : 'border-gray-600 hover:border-gray-500'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />

          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center">
                {isUploading ? (
                  <div className="w-8 h-8 border-2 border-[#6C3BFF] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Upload className="w-8 h-8 text-gray-400" />
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {isUploading ? 'Uploading...' : 'Drop your image here'}
              </h3>
              <p className="text-gray-400 mb-4">
                or click to browse from your device
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Drag and drop your images here, or click to browse. Supported formats: JPG, PNG, GIF, WEBP
              </p>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2 px-6 py-3 bg-[#6C3BFF] hover:bg-[#5A2FE6] disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <FileImage className="w-4 h-4" />
                Choose File
              </button>
              <button
                onClick={() => {/* TODO: Add camera capture */}}
                disabled={isUploading}
                className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <Camera className="w-4 h-4" />
                Take Photo
              </button>
            </div>
          </div>

          {uploadError && (
            <div className="mt-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{uploadError}</p>
            </div>
          )}
        </div>
      ) : (
        /* Preview Area */
        <div className="space-y-6">
          <div className="relative bg-gray-800/50 rounded-2xl p-6">
            <button
              onClick={clearImage}
              className="absolute top-4 right-4 p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-full transition-colors z-10"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>

            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <Image
                  src={uploadedImage}
                  alt="Uploaded jewelry"
                  width={400}
                  height={320}
                  className="w-full h-80 object-contain bg-gray-900/50 rounded-lg"
                />
              </div>
              
              <div className="flex-1 space-y-4">
                <h3 className="text-xl font-semibold text-white">Image Preview</h3>
                <p className="text-gray-400">
                  This looks great! Our AI will analyze this {category.name.toLowerCase()} and generate 5 professional photos with different angles and poses.
                </p>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-white">What we&apos;ll create:</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#6C3BFF] rounded-full"></div>
                      Classic product showcase
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#6C3BFF] rounded-full"></div>
                      Profile view with details
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#6C3BFF] rounded-full"></div>
                      Festive/traditional context
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#6C3BFF] rounded-full"></div>
                      Lifestyle/candid shot
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#6C3BFF] rounded-full"></div>
                      Artistic detail shot
                    </li>
                  </ul>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleConfirmUpload}
                    disabled={isUploading}
                    className="flex-1 px-6 py-3 bg-[#6C3BFF] hover:bg-[#5A2FE6] disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
                  >
                    {isUploading ? 'Processing...' : 'Continue with this image'}
                  </button>
                  <button
                    onClick={clearImage}
                    disabled={isUploading}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    Choose Different
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="mt-12 p-6 bg-blue-900/20 border border-blue-500/30 rounded-xl">
        <h3 className="font-semibold text-blue-300 mb-3">📸 Tips for Best Results</h3>
        <ul className="space-y-2 text-sm text-blue-200">
          <li>• Use good lighting - natural light works best</li>
          <li>• Ensure the jewelry is clearly visible and in focus</li>
          <li>• Clean background preferred but not required</li>
          <li>• Multiple angles are fine - AI will work with any view</li>
          <li>• Higher resolution images produce better results</li>
        </ul>
      </div>
    </div>
  )
}
