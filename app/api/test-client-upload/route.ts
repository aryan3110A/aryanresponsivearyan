import { NextResponse } from 'next/server'
import { storage } from '@/lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export async function GET() {
  try {
    console.log('🧪 Testing client-side upload simulation...')
    
    // Create a simple test image (base64)
    const testImageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
    
    // Convert base64 to blob (simulating client-side process)
    const response = await fetch(testImageData)
    const blob = await response.blob()
    const file = new File([blob], 'test-image.png', { type: 'image/png' })
    
    console.log('📁 Test file created:', {
      name: file.name,
      size: file.size,
      type: file.type
    })

    // Create storage reference
    const timestamp = Date.now()
    const storagePath = `test-client-upload/${timestamp}_test-image.png`
    const storageRef = ref(storage, storagePath)

    console.log('📍 Storage path:', storagePath)

    // Upload metadata
    const metadata = {
      contentType: 'image/png',
      customMetadata: {
        'test': 'true',
        'uploadedAt': new Date().toISOString(),
        'source': 'test-client-upload'
      }
    }

    console.log('📤 Attempting to upload test image...')

    // Upload to Firebase Storage
    const uploadResult = await uploadBytes(storageRef, file, metadata)
    console.log('✅ Test upload successful:', uploadResult.metadata.fullPath)

    // Get download URL
    const downloadURL = await getDownloadURL(uploadResult.ref)
    console.log('🔗 Test image URL:', downloadURL)

    return NextResponse.json({
      success: true,
      message: 'Client-side upload simulation successful',
      uploadResult: {
        fullPath: uploadResult.metadata.fullPath,
        size: uploadResult.metadata.size,
        contentType: uploadResult.metadata.contentType
      },
      downloadURL,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Client-side upload simulation failed:', error)
    
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
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 