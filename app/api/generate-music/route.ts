import { NextRequest, NextResponse } from 'next/server'

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

interface JobData { audio_data: string; audio_format: string; }
interface JobStatus { status: 'pending' | 'completed' | 'failed'; data?: JobData; error?: string; }
const jobStatus = new Map<string, JobStatus>()

// Simulate async music generation (replace with real API call)
async function generateMusic(musicRequest: MusicGenerationRequest, traceId: string) {
  try {
    console.log(`[${traceId}] [generateMusic] Starting music generation job...`)
    // Simulate long-running job (replace with real API call)
    await new Promise((resolve) => setTimeout(resolve, 10000))
    // Simulate result
    const fakeAudioData = btoa('FAKEAUDIO')
    jobStatus.set(traceId, {
      status: 'completed',
      data: { audio_data: fakeAudioData, audio_format: musicRequest.audio_setting.format }
    })
    console.log(`[${traceId}] [generateMusic] Job completed!`)
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
    console.log(`[POST] Starting background job for traceId: ${traceId}`)

    // Start the background job (do NOT await)
    generateMusic({ prompt, lyrics, model, audio_setting }, traceId)

    // Return immediately
    return NextResponse.json({ status: 'in_progress', trace_id: traceId, message: 'Music generation started.' })
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
