'use client'

import React, { useState } from 'react'
import { ChatMessage, GeneratedImage } from '../page'
import { MessageSquare, Images, Trash2, Plus, Calendar, ImageIcon, Bot, User } from 'lucide-react'
import Image from 'next/image'

interface SidebarProps {
  currentView: 'chat' | 'library'
  setCurrentView: (view: 'chat' | 'library') => void
  onClearChat: () => void
  onNewChat: () => void
  chatMessages: ChatMessage[]
  generatedImages: GeneratedImage[]
  isClearingChat?: boolean
}

export default function Sidebar({
  currentView,
  setCurrentView,
  onClearChat,
  onNewChat,
  chatMessages,
  generatedImages,
  isClearingChat = false
}: SidebarProps) {
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  // Group messages by date
  const groupMessagesByDate = (messages: ChatMessage[]) => {
    const groups: { [key: string]: ChatMessage[] } = {}
    
    messages.forEach(message => {
      const date = message.timestamp.toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
    })
    
    return groups
  }

  // Group images by date
  const groupImagesByDate = (images: GeneratedImage[]) => {
    const groups: { [key: string]: GeneratedImage[] } = {}
    
    images.forEach(image => {
      const date = image.timestamp.toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(image)
    })
    
    return groups
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      })
    }
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const messageGroups = groupMessagesByDate(chatMessages)
  const imageGroups = groupImagesByDate(generatedImages)

  return (
    <div className="h-full bg-gray-900/50 border-r border-gray-700/50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-[#6C3BFF] to-[#412399] rounded-lg flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-white">AI Studio</h2>
            <p className="text-xs text-gray-400">Image Generation</p>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex bg-gray-800/50 rounded-lg p-1">
          <button
            onClick={() => setCurrentView('chat')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm transition-all ${
              currentView === 'chat'
                ? 'bg-[#6C3BFF] text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Chat
          </button>
          <button
            onClick={() => setCurrentView('library')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm transition-all ${
              currentView === 'library'
                ? 'bg-[#6C3BFF] text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Images className="w-4 h-4" />
            Library
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {currentView === 'chat' ? (
          <div className="p-4">
            {/* New Chat Button */}
            <button
              onClick={onNewChat}
              className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-[#6C3BFF] to-[#412399] hover:from-[#5A2FE6] hover:to-[#3A1F8A] rounded-lg transition-all transform hover:scale-[1.02] mb-4"
            >
              <Plus className="w-4 h-4 text-white" />
              <span className="text-white font-medium">New Chat</span>
            </button>

            {/* Chat History */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-300">Chat History</h3>
                {chatMessages.length > 0 && (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    disabled={isClearingChat}
                    className="p-1 text-gray-500 hover:text-red-400 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
                    title={isClearingChat ? "Clearing chat history..." : "Clear chat history"}
                  >
                    {isClearingChat ? (
                      <div className="w-4 h-4 border-2 border-gray-600 border-t-red-400 rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>

              {Object.keys(messageGroups).length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No conversations yet</p>
                  <p className="text-gray-600 text-xs">Start chatting to see your history</p>
                </div>
              ) : (
                Object.entries(messageGroups)
                  .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                  .map(([date, messages]) => (
                    <div key={date} className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(date)}</span>
                      </div>
                      
                      <div className="space-y-1">
                        {messages
                          .filter(msg => msg.type === 'user') // Only show user messages as conversation starters
                          .slice(0, 5) // Limit to 5 per day
                          .map((message) => (
                            <div
                              key={message.id}
                              className="p-2 bg-gray-800/30 hover:bg-gray-700/30 rounded-lg cursor-pointer transition-colors"
                            >
                              <div className="flex items-start gap-2">
                                <User className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-gray-300 truncate">
                                    {truncateText(message.content, 50)}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-gray-500">
                                      {message.timestamp.toLocaleTimeString('en-US', { 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                      })}
                                    </span>
                                    {message.imageUrl && (
                                      <ImageIcon className="w-3 h-3 text-gray-500" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        ) : (
          <div className="p-4">
            {/* Library Stats */}
            <div className="bg-gray-800/30 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Images className="w-4 h-4 text-[#6C3BFF]" />
                <span className="text-sm font-medium text-white">Your Library</span>
              </div>
              <p className="text-xs text-gray-400">
                {generatedImages.length} images generated
              </p>
            </div>

            {/* Recent Images */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-300">Recent Images</h3>
              
              {Object.keys(imageGroups).length === 0 ? (
                <div className="text-center py-8">
                  <ImageIcon className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No images yet</p>
                  <p className="text-gray-600 text-xs">Generate images to build your library</p>
                </div>
              ) : (
                Object.entries(imageGroups)
                  .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                  .slice(0, 3) // Show only last 3 days
                  .map(([date, images]) => (
                    <div key={date} className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(date)}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        {images.slice(0, 4).map((image) => (
                          <div
                            key={image.id}
                            className="aspect-square bg-gray-800/30 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#6C3BFF]/50 transition-all"
                            onClick={() => setCurrentView('library')}
                          >
                            <Image
                              src={image.imageUrl}
                              alt={truncateText(image.prompt, 30)}
                              width={100}
                              height={100}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      
                      {images.length > 4 && (
                        <p className="text-xs text-gray-500 text-center">
                          +{images.length - 4} more images
                        </p>
                      )}
                    </div>
                  ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Clear Chat Confirmation */}
      {showClearConfirm && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-white mb-2">Clear Chat History</h3>
            <p className="text-gray-400 text-sm mb-4">
              This will permanently delete all chat messages. Generated images in your library will be preserved.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearChat()
                  setShowClearConfirm(false)
                }}
                disabled={isClearingChat}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isClearingChat && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {isClearingChat ? 'Clearing...' : 'Clear'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
