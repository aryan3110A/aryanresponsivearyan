'use client'

import React, { useState } from 'react'
import { GeneratedSet } from '../page'
import { Grid, List, Download, Trash2, Calendar, Eye, Plus, Search, AlertCircle } from 'lucide-react'

interface LibraryGridProps {
  sets: GeneratedSet[]
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  onDeleteSet: (setId: string) => Promise<void>
  onNewProject: () => void
  onCleanupPlaceholders?: () => Promise<void>
}

// Safe Image component with error handling
const SafeLibraryImage = ({ src, alt, className, onClick }: {
  src: string
  alt: string
  className?: string
  onClick?: () => void
}) => {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleImageError = () => {
    setImageError(true)
    setIsLoading(false)
  }

  const handleImageLoad = () => {
    setIsLoading(false)
    setImageError(false)
  }

  if (imageError) {
    return (
      <div
        className={`bg-gray-700/50 flex items-center justify-center ${className}`}
        onClick={onClick}
      >
        <div className="text-center">
          <AlertCircle className="w-6 h-6 text-gray-500 mx-auto mb-1" />
          <p className="text-xs text-gray-500">Image unavailable</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-700/50 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-gray-500 border-t-[#6C3BFF] rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        onClick={onClick}
      />
    </div>
  )
}

export default function LibraryGrid({
  sets,
  viewMode,
  onViewModeChange,
  onDeleteSet,
  onNewProject,
  onCleanupPlaceholders
}: LibraryGridProps) {
  const [selectedSet, setSelectedSet] = useState<GeneratedSet | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const filteredSets = sets.filter(set => {
    // Filter by search query
    const matchesSearch = set.userPrompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      set.category.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter out sets with only placeholder images or no images
    const hasRealImages = set.generatedImages.length > 0 &&
      set.generatedImages.some(img =>
        !img.url.includes('picsum.photos') &&
        !img.url.includes('placeholder') &&
        img.url.trim() !== ''
      )

    return matchesSearch && hasRealImages
  })

  const formatDate = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(timestamp)
  }

  const downloadImage = async (imageUrl: string, filename: string) => {
    try {
      console.log('📥 Downloading image:', filename)

      // For Firebase Storage URLs, we need to handle CORS properly
      const response = await fetch(imageUrl, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'image/*'
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`)
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
      console.log('✅ Image downloaded successfully:', filename)
    } catch (error) {
      console.error('❌ Download failed:', error)

      // Fallback: try opening in new tab
      try {
        const newWindow = window.open(imageUrl, '_blank')
        if (!newWindow) {
          alert('Download failed. Please allow popups and try again.')
        }
      } catch (fallbackError) {
        console.error('❌ Fallback download failed:', fallbackError)
        alert('Download failed. Please try right-clicking the image and selecting "Save image as..."')
      }
    }
  }

  const downloadSetAsZip = async (set: GeneratedSet) => {
    console.log('📦 Downloading complete set:', set.id)

    // Show progress notification
    const notification = document.createElement('div')
    notification.className = 'fixed top-4 right-4 bg-[#6C3BFF] text-white px-4 py-2 rounded-lg shadow-lg z-50'
    notification.textContent = `Downloading ${set.generatedImages.length} images...`
    document.body.appendChild(notification)

    try {
      // Download images individually with proper naming
      for (let index = 0; index < set.generatedImages.length; index++) {
        const image = set.generatedImages[index]
        const filename = `${set.category}_${image.type}_${Date.now()}_${index + 1}.jpg`

        await new Promise(resolve => {
          setTimeout(async () => {
            await downloadImage(image.url, filename)
            resolve(void 0)
          }, index * 1000) // 1 second delay between downloads
        })
      }

      // Update notification
      notification.textContent = '✅ All images downloaded!'
      notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50'

    } catch (error) {
      console.error('❌ Error downloading set:', error)
      notification.textContent = '❌ Download failed'
      notification.className = 'fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50'
    }

    // Remove notification after 3 seconds
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 3000)
  }

  const handleDelete = async (setId: string) => {
    try {
      // Show loading state
      const deleteButton = document.querySelector(`[data-delete-id="${setId}"]`) as HTMLButtonElement
      if (deleteButton) {
        deleteButton.disabled = true
        deleteButton.textContent = 'Deleting...'
      }

      await onDeleteSet(setId)
      setDeleteConfirm(null)

      // Show success notification
      const notification = document.createElement('div')
      notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50'
      notification.textContent = '✅ Project deleted successfully'
      document.body.appendChild(notification)

      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 3000)

    } catch (error) {
      console.error('❌ Error deleting set:', error)
      setDeleteConfirm(null)

      // Show error notification
      const notification = document.createElement('div')
      notification.className = 'fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50'
      notification.textContent = '❌ Failed to delete project'
      document.body.appendChild(notification)

      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 3000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Your Library</h1>
          <p className="text-gray-400">
            {filteredSets.length} of {sets.length} projects • {sets.reduce((total, set) => total + set.generatedImages.length, 0)} total images
          </p>
          {sets.length > 0 && (
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span>Latest: {formatDate(sets[0].timestamp)}</span>
              <span>•</span>
              <span>Categories: {new Set(sets.map(s => s.category)).size}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search sets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#6C3BFF] focus:border-transparent"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-[#6C3BFF] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-[#6C3BFF] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Cleanup Button */}
          {onCleanupPlaceholders && sets.some(set =>
            set.generatedImages.some(img => img.url.includes('picsum.photos') || img.url.includes('placeholder')) ||
            set.generatedImages.length === 0
          ) && (
            <button
              onClick={onCleanupPlaceholders}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
              title="Remove projects with placeholder images"
            >
              <Trash2 className="w-4 h-4" />
              Clean Up
            </button>
          )}

          {/* New Project Button */}
          <button
            onClick={onNewProject}
            className="flex items-center gap-2 px-4 py-2 bg-[#6C3BFF] hover:bg-[#5A2FE6] text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>
      </div>

      {/* Empty State */}
      {filteredSets.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Grid className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {sets.length === 0 ? 'No projects yet' : 'No matching projects'}
          </h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            {sets.length === 0 
              ? 'Start your first jewelry photography project to see your generated sets here'
              : 'Try adjusting your search criteria'
            }
          </p>
          {sets.length === 0 && (
            <button
              onClick={onNewProject}
              className="px-6 py-3 bg-[#6C3BFF] hover:bg-[#5A2FE6] text-white rounded-lg transition-colors"
            >
              Create Your First Project
            </button>
          )}
        </div>
      ) : (
        /* Content */
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredSets.map((set) => (
            <div
              key={set.id}
              className={`bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden hover:border-gray-600 transition-all group ${
                viewMode === 'list' ? 'flex gap-4 p-4' : ''
              }`}
            >
              {/* Thumbnail Grid */}
              <div className={viewMode === 'grid' ? 'p-4' : 'flex-shrink-0'}>
                <div className={`grid grid-cols-2 gap-1 ${viewMode === 'grid' ? 'aspect-square' : 'w-24 h-24'} rounded-lg overflow-hidden`}>
                  {set.generatedImages.slice(0, 4).map((image) => (
                    <SafeLibraryImage
                      key={image.id}
                      src={image.url}
                      alt={image.type}
                      className="w-full h-full"
                      onClick={() => setSelectedSet(set)}
                    />
                  ))}
                  {set.generatedImages.length > 4 && (
                    <div className="bg-gray-700/50 flex items-center justify-center text-xs text-gray-400">
                      +{set.generatedImages.length - 4}
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className={`flex-1 ${viewMode === 'grid' ? 'p-4 pt-0' : ''}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1 line-clamp-1">
                      {set.userPrompt}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(set.timestamp)}</span>
                      <span>•</span>
                      <span className="capitalize">{set.category}</span>
                      <span>•</span>
                      <span>{set.generatedImages.length} photos</span>
                      {set.model && (
                        <>
                          <span>•</span>
                          <span className="text-[#6C3BFF]">{set.model}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => setSelectedSet(set)}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-lg text-sm transition-colors"
                  >
                    <Eye className="w-3 h-3" />
                    View
                  </button>
                  <button
                    onClick={() => downloadSetAsZip(set)}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-lg text-sm transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(set.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-sm transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Set Detail Modal */}
      {selectedSet && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">{selectedSet.userPrompt}</h2>
                  <p className="text-gray-400 text-sm">
                    Generated on {formatDate(selectedSet.timestamp)} • {selectedSet.generatedImages.length} photos
                  </p>
                </div>
                <button
                  onClick={() => setSelectedSet(null)}
                  className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Original Reference Image */}
              {selectedSet.originalImage && (
                <div className="mb-8 p-4 bg-gray-700/30 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-4">Original Reference</h3>
                  <div className="flex gap-4">
                    <SafeLibraryImage
                      src={selectedSet.originalImage}
                      alt="Original reference"
                      className="w-32 h-32 rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                      <p className="text-gray-300 mb-2"><strong>User Description:</strong></p>
                      <p className="text-gray-400 text-sm mb-3">{selectedSet.userPrompt}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Model: {selectedSet.model}</span>
                        <span>•</span>
                        <span>Generated: {formatDate(selectedSet.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Generated Images */}
              <h3 className="text-lg font-semibold text-white mb-4">Generated Images ({selectedSet.generatedImages.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedSet.generatedImages.map((image) => (
                  <div key={image.id} className="space-y-3">
                    <SafeLibraryImage
                      src={image.url}
                      alt={image.type}
                      className="w-full aspect-square rounded-lg"
                    />
                    <div>
                      <h4 className="font-medium text-white capitalize">{image.type}</h4>
                      <p className="text-sm text-gray-400">{image.description}</p>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => downloadImage(image.url, `${selectedSet.category}-${image.type}.jpg`)}
                          className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                        >
                          Download
                        </button>
                        <button
                          onClick={() => window.open(image.url, '_blank')}
                          className="px-3 py-2 bg-[#6C3BFF] hover:bg-[#5A2FE6] text-white rounded-lg text-sm transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-white mb-2">Delete Project</h3>
            <p className="text-gray-400 text-sm mb-4">
              This will permanently delete this project and all generated photos. This action cannot be undone.
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
                data-delete-id={deleteConfirm}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
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
