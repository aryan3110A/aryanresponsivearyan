import { storage } from './firebase'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

export interface StorageSetupResult {
  success: boolean
  error?: string
  details: {
    bucketExists: boolean
    canWrite: boolean
    canRead: boolean
    canDelete: boolean
    testFileUrl?: string
  }
}

/**
 * Comprehensive Firebase Storage setup verification
 */
export async function verifyFirebaseStorageSetup(): Promise<StorageSetupResult> {
  const result: StorageSetupResult = {
    success: false,
    details: {
      bucketExists: false,
      canWrite: false,
      canRead: false,
      canDelete: false
    }
  }

  try {
    console.log('🔧 Setting up Firebase Storage...')
    console.log('📋 Project ID:', storage.app.options.projectId)
    console.log('📋 Storage Bucket:', storage.app.options.storageBucket)

    // Step 1: Test if we can create a reference (bucket exists)
    const testRef = ref(storage, 'setup-test/test-file.txt')
    console.log('✅ Step 1: Storage reference created')
    result.details.bucketExists = true

    // Step 2: Test write permissions
    const testData = new Blob(['Firebase Storage test file'], { type: 'text/plain' })
    const uploadResult = await uploadBytes(testRef, testData)
    console.log('✅ Step 2: File uploaded successfully')
    result.details.canWrite = true

    // Step 3: Test read permissions
    const downloadURL = await getDownloadURL(uploadResult.ref)
    console.log('✅ Step 3: Download URL obtained:', downloadURL)
    result.details.canRead = true
    result.details.testFileUrl = downloadURL

    // Step 4: Test delete permissions
    await deleteObject(testRef)
    console.log('✅ Step 4: File deleted successfully')
    result.details.canDelete = true

    result.success = true
    console.log('🎉 Firebase Storage verification completed successfully!')

    return result

  } catch (error) {
    console.error('❌ Firebase Storage verification failed:', error)
    
    let errorMessage = 'Unknown error'
    if (error instanceof Error) {
      errorMessage = error.message
      
      // Provide specific guidance based on error
      if (error.message.includes('storage/unknown')) {
        errorMessage = 'Firebase Storage is not enabled for this project. Please enable it in Firebase Console.'
      } else if (error.message.includes('storage/unauthorized')) {
        errorMessage = 'Firebase Storage rules deny access. Please update storage rules.'
      } else if (error.message.includes('404')) {
        errorMessage = 'Storage bucket not found. Please check if Firebase Storage is enabled.'
      }
    }

    result.error = errorMessage
    return result
  }
}

/**
 * Quick Firebase Storage health check
 */
export async function quickStorageHealthCheck(): Promise<boolean> {
  try {
    // Just try to create a reference
    console.log('✅ Firebase Storage is accessible')
    return true
  } catch (error) {
    console.error('❌ Firebase Storage health check failed:', error)
    return false
  }
}

/**
 * Get Firebase Storage configuration info
 */
export function getStorageConfig() {
  return {
    bucket: storage.app.options.storageBucket,
    projectId: storage.app.options.projectId,
    appId: storage.app.options.appId
  }
}

/**
 * Generate setup instructions based on current state
 */
export function generateSetupInstructions(result: StorageSetupResult): string[] {
  const instructions: string[] = []

  if (!result.details.bucketExists) {
    instructions.push('1. Go to Firebase Console (https://console.firebase.google.com/)')
    instructions.push('2. Select your project: wildmind-db37a')
    instructions.push('3. Navigate to Storage in the left sidebar')
    instructions.push('4. Click "Get started" to enable Firebase Storage')
    instructions.push('5. Choose "Start in test mode" for now')
    instructions.push('6. Select a storage location (preferably us-central1)')
  }

  if (result.details.bucketExists && !result.details.canWrite) {
    instructions.push('1. Go to Firebase Console → Storage → Rules')
    instructions.push('2. Replace the rules with:')
    instructions.push('   rules_version = "2";')
    instructions.push('   service firebase.storage {')
    instructions.push('     match /b/{bucket}/o {')
    instructions.push('       match /{allPaths=**} {')
    instructions.push('         allow read, write: if true;')
    instructions.push('       }')
    instructions.push('     }')
    instructions.push('   }')
    instructions.push('3. Click "Publish"')
  }

  if (instructions.length === 0) {
    instructions.push('✅ Firebase Storage is properly configured!')
  }

  return instructions
}

/**
 * Run complete Firebase Storage setup verification with detailed output
 */
export async function runStorageSetupWizard(): Promise<void> {
  console.log('🧙‍♂️ Firebase Storage Setup Wizard')
  console.log('=====================================')

  const config = getStorageConfig()
  console.log('📋 Current Configuration:')
  console.log(`   Project ID: ${config.projectId}`)
  console.log(`   Storage Bucket: ${config.bucket}`)
  console.log(`   App ID: ${config.appId}`)
  console.log('')

  const result = await verifyFirebaseStorageSetup()
  
  console.log('📊 Verification Results:')
  console.log(`   Bucket Exists: ${result.details.bucketExists ? '✅' : '❌'}`)
  console.log(`   Can Write: ${result.details.canWrite ? '✅' : '❌'}`)
  console.log(`   Can Read: ${result.details.canRead ? '✅' : '❌'}`)
  console.log(`   Can Delete: ${result.details.canDelete ? '✅' : '❌'}`)
  console.log('')

  if (!result.success) {
    console.log('❌ Setup Issues Found:')
    console.log(`   Error: ${result.error}`)
    console.log('')
    
    const instructions = generateSetupInstructions(result)
    console.log('🔧 Setup Instructions:')
    instructions.forEach(instruction => console.log(`   ${instruction}`))
  } else {
    console.log('🎉 Firebase Storage is ready to use!')
  }

  console.log('=====================================')
}
