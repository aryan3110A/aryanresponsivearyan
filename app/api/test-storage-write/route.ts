import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing Firebase Storage write access...')
    
    // Create a simple test file
    const testContent = 'This is a test file for Firebase Storage write access'
    const testBlob = new Blob([testContent], { type: 'text/plain' })
    const testFile = new File([testBlob], 'test-write-access.txt', { type: 'text/plain' })
    
    console.log('📁 Test file created:', {
      name: testFile.name,
      size: testFile.size,
      type: testFile.type
    })

    // Create storage reference
    const timestamp = Date.now()
    const storagePath = `test-write/${timestamp}_test-write-access.txt`
    const storageRef = ref(storage, storagePath)

    console.log('📍 Storage path:', storagePath)

    // Upload metadata
    const metadata = {
      contentType: 'text/plain',
      customMetadata: {
        'test': 'true',
        'uploadedAt': new Date().toISOString(),
        'source': 'test-write-access'
      }
    }

    console.log('📤 Attempting to upload test file...')

    // Upload to Firebase Storage
    const uploadResult = await uploadBytes(storageRef, testFile, metadata)
    console.log('✅ Test upload successful:', uploadResult.metadata.fullPath)

    // Get download URL
    const downloadURL = await getDownloadURL(uploadResult.ref)
    console.log('🔗 Test file URL:', downloadURL)

    return NextResponse.json({
      success: true,
      message: 'Firebase Storage write access test successful',
      uploadResult: {
        fullPath: uploadResult.metadata.fullPath,
        size: uploadResult.metadata.size,
        contentType: uploadResult.metadata.contentType
      },
      downloadURL,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Firebase Storage write test failed:', error)
    
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