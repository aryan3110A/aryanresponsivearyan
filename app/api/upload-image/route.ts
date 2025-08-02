import { NextRequest, NextResponse } from 'next/server'
import { uploadToFirebaseStorage } from '@/lib/firebaseStorage'
import { testFirebaseStorage } from '@/lib/firebase'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Upload API called')
    
    // Test Firebase Storage connection first
    const firebaseTest = await testFirebaseStorage()
    console.log('🔥 Firebase Storage test result:', firebaseTest)
    
    if (!firebaseTest.success) {
      console.error('❌ Firebase Storage connection failed:', firebaseTest.error)
      return NextResponse.json(
        { error: `Firebase Storage connection failed: ${firebaseTest.error}` },
        { status: 500 }
      )
    }

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

    console.log('📤 Starting server-side upload to Firebase Storage:', file.name, file.size, 'bytes')

    // Upload to Firebase Storage
    const uploadResult = await uploadToFirebaseStorage(file, 'reference-images')

    console.log('📊 Upload result:', uploadResult)

    if (uploadResult.success && uploadResult.url) {
      console.log('✅ Server-side upload successful:', uploadResult.url)
      return NextResponse.json({
        success: true,
        url: uploadResult.url,
        path: uploadResult.path
      })
    } else {
      console.error('❌ Server-side upload failed:', uploadResult.error)
      return NextResponse.json(
        { error: uploadResult.error || 'Upload failed' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('❌ Server-side upload error:', error)
    
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