'use client'

import React, { useState, useEffect } from 'react'
import ChatInterface from './components/ChatInterface'
import Library from './components/Library'
import Sidebar from './components/Sidebar'
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc, getDocs, writeBatch } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { MessageSquare, Images, Menu, X } from 'lucide-react'

export interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  imageUrl?: string
  prompt?: string
  model?: string
  aspectRatio?: string
  seed?: number
  taskId?: string
}

export interface GeneratedImage {
  id: string
  imageUrl: string
  originalImageUrl?: string  // Original BFL URL (may expire)
  storagePath?: string       // Firebase Storage path
  prompt: string
  model: string
  aspectRatio: string
  seed?: number
  timestamp: Date
  taskId: string
  storedInFirebase?: boolean // Whether image is stored in Firebase
}

export default function InChatHistory() {
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedImageForEdit, setSelectedImageForEdit] = useState<GeneratedImage | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentView, setCurrentView] = useState<'chat' | 'library'>('chat')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [isClearingChat, setIsClearingChat] = useState(false)
  const [showImageNotice, setShowImageNotice] = useState(true)

  // Test Firebase connection
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('🔍 Testing Firebase connection...')
        const testDoc = await addDoc(collection(db, 'test'), {
          timestamp: new Date(),
          test: true
        })
        console.log('✅ Firebase connection successful:', testDoc.id)
        await deleteDoc(testDoc)
        console.log('🧹 Test document cleaned up')
      } catch (error) {
        console.error('❌ Firebase connection failed:', error)
      }
    }
    testConnection()
  }, [])

  // Load chat messages from Firestore
  useEffect(() => {
    console.log('🔥 Initializing Firestore connection for chat messages...')

    const q = query(collection(db, 'chatMessages'), orderBy('timestamp', 'asc'))
    const unsubscribe = onSnapshot(q,
      (querySnapshot) => {
        console.log(`📨 Loaded ${querySnapshot.size} chat messages from Firestore`)
        const messages: ChatMessage[] = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          messages.push({
            id: doc.id,
            ...data,
            timestamp: data.timestamp?.toDate() || new Date()
          } as ChatMessage)
        })
        setChatMessages(messages)
      },
      (error) => {
        console.error('❌ Error loading chat messages:', error)
      }
    )

    return () => unsubscribe()
  }, [])

  // Load generated images from Firestore
  useEffect(() => {
    console.log('🔥 Initializing Firestore connection for generated images...')

    const q = query(collection(db, 'generatedImages'), orderBy('timestamp', 'desc'))
    const unsubscribe = onSnapshot(q,
      (querySnapshot) => {
        console.log(`🖼️ Loaded ${querySnapshot.size} generated images from Firestore`)
        const images: GeneratedImage[] = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          images.push({
            id: doc.id,
            ...data,
            timestamp: data.timestamp?.toDate() || new Date()
          } as GeneratedImage)
        })
        setGeneratedImages(images)
      },
      (error) => {
        console.error('❌ Error loading generated images:', error)
      }
    )

    return () => unsubscribe()
  }, [])

  const addMessage = async (message: Omit<ChatMessage, 'id'>) => {
    try {
      // Clean the message object to remove undefined values
      const cleanMessage: Omit<ChatMessage, 'id'> = {
        type: message.type,
        content: message.content,
        timestamp: new Date()
      }

      // Only add optional fields if they have values
      if (message.imageUrl) {
        cleanMessage.imageUrl = message.imageUrl
      }
      if (message.prompt) {
        cleanMessage.prompt = message.prompt
      }
      if (message.model) {
        cleanMessage.model = message.model
      }
      if (message.aspectRatio) {
        cleanMessage.aspectRatio = message.aspectRatio
      }
      if (message.seed) {
        cleanMessage.seed = message.seed
      }
      if (message.taskId) {
        cleanMessage.taskId = message.taskId
      }

      await addDoc(collection(db, 'chatMessages'), cleanMessage)
      console.log('✅ Message added to Firestore')
    } catch (error) {
      console.error('❌ Error adding message:', error)
    }
  }

  const addGeneratedImage = async (image: Omit<GeneratedImage, 'id'>) => {
    try {
      // Clean the image object to remove undefined values
      const cleanImage: Omit<GeneratedImage, 'id'> = {
        imageUrl: image.imageUrl,
        prompt: image.prompt,
        model: image.model,
        aspectRatio: image.aspectRatio,
        timestamp: new Date(),
        taskId: image.taskId
      }

      // Only add seed if it has a value
      if (image.seed) {
        cleanImage.seed = image.seed
      }

      await addDoc(collection(db, 'generatedImages'), cleanImage)
      console.log('✅ Generated image added to Firestore')
    } catch (error) {
      console.error('❌ Error adding generated image:', error)
    }
  }

  const deleteImage = async (imageId: string) => {
    try {
      await deleteDoc(doc(db, 'generatedImages', imageId))
    } catch (error) {
      console.error('Error deleting image:', error)
    }
  }

  const clearChat = async () => {
    try {
      setIsClearingChat(true)
      console.log('🗑️ Clearing chat history...')

      // Get all chat messages
      const messagesQuery = query(collection(db, 'chatMessages'))
      const querySnapshot = await getDocs(messagesQuery)

      if (querySnapshot.empty) {
        console.log('📭 No messages to clear')
        setIsClearingChat(false)
        return
      }

      // Delete all messages in batches (Firestore batch limit is 500)
      const batchSize = 500
      const batches = []

      for (let i = 0; i < querySnapshot.docs.length; i += batchSize) {
        const batch = writeBatch(db)
        const batchDocs = querySnapshot.docs.slice(i, i + batchSize)

        batchDocs.forEach((doc) => {
          batch.delete(doc.ref)
        })

        batches.push(batch.commit())
      }

      // Execute all batches
      await Promise.all(batches)

      console.log(`✅ Cleared ${querySnapshot.size} chat messages from Firestore`)

      // Clear local state
      setChatMessages([])

    } catch (error) {
      console.error('❌ Error clearing chat history:', error)
    } finally {
      setIsClearingChat(false)
    }
  }

  const newChat = () => {
    console.log('🆕 Starting new chat...')

    // Clear any selected image for edit
    setSelectedImageForEdit(null)

    // Reset generating state
    setIsGenerating(false)

    // Switch to chat view
    setCurrentView('chat')

    // Note: We don't clear chatMessages here because they're managed by Firestore
    // If user wants to clear history, they can use the Clear Chat function

    console.log('✅ New chat session started')
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden`}>
        <Sidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          onClearChat={clearChat}
          onNewChat={newChat}
          chatMessages={chatMessages}
          generatedImages={generatedImages}
          isClearingChat={isClearingChat}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-700/50 bg-black/20 backdrop-blur-sm">
          <div className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#6C3BFF] to-[#412399] rounded-xl flex items-center justify-center">
                  {currentView === 'chat' ? (
                    <MessageSquare className="w-5 h-5 text-white" />
                  ) : (
                    <Images className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">
                    {currentView === 'chat' ? 'AI Image Chat' : 'Image Library'}
                  </h1>
                  <p className="text-gray-400 text-sm">
                    {currentView === 'chat' 
                      ? 'Generate images with Flux Kontext models' 
                      : `${generatedImages.length} generated images`
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-3">
              {/* Jewelry Studio Link */}
              <a
                href="/view/imagelibrary"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg transition-all transform hover:scale-[1.02] text-sm font-medium"
              >
                <span className="text-lg">💎</span>
                Jewelry Studio
              </a>

              <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-1">
                <button
                  onClick={() => setCurrentView('chat')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    currentView === 'chat'
                      ? 'bg-[#6C3BFF] text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat
                </button>
                <button
                  onClick={() => setCurrentView('library')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    currentView === 'library'
                      ? 'bg-[#6C3BFF] text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <Images className="w-4 h-4" />
                  Library
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {currentView === 'chat' ? (
            <ChatInterface
              messages={chatMessages}
              onAddMessage={addMessage}
              onAddGeneratedImage={addGeneratedImage}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
              selectedImageForEdit={selectedImageForEdit}
              onClearSelectedImage={() => setSelectedImageForEdit(null)}
              onClearChat={clearChat}
            />
          ) : (
            <Library
              images={generatedImages}
              onDeleteImage={deleteImage}
              selectedImageForEdit={selectedImageForEdit}
              onSelectImageForEdit={setSelectedImageForEdit}
              onSwitchToChat={() => setCurrentView('chat')}
            />
          )}
        </div>

        {/* Image Loading Info Banner */}
        {showImageNotice && generatedImages.length > 0 && (
          <div className="fixed bottom-4 left-4 right-4 lg:left-auto lg:w-96 bg-amber-900/20 border border-amber-500/30 rounded-lg p-3 backdrop-blur-sm z-30">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-black font-bold">!</span>
              </div>
              <div className="flex-1 text-sm">
                <p className="text-amber-200 font-medium mb-1">Image Loading Notice</p>
                <p className="text-amber-300/80 text-xs leading-relaxed">
                  Generated images may show as unavailable due to expired links. This is normal -
                  the images are safely stored in your browser. Use the retry button or regenerate if needed.
                </p>
              </div>
              <button
                onClick={() => setShowImageNotice(false)}
                className="text-amber-400 hover:text-amber-300 text-lg leading-none transition-colors"
                title="Dismiss notice"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
