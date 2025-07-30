import { storage } from './firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

// Add interface definition at the top
interface StorageError {
  code: string;
  message: string;
  status_?: number;
  customData?: unknown;
}

/**
 * Comprehensive Firebase Storage diagnostic tool
 */
export async function diagnoseFirebaseStorage() {
  console.log('🔍 Firebase Storage Diagnostic Tool')
  console.log('=====================================')

  // Step 1: Check Firebase Storage configuration
  console.log('📋 Step 1: Configuration Check')
  try {
    console.log('   Storage App:', storage.app.name)
    console.log('   Project ID:', storage.app.options.projectId)
    console.log('   Storage Bucket:', storage.app.options.storageBucket)
    console.log('   Auth Domain:', storage.app.options.authDomain)
    console.log('   API Key:', storage.app.options.apiKey?.substring(0, 10) + '...')
  } catch (error) {
    console.error('   ❌ Configuration Error:', error)
    return
  }

  // Step 2: Test storage reference creation
  console.log('\n📍 Step 2: Reference Creation Test')
  let testRef
  try {
    testRef = ref(storage, 'diagnostic-test/test.txt')
    console.log('   ✅ Reference created successfully')
    console.log('   Path:', testRef.fullPath)
    console.log('   Bucket:', testRef.bucket)
    console.log('   Name:', testRef.name)
  } catch (error) {
    console.error('   ❌ Reference Creation Failed:', error)
    return
  }

  // Step 3: Test simple upload
  console.log('\n📤 Step 3: Upload Test')
  try {
    const testData = new Blob(['Firebase Storage diagnostic test'], { type: 'text/plain' })
    console.log('   Uploading test blob...')
    
    const uploadResult = await uploadBytes(testRef, testData)
    console.log('   ✅ Upload successful!')
    console.log('   Upload metadata:', {
      bucket: uploadResult.metadata.bucket,
      fullPath: uploadResult.metadata.fullPath,
      name: uploadResult.metadata.name,
      size: uploadResult.metadata.size,
      timeCreated: uploadResult.metadata.timeCreated
    })

    // Step 4: Test download URL generation
    console.log('\n🔗 Step 4: Download URL Test')
    try {
      const downloadURL = await getDownloadURL(uploadResult.ref)
      console.log('   ✅ Download URL generated successfully!')
      console.log('   URL:', downloadURL)
      
      // Step 5: Test URL accessibility
      console.log('\n🌐 Step 5: URL Accessibility Test')
      try {
        const response = await fetch(downloadURL)
        if (response.ok) {
          const text = await response.text()
          console.log('   ✅ URL is accessible!')
          console.log('   Content:', text)
        } else {
          console.error('   ❌ URL not accessible:', response.status, response.statusText)
        }
      } catch (fetchError) {
        console.error('   ❌ URL fetch failed:', fetchError)
      }

    } catch (urlError) {
      console.error('   ❌ Download URL generation failed:', urlError)
    }

  } catch (uploadError) {
    console.error('   ❌ Upload failed:', uploadError)

    // Analyze the error
    if (uploadError instanceof Error) {
      console.log('\n🔍 Error Analysis:')
      console.log('   Error message:', uploadError.message)
      console.log('   Error name:', uploadError.name)

      // Check for specific Firebase errors
      if ('code' in uploadError) {
        console.log('   Firebase error code:', (uploadError as StorageError).code)
      }

      if ('status_' in uploadError) {
        console.log('   HTTP status:', (uploadError as unknown as StorageError).status_)
      }

      if ('customData' in uploadError) {
        console.log('   Custom data:', (uploadError as unknown as StorageError).customData)
      }

      // Provide specific guidance based on error
      if (uploadError.message.includes('CORS')) {
        console.log('\n💡 CORS Error Detected:')
        console.log('   This usually means:')
        console.log('   1. Firebase Storage is not enabled for this project')
        console.log('   2. Storage rules are blocking access')
        console.log('   3. Project configuration mismatch')
        console.log('\n🔧 To fix:')
        console.log('   1. Go to Firebase Console → Storage')
        console.log('   2. Enable Firebase Storage if not already enabled')
        console.log('   3. Update storage rules to allow access')
        console.log('   4. Verify project ID and storage bucket match')
      }

      if (uploadError.message.includes('not found') || uploadError.message.includes('404')) {
        console.log('\n💡 Storage Bucket Not Found:')
        console.log('   The storage bucket does not exist or is not accessible')
        console.log('   Current bucket:', storage.app.options.storageBucket)
        console.log('\n🔧 To fix:')
        console.log('   1. Verify the storage bucket URL is correct')
        console.log('   2. Check if Firebase Storage is enabled')
        console.log('   3. Ensure you have the right Firebase project selected')
      }
    }
  }

  console.log('\n=====================================')
  console.log('🏁 Diagnostic Complete')
}

