'use client'

import React, { useState } from 'react'
import { ChatMessage } from '../page'
import { User, Bot, Download, Maximize, Copy, Check, Image as ImageIcon, Settings } from 'lucide-react'
import SafeImage from './SafeImage'

interface MessageBubbleProps {
  message: ChatMessage
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const [showFullscreen, setShowFullscreen] = useState(false)
  const [copied, setCopied] = useState(false)

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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(timestamp)
  }

  const isUser = message.type === 'user'

  return (
    <>
      <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser 
            ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
            : 'bg-gradient-to-r from-[#6C3BFF] to-[#412399]'
        }`}>
          {isUser ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Bot className="w-4 h-4 text-white" />
          )}
        </div>

        {/* Message Content */}
        <div className={`flex-1 max-w-3xl ${isUser ? 'text-right' : 'text-left'}`}>
          <div className={`inline-block p-4 rounded-2xl ${
            isUser 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-800 text-gray-100 border border-gray-700'
          }`}>
            {/* User's uploaded image */}
            {isUser && message.imageUrl && (
              <div className="mb-3">
                <div className="relative inline-block">
                  <SafeImage
                    src={message.imageUrl}
                    alt="User uploaded image"
                    width={200}
                    height={200}
                    className="rounded-lg object-cover max-w-xs cursor-pointer"
                    onClick={() => setShowFullscreen(true)}
                    fallbackText="Reference image unavailable"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={() => setShowFullscreen(true)}
                      className="p-1.5 bg-black/50 hover:bg-black/70 rounded-lg transition-colors"
                      title="View fullscreen"
                    >
                      <Maximize className="w-3 h-3 text-white" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-blue-200 mt-2">Reference image</p>
              </div>
            )}

            {/* Message text */}
            <p className="whitespace-pre-wrap">{message.content}</p>

            {/* Generation settings for user messages */}
            {isUser && (message.model || message.aspectRatio) && (
              <div className="mt-3 pt-3 border-t border-blue-500/30">
                <div className="flex items-center gap-2 text-xs text-blue-200">
                  <Settings className="w-3 h-3" />
                  <span>
                    {message.model?.replace('flux-', '').replace('-', ' ')} • {message.aspectRatio}
                    {message.seed && ` • Seed: ${message.seed}`}
                  </span>
                </div>
              </div>
            )}

            {/* Generated image for assistant messages */}
            {!isUser && message.imageUrl && (
              <div className="mt-3">
                <div className="relative inline-block">
                  <SafeImage
                    src={message.imageUrl}
                    alt="Generated image"
                    width={400}
                    height={400}
                    className="rounded-lg object-cover max-w-md cursor-pointer"
                    onClick={() => setShowFullscreen(true)}
                    fallbackText="Generated image unavailable"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={() => setShowFullscreen(true)}
                      className="p-1.5 bg-black/50 hover:bg-black/70 rounded-lg transition-colors"
                      title="View fullscreen"
                    >
                      <Maximize className="w-3 h-3 text-white" />
                    </button>
                    <button
                      onClick={() => downloadImage(message.imageUrl!, `generated-${Date.now()}.png`)}
                      className="p-1.5 bg-black/50 hover:bg-black/70 rounded-lg transition-colors"
                      title="Download image"
                    >
                      <Download className="w-3 h-3 text-white" />
                    </button>
                  </div>
                </div>

                {/* Image metadata */}
                {message.prompt && (
                  <div className="mt-3 p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-xs text-gray-400 mb-1">Prompt used:</p>
                        <p className="text-sm text-gray-200">{message.prompt}</p>
                        
                        {(message.model || message.aspectRatio) && (
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                            <ImageIcon className="w-3 h-3" />
                            <span>
                              {message.model?.replace('flux-', '').replace('-', ' ')} • {message.aspectRatio}
                              {message.seed && ` • Seed: ${message.seed}`}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={() => copyToClipboard(message.prompt!)}
                        className="p-1.5 hover:bg-gray-600/50 rounded transition-colors"
                        title="Copy prompt"
                      >
                        {copied ? (
                          <Check className="w-3 h-3 text-green-400" />
                        ) : (
                          <Copy className="w-3 h-3 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Timestamp */}
          <p className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {formatTimestamp(message.timestamp)}
          </p>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {showFullscreen && message.imageUrl && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-full max-h-full">
            <SafeImage
              src={message.imageUrl}
              alt={isUser ? "User uploaded image" : "Generated image"}
              width={1200}
              height={1200}
              className="max-w-full max-h-full object-contain"
              fallbackText="Image unavailable in fullscreen"
            />
            
            {/* Close button */}
            <button
              onClick={() => setShowFullscreen(false)}
              className="absolute top-4 right-4 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
            >
              <Maximize className="w-6 h-6 text-white rotate-45" />
            </button>
            
            {/* Download button */}
            <button
              onClick={() => downloadImage(message.imageUrl!, `image-${Date.now()}.png`)}
              className="absolute top-4 left-4 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
            >
              <Download className="w-6 h-6 text-white" />
            </button>

            {/* Image info overlay */}
            {!isUser && message.prompt && (
              <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-4">
                <p className="text-white text-sm mb-2">{message.prompt}</p>
                <div className="flex items-center gap-4 text-xs text-gray-300">
                  <span>{message.model?.replace('flux-', '').replace('-', ' ')}</span>
                  <span>{message.aspectRatio}</span>
                  {message.seed && <span>Seed: {message.seed}</span>}
                  <span>{formatTimestamp(message.timestamp)}</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Click outside to close */}
          <div 
            className="absolute inset-0 -z-10"
            onClick={() => setShowFullscreen(false)}
          />
        </div>
      )}
    </>
  )
}
