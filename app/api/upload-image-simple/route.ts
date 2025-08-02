import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Simple upload API called')
    
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      console.error('❌ No file provided in request')
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    console.log('📁 File received:', {
      name: file.name,
      size: file.size,
      type: file.type
    })

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error('❌ Invalid file type:', file.type)
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      console.error('❌ File too large:', file.size, 'bytes')
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      )
    }

    console.log('📤 Starting simple upload to Firebase Storage')

    // Create storage reference
    const timestamp = Date.now()
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const storagePath = `reference-images/${timestamp}_${sanitizedFileName}`
    const storageRef = ref(storage, storagePath)

    console.log('📍 Storage path:', storagePath)

    // Upload metadata
    const metadata = {
      contentType: file.type,
      customMetadata: {
        'originalName': file.name,
        'uploadedAt': new Date().toISOString(),
        'source': 'user-upload'
      }
    }

    console.log('📤 Uploading to Firebase Storage...')

    // Upload to Firebase Storage
    const uploadResult = await uploadBytes(storageRef, file, metadata)
    console.log('✅ Upload successful:', uploadResult.metadata.fullPath)

    // Get download URL
    const downloadURL = await getDownloadURL(uploadResult.ref)
    console.log('🔗 Firebase Storage URL:', downloadURL)

    return NextResponse.json({
      success: true,
      url: downloadURL,
      path: storagePath
    })

  } catch (error) {
    console.error('❌ Simple upload error:', error)
    
    // Provide more detailed error information
    let errorMessage = 'Unknown error occurred'
    if (error instanceof Error) {
      errorMessage = error.message
      
      // Check for specific Firebase errors
      if (error.message.includes('storage/unauthorized')) {
        errorMessage = 'Firebase Storage: Unauthorized access. Please check storage rules.'
      } else if (error.message.includes('storage/unknown')) {
        errorMessage = 'Firebase Storage: Configuration error. Please check Firebase setup.'
      } else if (error.message.includes('storage/quota-exceeded')) {
        errorMessage = 'Firebase Storage: Storage quota exceeded.'
      } else if (error.message.includes('storage/bucket-not-found')) {
        errorMessage = 'Firebase Storage: Bucket not found. Please check storage bucket configuration.'
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
} 