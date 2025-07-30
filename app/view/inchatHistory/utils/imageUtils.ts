// Utility functions for handling image URLs and validation

export interface ImageValidationResult {
  isValid: boolean
  error?: string
  suggestion?: string
}

/**
 * Validates if an image URL is accessible
 */
export async function validateImageUrl(url: string): Promise<ImageValidationResult> {
  try {
    // Check if URL is valid
    new URL(url)
    
    // Check if it's a BFL delivery URL (these often expire)
    if (url.includes('delivery-us1.bfl.ai')) {
      return {
        isValid: false,
        error: 'BFL delivery URLs expire quickly',
        suggestion: 'This image link has expired. Try regenerating the image.'
      }
    }
    
    // Try to fetch the image
    const response = await fetch(url, { method: 'HEAD' })
    
    if (response.status === 403) {
      return {
        isValid: false,
        error: 'Access forbidden (403)',
        suggestion: 'The image link has expired or access is restricted.'
      }
    }
    
    if (response.status === 404) {
      return {
        isValid: false,
        error: 'Image not found (404)',
        suggestion: 'The image may have been deleted or moved.'
      }
    }
    
    if (!response.ok) {
      return {
        isValid: false,
        error: `HTTP ${response.status}`,
        suggestion: 'There was an error loading the image.'
      }
    }
    
    // Check content type
    const contentType = response.headers.get('content-type')
    if (contentType && !contentType.startsWith('image/')) {
      return {
        isValid: false,
        error: 'Invalid content type',
        suggestion: 'The URL does not point to a valid image.'
      }
    }
    
    return { isValid: true }
    
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      suggestion: 'Please check the image URL and try again.'
    }
  }
}

/**
 * Generates a placeholder image URL based on dimensions
 */
export function generatePlaceholderUrl(width: number, height: number, text?: string): string {
  const encodedText = encodeURIComponent(text || 'Image Unavailable')
  return `https://via.placeholder.com/${width}x${height}/374151/9CA3AF?text=${encodedText}`
}

/**
 * Checks if an image URL is likely to be expired
 */
export function isLikelyExpired(url: string): boolean {
  // BFL delivery URLs typically expire
  if (url.includes('delivery-us1.bfl.ai')) {
    return true
  }
  
  // URLs with expiration parameters
  if (url.includes('expires=') || url.includes('exp=')) {
    return true
  }
  
  // Signed URLs often have expiration
  if (url.includes('sig=') && url.includes('se=')) {
    return true
  }
  
  return false
}

/**
 * Extracts useful information from BFL URLs
 */
export function parseBflUrl(url: string): { taskId?: string; isExpired: boolean } {
  try {
    const urlObj = new URL(url)
    
    // Extract task ID from path
    const pathParts = urlObj.pathname.split('/')
    const taskId = pathParts.find(part => part.length > 10) // Likely task ID
    
    return {
      taskId,
      isExpired: isLikelyExpired(url)
    }
  } catch {
    return { isExpired: true }
  }
}

/**
 * Creates a retry URL with cache busting
 */
export function createRetryUrl(originalUrl: string, retryCount: number): string {
  try {
    const url = new URL(originalUrl)
    url.searchParams.set('retry', retryCount.toString())
    url.searchParams.set('t', Date.now().toString())
    return url.toString()
  } catch {
    return `${originalUrl}?retry=${retryCount}&t=${Date.now()}`
  }
}

/**
 * Downloads an image and converts it to base64
 */
export async function downloadImageAsBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status}`)
    }
    
    const blob = await response.blob()
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        const base64 = result.includes(',') ? result.split(',')[1] : result
        resolve(base64)
      }
      reader.onerror = () => reject(new Error('Failed to convert image to base64'))
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    throw new Error(`Image download failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
