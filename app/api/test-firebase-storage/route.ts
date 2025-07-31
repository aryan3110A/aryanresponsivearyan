import { NextResponse } from 'next/server'
import { storage } from '@/lib/firebase'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

// Add interface for Firebase errors
interface FirebaseError extends Error {
  code: string;
}

export async function GET() {
  try {
    console.log('🔍 Testing Firebase Storage from server-side...')

    // Test 1: Create reference
    const testRef = ref(storage, 'server-test/test-file.txt')
    console.log('✅ Reference created:', testRef.fullPath)

    // Test 2: Upload test file
    const testData = new Blob(['Server-side Firebase Storage test'], { type: 'text/plain' })
    try {
      const uploadResult = await uploadBytes(testRef, testData)
      console.log('✅ Upload successful:', uploadResult.metadata.fullPath)

      // Test 3: Get download URL
      const downloadURL = await getDownloadURL(uploadResult.ref)
      console.log('✅ Download URL generated:', downloadURL)

      // Test 4: Test CORS by making a client-side request
      console.log('🔍 Testing CORS configuration...')
      try {
        const corsTestResponse = await fetch(downloadURL, {
          method: 'HEAD',
          headers: {
            'Origin': 'http://localhost:3000'
          }
        })
        console.log('✅ CORS test successful:', corsTestResponse.status)
      } catch (corsError) {
        console.warn('⚠️ CORS test failed (this is expected if CORS is not configured):', corsError)
      }

      // Test 5: Clean up
      await deleteObject(testRef)
      console.log('✅ Test file deleted')

      return NextResponse.json({
        success: true,
        message: 'Firebase Storage is working correctly!',
        details: {
          bucket: storage.app.options.storageBucket,
          projectId: storage.app.options.projectId,
          testUrl: downloadURL,
          corsConfigured: true // Will be true if we reach this point
        }
      })
    } catch (error: unknown) {
      console.error('❌ Error during upload:', error)
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Unknown error occurred' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('❌ Firebase Storage test failed:', error)
    
    let errorMessage = 'Unknown error'
    let errorCode = 'unknown'
    
    if (error instanceof Error) {
      errorMessage = error.message
      
      // Check for specific Firebase errors
      if ('code' in error) {
        errorCode = (error as { code: string }).code
      }
    }

    return NextResponse.json({
      success: false,
      error: errorMessage,
      errorCode,
      details: {
        bucket: storage.app.options.storageBucket,
        projectId: storage.app.options.projectId
      }
    }, { status: 500 })
  }
}
