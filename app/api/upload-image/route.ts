import { NextRequest, NextResponse } from 'next/server'
import { uploadToFirebaseStorage } from '@/lib/firebaseStorage'

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Image upload API called')

    // Test Firebase Storage connection first
    try {
      const { testFirebaseStorage } = await import('@/lib/firebase')
      const storageTest = await testFirebaseStorage()
      console.log('🔥 Firebase Storage test result:', storageTest)

      if (!storageTest.success) {
        console.error('❌ Firebase Storage not properly configured:', storageTest.error)
        return NextResponse.json(
          { error: `Firebase Storage error: ${storageTest.error}` },
          { status: 500 }
        )
      }
    } catch (storageTestError) {
      console.error('❌ Firebase Storage test failed:', storageTestError)
    }

    // Get the form data
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      console.error('❌ No file provided in form data')
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    console.log('📁 File received:', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    })

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error('❌ Invalid file type:', file.type)
      return NextResponse.json(
        { error: `File must be an image. Received: ${file.type}` },
        { status: 400 }
      )
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      console.error('❌ File too large:', file.size, 'bytes')
      return NextResponse.json(
        { error: `File size must be less than 10MB. Received: ${(file.size / 1024 / 1024).toFixed(2)}MB` },
        { status: 400 }
      )
    }

    if (file.size === 0) {
      console.error('❌ Empty file received')
      return NextResponse.json(
        { error: 'File is empty' },
        { status: 400 }
      )
    }

    console.log('✅ File validation passed, uploading to Firebase Storage...')

    // Upload to Firebase Storage
    const uploadResult = await uploadToFirebaseStorage(file, 'model-references')

    console.log('📤 Upload result:', {
      success: uploadResult.success,
      hasUrl: !!uploadResult.url,
      hasPath: !!uploadResult.path,
      error: uploadResult.error
    })

    if (!uploadResult.success) {
      console.error('❌ Upload failed:', uploadResult.error)
      return NextResponse.json(
        { error: uploadResult.error || 'Upload failed' },
        { status: 500 }
      )
    }

    if (!uploadResult.url) {
      console.error('❌ Upload succeeded but no URL returned')
      return NextResponse.json(
        { error: 'Upload succeeded but no download URL was generated' },
        { status: 500 }
      )
    }

    console.log('✅ Image uploaded successfully:', uploadResult.url)

    return NextResponse.json({
      success: true,
      imageUrl: uploadResult.url,
      path: uploadResult.path,
      fileName: file.name,
      fileSize: file.size
    })

  } catch (error) {
    console.error('❌ Error in upload API:', error)

    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    const errorStack = error instanceof Error ? error.stack : undefined

    console.error('❌ Error details:', {
      message: errorMessage,
      stack: errorStack
    })

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// Test endpoint
export async function GET() {
  try {
    // Test Firebase Storage connection
    const { testFirebaseStorage } = await import('@/lib/firebase')
    const storageTest = await testFirebaseStorage()

    return NextResponse.json({
      message: 'Image upload API is working',
      timestamp: new Date().toISOString(),
      maxFileSize: '10MB',
      supportedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      firebaseStorage: {
        connected: storageTest.success,
        bucket: storageTest.bucket,
        error: storageTest.error
      }
    })
  } catch (error) {
    return NextResponse.json({
      message: 'Image upload API is working',
      timestamp: new Date().toISOString(),
      maxFileSize: '10MB',
      supportedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      firebaseStorage: {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    })
  }
}
