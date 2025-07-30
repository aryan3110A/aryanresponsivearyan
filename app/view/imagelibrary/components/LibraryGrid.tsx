'use client'

import React, { useState } from 'react'
import { GeneratedSet } from '../page'
import { Eye, Download, Trash2, Calendar, Grid, List, Plus, Search } from 'lucide-react'
import Image from 'next/image'

interface LibraryGridProps {
  sets: GeneratedSet[]
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  onDeleteSet: (setId: string) => void
  onNewProject: () => void
}

export default function LibraryGrid({
  sets,
  viewMode,
  onViewModeChange,
  onDeleteSet,
  onNewProject
}: LibraryGridProps) {
  const [selectedSet, setSelectedSet] = useState<GeneratedSet | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const filteredSets = sets.filter(set =>
    set.userPrompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    set.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

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

  const downloadSetAsZip = async (set: GeneratedSet) => {
    // For now, download images individually
    set.generatedImages.forEach((image, index) => {
      setTimeout(() => {
        downloadImage(image.url, `${set.category}-${image.type}-${index + 1}.jpg`)
      }, index * 500)
    })
  }

  const handleDelete = (setId: string) => {
    onDeleteSet(setId)
    setDeleteConfirm(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Your Library</h1>
          <p className="text-gray-400">
            {filteredSets.length} of {sets.length} generated sets
          </p>
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
                    <Image
                      key={image.id}
                      src={image.url}
                      alt={image.type}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedSet.generatedImages.map((image) => (
                  <div key={image.id} className="space-y-3">
                    <Image
                      src={image.url}
                      alt={image.type}
                      width={400}
                      height={400}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-medium text-white capitalize">{image.type}</h4>
                      <p className="text-sm text-gray-400">{image.description}</p>
                      <button
                        onClick={() => downloadImage(image.url, `${selectedSet.category}-${image.type}.jpg`)}
                        className="mt-2 w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                      >
                        Download
                      </button>
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