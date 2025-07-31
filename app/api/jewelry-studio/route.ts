import { NextRequest, NextResponse } from 'next/server'
import { downloadAndStoreImage, generateImageFileName } from '@/lib/firebaseStorage'

// Queue to manage multiple image generation requests
class GenerationQueue {
  private queue: Array<() => Promise<unknown>> = []
  private processing = false
  private maxConcurrent = 1 // Process one at a time to avoid rate limiting
  private delay = 2000 // 2 second delay between requests

  async add<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await task()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })
      this.process()
    })
  }

  private async process() {
    if (this.processing || this.queue.length === 0) return
    
    this.processing = true
    
    while (this.queue.length > 0) {
      const task = this.queue.shift()
      if (task) {
        try {
          await task()
          // Add delay between requests to avoid rate limiting
          if (this.queue.length > 0) {
            await new Promise(resolve => setTimeout(resolve, this.delay))
          }
        } catch (error) {
          console.error('Queue task failed:', error)
        }
      }
    }
    
    this.processing = false
  }
}

const generationQueue = new GenerationQueue()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      prompts, // Array of prompts for 5 different shots
      input_image,
      model = 'flux-kontext-pro',
      aspect_ratio = '1:1',
      output_format = 'png',
      prompt_upsampling = true,
      safety_tolerance = 2
    } = body

    // Validate required fields
    if (!prompts || !Array.isArray(prompts) || prompts.length === 0) {
      return NextResponse.json(
        { error: 'Prompts array is required' },
        { status: 400 }
      )
    }

    if (!input_image) {
      return NextResponse.json(
        { error: 'Input image is required' },
        { status: 400 }
      )
    }

    console.log(`🚀 Processing ${prompts.length} image generation requests`)

    // Process each prompt through the queue
    const results = []
    
    for (let i = 0; i < prompts.length; i++) {
      const prompt = prompts[i]
      console.log(`📝 Queuing request ${i + 1}/${prompts.length}`)
      
      try {
        const result = await generationQueue.add(async () => {
          return await generateSingleImage({
            prompt: prompt.prompt,
            input_image,
            model,
            aspect_ratio,
            output_format,
            prompt_upsampling,
            safety_tolerance,
            shotType: prompt.type,
            shotIndex: i + 1
          })
        })
        
        results.push({
          id: prompt.id,
          type: prompt.type,
          success: true,
          ...result
        })
        
        console.log(`✅ Completed request ${i + 1}/${prompts.length}`)
        
      } catch (error) {
        console.error(`❌ Failed request ${i + 1}/${prompts.length}:`, error)
        
        // Add placeholder result for failed generation
        results.push({
          id: prompt.id,
          type: prompt.type,
          success: false,
          error: error instanceof Error ? error.message : 'Generation failed',
          imageUrl: `https://picsum.photos/400/400?random=${i}&blur=1`, // Placeholder
          isPlaceholder: true
        })
      }
    }

    console.log(`🎉 Completed all ${prompts.length} requests`)

    return NextResponse.json({
      success: true,
      results,
      totalRequests: prompts.length,
      successfulRequests: results.filter(r => r.success).length,
      failedRequests: results.filter(r => !r.success).length,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Jewelry Studio API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function generateSingleImage({
  prompt,
  input_image,
  model,
  aspect_ratio,
  output_format,
  prompt_upsampling,
  safety_tolerance,
  shotType,
  shotIndex
}: {
  prompt: string
  input_image: string
  model: string
  aspect_ratio: string
  output_format: string
  prompt_upsampling: boolean
  safety_tolerance: number
  shotType: string
  shotIndex: number
}) {
  console.log(`🎯 Generating ${shotType} shot (${shotIndex})`)
  
  // Prepare request body for BFL API
  const requestBody = {
    prompt,
    input_image,
    aspect_ratio,
    output_format,
    prompt_upsampling,
    safety_tolerance
  }

  // Determine API endpoint
  const apiEndpoint = model === 'flux-kontext-max' 
    ? 'https://api.bfl.ai/v1/flux-kontext-max'
    : 'https://api.bfl.ai/v1/flux-kontext-pro'

  console.log(`🚀 Calling ${model} API for ${shotType}`)

  // Call BFL API
  const bflResponse = await fetch(apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-key': process.env.FLUX_API_KEY!,
    },
    body: JSON.stringify(requestBody),
  })

  if (!bflResponse.ok) {
    const errorData = await bflResponse.text()
    console.error(`BFL API Error for ${shotType}:`, bflResponse.status, errorData)
    throw new Error(`BFL API error: ${bflResponse.status} - ${errorData}`)
  }

  const data: { id?: string; polling_url?: string; image_urls?: string[]; error?: string } = await bflResponse.json()
  console.log(`✅ BFL API Response for ${shotType}:`, { id: data.id })

  if (!data.polling_url) {
    throw new Error('No polling URL received from BFL API')
  }
  const pollingUrl = data.polling_url

  // Start polling for result
  const pollResult = await pollForResult(pollingUrl, shotType)

  if (pollResult.error) {
    throw new Error(pollResult.error)
  }

  // Store image in Firebase Storage
  let permanentImageUrl = null
  let storagePath = null
  const originalImageUrl = pollResult.result?.sample || null

  if (originalImageUrl) {
    console.log(`💾 Storing ${shotType} image in Firebase Storage...`)
    const fileName = generateImageFileName(`${shotType}_${prompt}`, model)
    const storageResult = await downloadAndStoreImage(originalImageUrl, fileName)

    if (storageResult.success) {
      permanentImageUrl = storageResult.url!
      storagePath = storageResult.path
      console.log(`✅ ${shotType} image stored permanently:`, permanentImageUrl)
    } else {
      console.error(`❌ Failed to store ${shotType} image:`, storageResult.error)
      permanentImageUrl = originalImageUrl // Use original as fallback
    }
  } else {
    throw new Error(`No image generated for ${shotType}`)
  }

  return {
    imageUrl: permanentImageUrl,
    originalImageUrl,
    storagePath,
    shotType,
    prompt: prompt.substring(0, 100),
    model,
    metadata: {
      storedInFirebase: !!storagePath,
      isTemporaryUrl: !storagePath
    }
  }
}

// Polling function with shot type logging
async function pollForResult(pollingUrl: string, shotType: string, maxAttempts = 30, interval = 2000) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      console.log(`📊 Polling ${shotType} - attempt ${attempt + 1}/${maxAttempts}`)
      
      const response = await fetch(pollingUrl, {
        headers: {
          'x-key': process.env.FLUX_API_KEY!,
        },
      })

      if (!response.ok) {
        console.error(`Polling error for ${shotType}:`, response.status)
        continue
      }

      const data: { status: string; result?: { sample?: string; error?: string } } = await response.json()
      console.log(`📊 ${shotType} status:`, data.status)

      if (data.status === 'Ready') {
        console.log(`✅ ${shotType} generation complete!`)
        return { result: data.result }
      }

      if (data.status === 'Error' || data.status === 'Request Moderated') {
        console.error(`❌ ${shotType} generation failed:`, data.status)
        return { error: `${shotType} generation failed: ${data.status}` }
      }

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, interval))

    } catch (error) {
      console.error(`Polling attempt failed for ${shotType}:`, error)
      
      if (attempt === maxAttempts - 1) {
        return { error: `${shotType} polling failed after maximum attempts` }
      }
      
      await new Promise(resolve => setTimeout(resolve, interval))
    }
  }

  return { error: `${shotType} generation timed out` }
}
