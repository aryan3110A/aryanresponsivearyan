import { NextRequest, NextResponse } from 'next/server'

// MinMax API configuration
const API_KEY = process.env.MINIMAX_API_KEY
const API_BASE_URL = 'https://api.minimax.io/v1'

interface MusicGenerationRequest {
  model: string
  prompt: string
  lyrics: string
  audio_setting: {
    sample_rate: number
    bitrate: number
    format: string
  }
  output_format?: string
}

interface JobData { 
  audio_data: string; 
  audio_format: string; 
  audio_url?: string;
}
interface JobStatus { 
  status: 'pending' | 'completed' | 'failed'; 
  data?: JobData; 
  error?: string; 
  task_id?: string;
}
const jobStatus = new Map<string, JobStatus>()

// Note: GroupId extraction not needed for music API as it's synchronous

// Real MinMax music generation API call (synchronous)
async function generateMusic(musicRequest: MusicGenerationRequest, traceId: string) {
  try {
    console.log(`[${traceId}] [generateMusic] Starting MinMax music generation...`)
    
    if (!API_KEY) {
      throw new Error('MinMax API key not configured')
    }

    // Prepare the request payload for MinMax music API
    const payload = {
      model: musicRequest.model,
      prompt: musicRequest.prompt,
      lyrics: musicRequest.lyrics,
      audio_setting: {
        sample_rate: musicRequest.audio_setting.sample_rate,
        bitrate: musicRequest.audio_setting.bitrate,
        format: musicRequest.audio_setting.format
      }
    }

    console.log(`[${traceId}] [generateMusic] Request payload:`, payload)

    // Make the API call (synchronous)
    const response = await fetch(`${API_BASE_URL}/music_generation`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`MinMax API error: ${response.status} - ${errorText}`)
    }

    const responseData = await response.json()
    console.log(`[${traceId}] [generateMusic] API Response:`, responseData)

    // Check for API errors
    if (responseData.base_resp && responseData.base_resp.status_code !== 0) {
      throw new Error(`MinMax API error: ${responseData.base_resp.status_msg}`)
    }

    // Check if we have audio data
    if (responseData.data && responseData.data.audio) {
      const audioData = responseData.data.audio
      
      jobStatus.set(traceId, {
        status: 'completed',
        data: { 
          audio_data: audioData, 
          audio_format: musicRequest.audio_setting.format
        }
      })
      console.log(`[${traceId}] [generateMusic] Music generation completed successfully!`)
    } else {
      throw new Error('No audio data received from MinMax API')
    }

  } catch (err) {
    console.error(`[${traceId}] [generateMusic] Job failed:`, err)
    jobStatus.set(traceId, { status: 'failed', error: String(err) })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('[POST] Received request body:', JSON.stringify(body, null, 2))
    const { prompt, lyrics, model = "music-1.5", audio_setting } = body

    // Validate required fields
    if (!prompt || !lyrics) {
      console.log('[POST] Missing required fields:', { prompt: !!prompt, lyrics: !!lyrics })
      return NextResponse.json({ error: 'Prompt and lyrics are required' }, { status: 400 })
    }
    if (prompt.length < 10 || prompt.length > 300) {
      console.log('[POST] Invalid prompt length:', prompt.length)
      return NextResponse.json({ error: 'Prompt must be between 10-300 characters' }, { status: 400 })
    }
    if (lyrics.length < 10 || lyrics.length > 600) {
      console.log('[POST] Invalid lyrics length:', lyrics.length)
      return NextResponse.json({ error: 'Lyrics must be between 10-600 characters' }, { status: 400 })
    }

    // Generate a trace_id for this job
    const traceId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    jobStatus.set(traceId, { status: 'pending' })
    console.log(`[POST] Starting music generation for traceId: ${traceId}`)

    // Execute the music generation (synchronous)
    await generateMusic({ prompt, lyrics, model, audio_setting }, traceId)

    // Get the result
    const job = jobStatus.get(traceId)
    if (!job || job.status === 'failed') {
      const error = job?.error || 'Music generation failed'
      jobStatus.delete(traceId)
      return NextResponse.json({ error }, { status: 500 })
    }

    if (job.status === 'completed' && job.data) {
      jobStatus.delete(traceId)
      return NextResponse.json({
        status: 'completed',
        audio_data: job.data.audio_data,
        audio_format: job.data.audio_format,
        trace_id: traceId,
        message: 'Music generated successfully'
      })
    }

    return NextResponse.json({ error: 'Unexpected response from music generation' }, { status: 500 })
  } catch (err) {
    console.error('[POST] Error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const traceId = searchParams.get('trace_id')

  if (!traceId) {
    return NextResponse.json({ status: 'ok', message: 'Music generation API is working', timestamp: new Date().toISOString() })
  }

  const job = jobStatus.get(traceId)
  console.log(`[GET] traceId: ${traceId}, job:`, job)
  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 })
  }

  if (job.status === 'completed') {
    jobStatus.delete(traceId) // Clean up
    if (!job.data) {
      return NextResponse.json({ error: 'Job data is missing' }, { status: 500 })
    }
    return NextResponse.json({
      status: 'completed',
      audio_data: job.data.audio_data,
      audio_format: job.data.audio_format,
      trace_id: traceId,
      message: 'Music generated successfully'
    })
  }

  if (job.status === 'failed') {
    jobStatus.delete(traceId) // Clean up
    return NextResponse.json({ error: job.error }, { status: 400 })
  }

  return NextResponse.json({ status: 'in_progress', message: 'Music generation in progress. Please try again in a few moments.', trace_id: traceId })
}
