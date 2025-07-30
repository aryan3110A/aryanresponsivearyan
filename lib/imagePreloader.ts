/**
 * Image preloading utilities for better UX
 */

interface PreloadResult {
  success: boolean
  url: string
  error?: string
}

/**
 * Preloads an image and returns a promise
 */
export function preloadImage(url: string): Promise<PreloadResult> {
  return new Promise((resolve) => {
    const img = new Image()
    
    img.onload = () => {
      console.log('✅ Image preloaded successfully:', url)
      resolve({ success: true, url })
    }
    
    img.onerror = (error) => {
      console.error('❌ Image preload failed:', url, error)
      resolve({ 
        success: false, 
        url, 
        error: 'Failed to preload image' 
      })
    }
    
    img.src = url
  })
}

/**
 * Preloads multiple images in parallel
 */
export async function preloadImages(urls: string[]): Promise<PreloadResult[]> {
  console.log(`🔄 Preloading ${urls.length} images...`)
  
  const promises = urls.map(url => preloadImage(url))
  const results = await Promise.all(promises)
  
  const successful = results.filter(r => r.success).length
  const failed = results.filter(r => !r.success).length
  
  console.log(`📊 Preload results: ${successful} successful, ${failed} failed`)
  
  return results
}

/**
 * Preloads images with a delay between each request
 */
export async function preloadImagesWithDelay(
  urls: string[], 
  delayMs: number = 100
): Promise<PreloadResult[]> {
  console.log(`🔄 Preloading ${urls.length} images with ${delayMs}ms delay...`)
  
  const results: PreloadResult[] = []
  
  for (const url of urls) {
    const result = await preloadImage(url)
    results.push(result)
    
    // Add delay between requests to avoid overwhelming the server
    if (delayMs > 0) {
      await new Promise(resolve => setTimeout(resolve, delayMs))
    }
  }
  
  const successful = results.filter(r => r.success).length
  const failed = results.filter(r => !r.success).length
  
  console.log(`📊 Sequential preload results: ${successful} successful, ${failed} failed`)
  
  return results
}

/**
 * Creates an image cache for frequently accessed images
 */
class ImageCache {
  private cache = new Map<string, HTMLImageElement>()
  private maxSize: number
  
  constructor(maxSize: number = 50) {
    this.maxSize = maxSize
  }
  
  async preload(url: string): Promise<boolean> {
    if (this.cache.has(url)) {
      console.log('📋 Image already cached:', url)
      return true
    }
    
    try {
      const result = await preloadImage(url)
      
      if (result.success) {
        // Create and cache the image element
        const img = new Image()
        img.src = url
        
        // Manage cache size
        if (this.cache.size >= this.maxSize) {
          const firstKey = this.cache.keys().next().value
          if (firstKey) {
            this.cache.delete(firstKey)
          }
        }
        
        this.cache.set(url, img)
        console.log(`💾 Image cached (${this.cache.size}/${this.maxSize}):`, url)
        return true
      }
      
      return false
    } catch (error) {
      console.error('❌ Failed to cache image:', url, error)
      return false
    }
  }
  
  has(url: string): boolean {
    return this.cache.has(url)
  }
  
  get(url: string): HTMLImageElement | undefined {
    return this.cache.get(url)
  }
  
  clear(): void {
    this.cache.clear()
    console.log('🗑️ Image cache cleared')
  }
  
  getStats(): { size: number; maxSize: number; urls: string[] } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      urls: Array.from(this.cache.keys())
    }
  }
}

// Global image cache instance
export const imageCache = new ImageCache(100)

/**
 * Preloads and caches an image
 */
export async function preloadAndCache(url: string): Promise<boolean> {
  return await imageCache.preload(url)
}

/**
 * Checks if an image is cached
 */
export function isImageCached(url: string): boolean {
  return imageCache.has(url)
}

/**
 * Gets cache statistics
 */
export function getCacheStats() {
  return imageCache.getStats()
}

/**
 * Clears the image cache
 */
export function clearImageCache(): void {
  imageCache.clear()
}

/**
 * Validates if a URL is a Firebase Storage URL
 */
export function isFirebaseStorageUrl(url: string): boolean {
  return url.includes('firebasestorage.googleapis.com') || 
         url.includes('storage.googleapis.com')
}

/**
 * Preloads Firebase Storage images (these should always work)
 */
export async function preloadFirebaseImages(urls: string[]): Promise<PreloadResult[]> {
  const firebaseUrls = urls.filter(isFirebaseStorageUrl)
  
  if (firebaseUrls.length === 0) {
    return []
  }
  
  console.log(`🔥 Preloading ${firebaseUrls.length} Firebase Storage images...`)
  
  // Firebase Storage is reliable, so we can preload in parallel
  return await preloadImages(firebaseUrls)
}
