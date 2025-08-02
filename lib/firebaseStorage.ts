import { storage } from './firebase'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

export interface ImageUploadResult {
  success: boolean
  url?: string
  error?: string
  path?: string
}

/**
 * Downloads an image from a URL and uploads it to Firebase Storage
 */
export async function downloadAndStoreImage(
  imageUrl: string,
  fileName: string,
  folder: string = 'generated-images'
): Promise<ImageUploadResult> {
  try {
    console.log('📥 Downloading image from:', imageUrl)

    // Download the image with proper headers
    const response = await fetch(imageUrl, {
      method: 'GET',
      headers: {
        'Accept': 'image/*',
        'User-Agent': 'Mozilla/5.0 (compatible; WildMind/1.0)'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status} ${response.statusText}`)
    }

    const blob = await response.blob()
    console.log('✅ Image downloaded, size:', blob.size, 'bytes, type:', blob.type)

    // Validate blob
    if (blob.size === 0) {
      throw new Error('Downloaded image is empty')
    }

    if (!blob.type.startsWith('image/')) {
      console.warn('⚠️ Blob type is not image:', blob.type, 'but continuing...')
    }

    // Create a reference to Firebase Storage
    const timestamp = Date.now()
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
    const storagePath = `${folder}/${timestamp}_${sanitizedFileName}`

    console.log('📤 Uploading to Firebase Storage:', storagePath)
    console.log('🔧 Storage config check - Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)

    const storageRef = ref(storage, storagePath)

    // Upload with metadata
    const metadata = {
      contentType: blob.type || 'image/png',
      customMetadata: {
        'originalUrl': imageUrl,
        'uploadedAt': new Date().toISOString(),
        'source': 'flux-api'
      }
    }

    // Upload the blob to Firebase Storage
    const uploadResult = await uploadBytes(storageRef, blob, metadata)
    console.log('✅ Upload successful:', uploadResult.metadata.fullPath)
    console.log('📊 Upload metadata:', uploadResult.metadata)

    // Get the download URL
    const downloadURL = await getDownloadURL(uploadResult.ref)
    console.log('🔗 Firebase Storage URL:', downloadURL)

    // Validate the URL format
    if (!downloadURL.includes('firebasestorage.googleapis.com')) {
      console.warn('⚠️ Unexpected Firebase Storage URL format:', downloadURL)
    }

    // Test the URL accessibility
    try {
      const testResponse = await fetch(downloadURL, { method: 'HEAD' })
      if (testResponse.ok) {
        console.log('✅ Firebase Storage URL is accessible')
      } else {
        console.warn('⚠️ Firebase Storage URL returned status:', testResponse.status)
      }
    } catch (testError) {
      console.warn('⚠️ Firebase Storage URL test failed:', testError)
    }

    return {
      success: true,
      url: downloadURL,
      path: storagePath
    }

  } catch (error) {
    console.error('❌ Error storing image:', error)

    // Provide more specific error messages
    let errorMessage = 'Unknown error occurred'

    if (error instanceof Error) {
      errorMessage = error.message

      // Check for specific Firebase Storage errors
      if (error.message.includes('storage/unauthorized')) {
        errorMessage = 'Firebase Storage: Unauthorized access. Please check storage rules.'
      } else if (error.message.includes('storage/unknown')) {
        errorMessage = 'Firebase Storage: Configuration error. Please check Firebase setup.'
      } else if (error.message.includes('storage/quota-exceeded')) {
        errorMessage = 'Firebase Storage: Storage quota exceeded.'
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error: Unable to download image from source.'
      }
    }

    return {
      success: false,
      error: errorMessage
    }
  }
}

/**
 * Uploads a File object directly to Firebase Storage
 */
export async function uploadToFirebaseStorage(
  file: File,
  folder: string = 'uploaded-images'
): Promise<ImageUploadResult> {
  try {
    console.log('📤 Uploading file to Firebase Storage:', file.name, file.size, 'bytes')

    // Validate file
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image')
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      throw new Error('File size must be less than 10MB')
    }

    // Create storage reference
    const timestamp = Date.now()
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const storagePath = `${folder}/${timestamp}_${sanitizedFileName}`
    const storageRef = ref(storage, storagePath)

    // Upload metadata
    const metadata = {
      contentType: file.type,
      customMetadata: {
        'originalName': file.name,
        'uploadedAt': new Date().toISOString(),
        'source': 'user-upload'
      }
    }

    // Upload to Firebase Storage
    const uploadResult = await uploadBytes(storageRef, file, metadata)
    console.log('✅ File upload successful:', uploadResult.metadata.fullPath)

    // Get download URL
    const downloadURL = await getDownloadURL(uploadResult.ref)
    console.log('🔗 Firebase Storage URL:', downloadURL)

    return {
      success: true,
      url: downloadURL,
      path: storagePath
    }

  } catch (error) {
    console.error('❌ Error uploading file:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Uploads a base64 image directly to Firebase Storage
 */
export async function uploadBase64Image(
  base64Data: string,
  fileName: string,
  folder: string = 'uploaded-images'
): Promise<ImageUploadResult> {
  try {
    console.log('📤 Uploading base64 image to Firebase Storage')

    // Convert base64 to blob
    const base64String = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data
    const mimeType = base64Data.includes(',') ? base64Data.split(',')[0].split(':')[1].split(';')[0] : 'image/png'

    const byteCharacters = atob(base64String)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: mimeType })

    console.log('✅ Base64 converted to blob, size:', blob.size, 'bytes')

    // Create storage reference
    const timestamp = Date.now()
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
    const storagePath = `${folder}/${timestamp}_${sanitizedFileName}`
    const storageRef = ref(storage, storagePath)

    // Upload to Firebase Storage
    const uploadResult = await uploadBytes(storageRef, blob)
    console.log('✅ Base64 upload successful:', uploadResult.metadata.fullPath)

    // Get download URL
    const downloadURL = await getDownloadURL(uploadResult.ref)
    console.log('🔗 Firebase Storage URL:', downloadURL)

    return {
      success: true,
      url: downloadURL,
      path: storagePath
    }

  } catch (error) {
    console.error('❌ Error uploading base64 image:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Deletes an image from Firebase Storage
 */
export async function deleteStoredImage(storagePath: string): Promise<boolean> {
  try {
    console.log('🗑️ Deleting image from Firebase Storage:', storagePath)
    
    const storageRef = ref(storage, storagePath)
    await deleteObject(storageRef)
    
    console.log('✅ Image deleted successfully')
    return true
    
  } catch (error) {
    console.error('❌ Error deleting image:', error)
    return false
  }
}

/**
 * Generates a unique filename for images
 */
export function generateImageFileName(prompt: string, model: string, extension: string = 'png'): string {
  const timestamp = Date.now()
  const promptSlug = prompt
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 50)
  
  const modelSlug = model.replace('flux-', '').replace('-', '_')
  
  return `${modelSlug}_${promptSlug}_${timestamp}.${extension}`
}

/**
 * Checks if a URL is a Firebase Storage URL
 */
export function isFirebaseStorageUrl(url: string): boolean {
  return url.includes('firebasestorage.googleapis.com') || url.includes('storage.googleapis.com')
}

/**
 * Extracts storage path from Firebase Storage URL
 */
export function extractStoragePathFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    const pathMatch = urlObj.pathname.match(/\/v0\/b\/[^\/]+\/o\/(.+)/)
    if (pathMatch) {
      return decodeURIComponent(pathMatch[1])
    }
    return null
  } catch {
    return null
  }
}

/**
 * Fixes Firebase Storage URLs to ensure they work properly
 */
export function fixFirebaseStorageUrl(url: string): string {
  if (!url) return url

  // If it's already a proper Firebase Storage URL, return as-is
  if (url.includes('firebasestorage.googleapis.com')) {
    return url
  }

  // If it's a gs:// URL, convert it
  if (url.startsWith('gs://')) {
    const bucketAndPath = url.replace('gs://', '')
    const [bucket, ...pathParts] = bucketAndPath.split('/')
    const path = pathParts.join('/')
    return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(path)}?alt=media`
  }

  return url
}

/**
 * Enhanced Firebase Storage URL validation
 */
export function isValidFirebaseStorageUrl(url: string): boolean {
  return url.includes('firebasestorage.googleapis.com') || url.startsWith('gs://')
}

/**
 * Migrates an existing image URL to Firebase Storage
 */
export async function migrateImageToStorage(
  originalUrl: string,
  prompt: string,
  model: string
): Promise<ImageUploadResult> {
  try {
    // Check if already a Firebase Storage URL
    if (isFirebaseStorageUrl(originalUrl)) {
      return {
        success: true,
        url: originalUrl,
        path: extractStoragePathFromUrl(originalUrl) || ''
      }
    }
    
    // Generate filename and migrate
    const fileName = generateImageFileName(prompt, model)
    return await downloadAndStoreImage(originalUrl, fileName)
    
  } catch (error) {
    console.error('❌ Error migrating image:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Migration failed'
    }
  }
}

/**
 * Downloads a video from a URL and uploads it to Firebase Storage
 */
export async function downloadAndStoreVideo(
  videoUrl: string,
  fileName: string,
  folder: string = 'generated-videos'
): Promise<ImageUploadResult> {
  try {
    console.log('📥 Downloading video from:', videoUrl)

    // Download the video with proper headers
    const response = await fetch(videoUrl, {
      method: 'GET',
      headers: {
        'Accept': 'video/*',
        'User-Agent': 'Mozilla/5.0 (compatible; WildMind/1.0)'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to download video: ${response.status} ${response.statusText}`)
    }

    const blob = await response.blob()
    console.log('✅ Video downloaded, size:', blob.size, 'bytes, type:', blob.type)

    // Validate blob
    if (blob.size === 0) {
      throw new Error('Downloaded video is empty')
    }

    if (!blob.type.startsWith('video/')) {
      console.warn('⚠️ Blob type is not video:', blob.type, 'but continuing...')
    }

    // Create a reference to Firebase Storage
    const timestamp = Date.now()
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
    const storagePath = `${folder}/${timestamp}_${sanitizedFileName}`

    console.log('📤 Uploading video to Firebase Storage:', storagePath)
    console.log('🔧 Storage config check - Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)

    const storageRef = ref(storage, storagePath)

    // Upload with metadata
    const metadata = {
      contentType: blob.type || 'video/mp4',
      customMetadata: {
        'originalUrl': videoUrl,
        'uploadedAt': new Date().toISOString(),
        'source': 'minimax-api',
        'fileType': 'video'
      }
    }

    // Upload the blob to Firebase Storage
    const uploadResult = await uploadBytes(storageRef, blob, metadata)
    console.log('✅ Video upload successful:', uploadResult.metadata.fullPath)
    console.log('📊 Upload metadata:', uploadResult.metadata)

    // Get the download URL
    const downloadURL = await getDownloadURL(uploadResult.ref)
    console.log('🔗 Firebase Storage URL:', downloadURL)

    // Validate the URL format
    if (!downloadURL.includes('firebasestorage.googleapis.com')) {
      console.warn('⚠️ Unexpected Firebase Storage URL format:', downloadURL)
    }

    // Test the URL accessibility
    try {
      const testResponse = await fetch(downloadURL, { method: 'HEAD' })
      if (testResponse.ok) {
        console.log('✅ Firebase Storage URL is accessible')
      } else {
        console.warn('⚠️ Firebase Storage URL returned status:', testResponse.status)
      }
    } catch (testError) {
      console.warn('⚠️ Firebase Storage URL test failed:', testError)
    }

    return {
      success: true,
      url: downloadURL,
      path: storagePath
    }

  } catch (error) {
    console.error('❌ Error storing video:', error)

    // Provide more specific error messages
    let errorMessage = 'Unknown error occurred'

    if (error instanceof Error) {
      errorMessage = error.message

      // Check for specific Firebase Storage errors
      if (error.message.includes('storage/unauthorized')) {
        errorMessage = 'Firebase Storage: Unauthorized access. Please check storage rules.'
      } else if (error.message.includes('storage/unknown')) {
        errorMessage = 'Firebase Storage: Configuration error. Please check Firebase setup.'
      } else if (error.message.includes('storage/quota-exceeded')) {
        errorMessage = 'Firebase Storage: Storage quota exceeded.'
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error: Unable to download video from source.'
      }
    }

    return {
      success: false,
      error: errorMessage
    }
  }
}

/**
 * Generates a unique filename for videos
 */
export function generateVideoFileName(fileId: string, extension: string = 'mp4'): string {
  const timestamp = Date.now()
  return `video_${fileId}_${timestamp}.${extension}`
}