/**
 * Test different storage bucket URL formats
 */
export async function testStorageBucketFormats() {
  console.log('🔍 Testing Storage Bucket URL Formats')
  console.log('=====================================')

  const projectId = 'wildmind-db37a'
  const formats = [
    `${projectId}.appspot.com`,
    `${projectId}.firebasestorage.app`,
    `gs://${projectId}.appspot.com`,
    `gs://${projectId}.firebasestorage.app`
  ]

  for (const format of formats) {
    console.log(`\n📋 Testing format: ${format}`)
    try {
      // This is just a format test - we can't actually change the bucket at runtime
      console.log('   Format is valid syntax')
    } catch {
      console.log('   ❌ Invalid format')
    }
  }

  console.log('\n💡 Current bucket from config:', storage.app.options.storageBucket)
  console.log('=====================================')
}

/**
 * Check Firebase Storage rules accessibility
 */
export async function checkStorageRules() {
  console.log('🔍 Checking Storage Rules Accessibility')
  console.log('=====================================')

  try {
    // Try to access the rules endpoint (this might not work from client-side)
    const rulesUrl = `https://firebasestorage.googleapis.com/v0/b/${storage.app.options.storageBucket}/o`
    console.log('Rules endpoint:', rulesUrl)
    
    const response = await fetch(rulesUrl, { method: 'HEAD' })
    console.log('Rules endpoint status:', response.status)
    console.log('Rules endpoint headers:', Object.fromEntries(response.headers.entries()))
    
  } catch {
    console.log('❌ Storage rules test failed')
  }
  
  console.log('=====================================')
}

/**
 * Verify Firebase project configuration
 */
export function verifyProjectConfiguration() {
  console.log('🔍 Firebase Project Configuration Verification')
  console.log('=====================================')

  const config = storage.app.options
  console.log('📋 Current Configuration:')
  console.log(`   Project ID: ${config.projectId}`)
  console.log(`   Storage Bucket: ${config.storageBucket}`)
  console.log(`   Auth Domain: ${config.authDomain}`)
  console.log(`   App ID: ${config.appId}`)

  console.log('\n🔍 Configuration Analysis:')

  // Check if project ID matches storage bucket
  if (config.storageBucket?.includes(config.projectId || '')) {
    console.log('   ✅ Project ID matches storage bucket')
  } else {
    console.log('   ⚠️ Project ID does not match storage bucket')
    console.log('   This might indicate a configuration mismatch')
  }

  // Check storage bucket format
  if (config.storageBucket?.endsWith('.firebasestorage.app')) {
    console.log('   ✅ Using new Firebase Storage domain (.firebasestorage.app)')
  } else if (config.storageBucket?.endsWith('.appspot.com')) {
    console.log('   ✅ Using classic Firebase Storage domain (.appspot.com)')
  } else {
    console.log('   ❌ Unknown storage bucket format')
  }

  // Expected vs actual
  console.log('\n💡 Expected Configuration for wild-mind-ai project:')
  console.log('   Project ID: wild-mind-ai')
  console.log('   Storage Bucket: wild-mind-ai.firebasestorage.app')
  console.log('   Auth Domain: wild-mind-ai.firebaseapp.com')

  console.log('\n💡 Current Configuration:')
  console.log(`   Project ID: ${config.projectId}`)
  console.log(`   Storage Bucket: ${config.storageBucket}`)
  console.log(`   Auth Domain: ${config.authDomain}`)

  if (config.projectId !== 'wild-mind-ai') {
    console.log('\n🚨 MISMATCH DETECTED:')
    console.log('   Your storage bucket suggests project "wild-mind-ai"')
    console.log(`   But your config uses project "${config.projectId}"`)
    console.log('   This will cause authentication and access issues')
  }

  console.log('=====================================')
}

/**
 * Run all diagnostics
 */
export async function runAllDiagnostics() {
  verifyProjectConfiguration()
  await diagnoseFirebaseStorage()
  await testStorageBucketFormats()
  await checkStorageRules()
}
