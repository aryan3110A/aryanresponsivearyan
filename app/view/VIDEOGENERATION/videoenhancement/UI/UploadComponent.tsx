"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Upload, X, FileImage, FileVideo } from "lucide-react"

interface UploadComponentProps {
  onFilesSelected: (files: File[]) => void
  title?: string
  description?: string
  supportedFormats?: string
  acceptedTypes?: string
  className?: string
}

export default function UploadComponent({ 
  onFilesSelected,
  title = "Upload",
  description = "Browse and chose the files you want to upload from your Image & Video",
  supportedFormats = "Supports: JPG, PNG, GIF, MP4, MOV, AVI",
  acceptedTypes = "image/*,video/*",
  className = ""
}: UploadComponentProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      const files = Array.from(e.dataTransfer.files).filter(
        (file) => file.type.startsWith("image/") || file.type.startsWith("video/"),
      )

      if (files.length > 0) {
        setUploadedFiles((prev) => [...prev, ...files])
        onFilesSelected(files)
      }
    },
    [onFilesSelected],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      if (files.length > 0) {
        setUploadedFiles((prev) => [...prev, ...files])
        onFilesSelected(files)
      }
    },
    [onFilesSelected],
  )

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Title Heading */}
      {title && <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>}

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
          isDragOver ? "border-blue-500 bg-blue-500/10" : "border-gray-600 hover:border-gray-500 hover:bg-gray-800/20"
        }`}
      >
        <Upload
          className={`w-8 h-8 mx-auto mb-3 transition-colors ${isDragOver ? "text-blue-400" : "text-gray-400"}`}
        />
        <p className={`text-sm transition-colors ${isDragOver ? "text-blue-300" : "text-gray-400"}`}>
          {isDragOver ? "Drop your files here" : description}
        </p>
        <p className="text-xs text-gray-500 mt-2">{supportedFormats}</p>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300">Uploaded Files:</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto scrollbar-hide">
            <style jsx>{`
              .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
              .scrollbar-hide::-webkit-scrollbar { display: none; }
            `}</style>
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-gray-800/30 rounded-lg">
                <div className="flex-shrink-0">
                  {file.type.startsWith("image/") ? (
                    <FileImage className="w-4 h-4 text-blue-400" />
                  ) : (
                    <FileVideo className="w-4 h-4 text-green-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{file.name}</p>
                  <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(index)
                  }}
                  className="flex-shrink-0 p-1 hover:bg-gray-700/50 rounded transition-colors"
                >
                  <X className="w-3 h-3 text-gray-400 hover:text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
