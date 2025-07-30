'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { GeneratedImage } from '../page'
import { Search, Filter, Download, Trash2, Maximize, Copy, Check, Calendar, Image as ImageIcon, Grid, List, RefreshCw, Upload, Database } from 'lucide-react'
import SafeImage from './SafeImage'
import { isLikelyExpired } from '../utils/imageUtils'
import { migrateAllImagesToStorage, getMigrationStatus, type MigrationResult } from '@/lib/imageMigration'
import { preloadFirebaseImages, isFirebaseStorageUrl } from '@/lib/imagePreloader'

interface LibraryProps {
  images: GeneratedImage[]
  onDeleteImage: (imageId: string) => void
  selectedImageForEdit: GeneratedImage | null
  onSelectImageForEdit: (image: GeneratedImage | null) => void
  onSwitchToChat: () => void
}

export default function Library({
  images,
  onDeleteImage,
  selectedImageForEdit,
  onSelectImageForEdit,
  onSwitchToChat
}: LibraryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedModel, setSelectedModel] = useState<string>('all')
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [fullscreenImage, setFullscreenImage] = useState<GeneratedImage | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [migrationStatus, setMigrationStatus] = useState<{ total: number; migrated: number; pending: number } | null>(null)
  const [isMigrating, setIsMigrating] = useState(false)
  const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null)

  // Load migration status on component mount
  useEffect(() => {
    const loadMigrationStatus = async () => {
      try {
        const status = await getMigrationStatus()
        setMigrationStatus(status)
      } catch (error) {
        console.error('Failed to load migration status:', error)
      }
    }

    loadMigrationStatus()
  }, [images.length]) // Reload when images change

  // Preload Firebase Storage images for better performance
  useEffect(() => {
    const preloadImages = async () => {
      const firebaseUrls = images
        .filter(img => isFirebaseStorageUrl(img.imageUrl))
        .map(img => img.imageUrl)

      if (firebaseUrls.length > 0) {
        console.log(`🔄 Preloading ${firebaseUrls.length} Firebase Storage images...`)
        await preloadFirebaseImages(firebaseUrls)
      }
    }

    // Debounce preloading to avoid excessive calls
    const timeoutId = setTimeout(preloadImages, 500)
    return () => clearTimeout(timeoutId)
  }, [images])

  // Handle migration
  const handleMigration = async () => {
    setIsMigrating(true)
    setMigrationResult(null)

    try {
      console.log('🚀 Starting image migration...')
      const result = await migrateAllImagesToStorage()
      setMigrationResult(result)

      // Refresh migration status
      const newStatus = await getMigrationStatus()
      setMigrationStatus(newStatus)

      console.log('✅ Migration completed:', result)
    } catch (error) {
      console.error('❌ Migration failed:', error)
      setMigrationResult({
        total: 0,
        migrated: 0,
        failed: 1,
        skipped: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      })
    } finally {
      setIsMigrating(false)
    }
  }

  // Filter and search images
  const filteredImages = useMemo(() => {
    return images.filter(image => {
      const matchesSearch = image.prompt.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesModel = selectedModel === 'all' || image.model === selectedModel
      const matchesAspectRatio = selectedAspectRatio === 'all' || image.aspectRatio === selectedAspectRatio
      
      return matchesSearch && matchesModel && matchesAspectRatio
    })
  }, [images, searchQuery, selectedModel, selectedAspectRatio])

  // Get unique models and aspect ratios for filters
  const uniqueModels = useMemo(() => {
    const models = [...new Set(images.map(img => img.model))]
    return models.sort()
  }, [images])

  const uniqueAspectRatios = useMemo(() => {
    const ratios = [...new Set(images.map(img => img.aspectRatio))]
    return ratios.sort()
  }, [images])

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

  const copyToClipboard = async (text: string, imageId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(imageId)
      setTimeout(() => setCopied(null), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  const formatDate = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(timestamp)
  }

  const handleDelete = (imageId: string) => {
    onDeleteImage(imageId)
    setDeleteConfirm(null)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Image Library</h2>
            <div className="flex items-center gap-4">
              <p className="text-gray-400">{filteredImages.length} of {images.length} images</p>
              {selectedImageForEdit && (
                <div className="flex items-center gap-2 px-3 py-1 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-purple-300 text-sm">1 selected for editing</span>
                  <button
                    onClick={() => onSelectImageForEdit(null)}
                    className="text-purple-400 hover:text-purple-300 ml-1"
                    title="Clear selection"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Migration Button */}
            {migrationStatus && migrationStatus.pending > 0 && (
              <button
                onClick={handleMigration}
                disabled={isMigrating}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
                title={`Migrate ${migrationStatus.pending} images to permanent storage`}
              >
                <Database className="w-4 h-4" />
                {isMigrating ? 'Migrating...' : `Migrate ${migrationStatus.pending} Images`}
              </button>
            )}

            {/* Edit Selected Button */}
            {selectedImageForEdit && (
              <button
                onClick={() => {
                  onSwitchToChat()
                  console.log('🎨 Switching to chat to edit selected image')
                }}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Selected
              </button>
            )}

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-[#6C3BFF] text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-[#6C3BFF] text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#6C3BFF] focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#6C3BFF] focus:border-transparent"
            >
              <option value="all">All Models</option>
              {uniqueModels.map(model => (
                <option key={model} value={model}>
                  {model.replace('flux-', '').replace('-', ' ')}
                </option>
              ))}
            </select>

            <select
              value={selectedAspectRatio}
              onChange={(e) => setSelectedAspectRatio(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#6C3BFF] focus:border-transparent"
            >
              <option value="all">All Ratios</option>
              {uniqueAspectRatios.map(ratio => (
                <option key={ratio} value={ratio}>
                  {ratio}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredImages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <ImageIcon className="w-16 h-16 text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {images.length === 0 ? 'No images yet' : 'No matching images'}
            </h3>
            <p className="text-gray-400 max-w-md">
              {images.length === 0 
                ? 'Start generating images in the chat to build your library'
                : 'Try adjusting your search or filter criteria'
              }
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-all group"
              >
                {/* Image */}
                <div className="relative aspect-square">
                  <SafeImage
                    src={image.imageUrl}
                    alt={image.prompt}
                    fill
                    className="object-cover cursor-pointer"
                    onClick={() => setFullscreenImage(image)}
                    fallbackText="Image unavailable"
                  />
                  
                  {/* Selection Indicator */}
                  {selectedImageForEdit?.id === image.id && (
                    <div className="absolute inset-0 border-3 border-purple-400 rounded-lg bg-purple-500/20 backdrop-blur-sm">
                      <div className="absolute top-2 right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        Selected
                      </div>
                      <div className="absolute bottom-2 left-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                        Edit Mode
                      </div>
                    </div>
                  )}

                  {/* Click to Select Overlay */}
                  <div
                    className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all cursor-pointer flex items-center justify-center"
                    onClick={() => {
                      if (selectedImageForEdit?.id === image.id) {
                        onSelectImageForEdit(null)
                        console.log('❌ Deselected image for editing')
                      } else {
                        onSelectImageForEdit(image)
                        console.log('🖼️ Selected image for editing:', image.id)
                      }
                    }}
                  >
                    {selectedImageForEdit?.id !== image.id && (
                      <div className="opacity-0 hover:opacity-100 transition-opacity bg-purple-500/90 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Click to Select for Edit
                      </div>
                    )}
                  </div>

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setFullscreenImage(image)
                        }}
                        className="p-3 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm transition-colors"
                        title="View fullscreen"
                      >
                        <Maximize className="w-5 h-5 text-white" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectImageForEdit(image)
                          onSwitchToChat()
                          console.log('🎨 Switching to chat with selected image:', image.id)
                        }}
                        className="p-3 bg-purple-500/30 hover:bg-purple-500/50 rounded-xl backdrop-blur-sm transition-colors"
                        title="Edit this image"
                      >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          downloadImage(image.imageUrl, `generated-${image.id}.png`)
                        }}
                        className="p-3 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm transition-colors"
                        title="Download"
                      >
                        <Download className="w-5 h-5 text-white" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setDeleteConfirm(image.id)
                        }}
                        className="p-3 bg-red-500/20 hover:bg-red-500/30 rounded-xl backdrop-blur-sm transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="text-sm text-gray-300 line-clamp-2 mb-2">
                    {image.prompt}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{image.model.replace('flux-', '').replace('-', ' ')}</span>
                    <span>{image.aspectRatio}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">
                      {formatDate(image.timestamp)}
                    </span>
                    <button
                      onClick={() => copyToClipboard(image.prompt, image.id)}
                      className="text-gray-500 hover:text-gray-300 transition-colors"
                      title="Copy prompt"
                    >
                      {copied === image.id ? (
                        <Check className="w-3 h-3 text-green-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className={`rounded-xl p-4 border transition-all cursor-pointer group ${
                  selectedImageForEdit?.id === image.id
                    ? 'bg-purple-900/30 border-purple-500/50 shadow-lg shadow-purple-500/20'
                    : 'bg-gray-800/50 border-gray-700 hover:border-purple-400/50 hover:bg-gray-800/70'
                }`}
                onClick={() => {
                  if (selectedImageForEdit?.id === image.id) {
                    onSelectImageForEdit(null)
                    console.log('❌ Deselected image for editing')
                  } else {
                    onSelectImageForEdit(image)
                    console.log('🖼️ Selected image for editing:', image.id)
                  }
                }}
              >
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 flex-shrink-0 relative">
                    <SafeImage
                      src={image.imageUrl}
                      alt={image.prompt}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover rounded-lg"
                      fallbackText="Thumbnail unavailable"
                    />
                    {selectedImageForEdit?.id === image.id && (
                      <div className="absolute inset-0 border-2 border-purple-400 rounded-lg bg-purple-500/20">
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                        <div className="absolute bottom-1 left-1 bg-purple-500 text-white text-xs px-1 py-0.5 rounded">
                          Edit
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-gray-300 flex-1">{image.prompt}</p>
                      {selectedImageForEdit?.id !== image.id && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                          <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full">
                            Click to select for edit
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                      <span>{image.model.replace('flux-', '').replace('-', ' ')}</span>
                      <span>{image.aspectRatio}</span>
                      {image.seed && <span>Seed: {image.seed}</span>}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(image.timestamp)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectImageForEdit(image)
                        onSwitchToChat()
                        console.log('🎨 Switching to chat with selected image:', image.id)
                      }}
                      className="p-2 text-gray-500 hover:text-purple-400 transition-colors"
                      title="Edit this image"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        copyToClipboard(image.prompt, image.id)
                      }}
                      className="p-2 text-gray-500 hover:text-gray-300 transition-colors"
                      title="Copy prompt"
                    >
                      {copied === image.id ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setFullscreenImage(image)
                      }}
                      className="p-2 text-gray-500 hover:text-gray-300 transition-colors"
                      title="View fullscreen"
                    >
                      <Maximize className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        downloadImage(image.imageUrl, `generated-${image.id}.png`)
                      }}
                      className="p-2 text-gray-500 hover:text-gray-300 transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteConfirm(image.id)
                      }}
                      className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Edit Button */}
      {selectedImageForEdit && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => {
              onSwitchToChat()
              console.log('🎨 Quick edit: Switching to chat with selected image')
            }}
            className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-full shadow-2xl shadow-purple-500/30 transition-all transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="font-medium">Edit Selected Image</span>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </button>
        </div>
      )}

      {/* Migration Results Modal */}
      {migrationResult && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Migration Complete</h3>
              <button
                onClick={() => setMigrationResult(null)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Total Images:</span>
                <span className="text-white">{migrationResult.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-400">Migrated:</span>
                <span className="text-green-400">{migrationResult.migrated}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-yellow-400">Skipped:</span>
                <span className="text-yellow-400">{migrationResult.skipped}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-red-400">Failed:</span>
                <span className="text-red-400">{migrationResult.failed}</span>
              </div>
            </div>

            {migrationResult.errors.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-red-400 mb-2">Errors:</h4>
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 max-h-32 overflow-y-auto">
                  {migrationResult.errors.map((error, index) => (
                    <p key={index} className="text-xs text-red-300 mb-1">{error}</p>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setMigrationResult(null)}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Fullscreen Modal */}
      {fullscreenImage && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-full max-h-full">
            <SafeImage
              src={fullscreenImage.imageUrl}
              alt={fullscreenImage.prompt}
              width={1200}
              height={1200}
              className="max-w-full max-h-full object-contain"
              fallbackText="Fullscreen image unavailable"
            />
            
            {/* Close button */}
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute top-4 right-4 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
            >
              <Maximize className="w-6 h-6 text-white rotate-45" />
            </button>
            
            {/* Download button */}
            <button
              onClick={() => downloadImage(fullscreenImage.imageUrl, `generated-${fullscreenImage.id}.png`)}
              className="absolute top-4 left-4 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
            >
              <Download className="w-6 h-6 text-white" />
            </button>

            {/* Image info overlay */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-4">
              <p className="text-white mb-2">{fullscreenImage.prompt}</p>
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <span>{fullscreenImage.model.replace('flux-', '').replace('-', ' ')}</span>
                <span>{fullscreenImage.aspectRatio}</span>
                {fullscreenImage.seed && <span>Seed: {fullscreenImage.seed}</span>}
                <span>{formatDate(fullscreenImage.timestamp)}</span>
              </div>
            </div>
          </div>
          
          {/* Click outside to close */}
          <div 
            className="absolute inset-0 -z-10"
            onClick={() => setFullscreenImage(null)}
          />
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-white mb-2">Delete Image</h3>
            <p className="text-gray-400 text-sm mb-4">
              This action cannot be undone. The image will be permanently deleted from your library.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
