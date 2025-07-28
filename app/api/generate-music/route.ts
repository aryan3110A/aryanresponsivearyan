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

interface MusicGenerationResponse {
  data: {
    status: number
    audio: string
  }
  trace_id: string
  base_resp: {
    status_code: number
    status_msg: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, lyrics, model = "music-1.5", audio_setting } = body

    // Validate required fields
    if (!prompt || !lyrics) {
      return NextResponse.json(
        { error: 'Prompt and lyrics are required' },
        { status: 400 }
      )
    }

    // Validate prompt length (10-300 characters)
    if (prompt.length < 10 || prompt.length > 300) {
      return NextResponse.json(
        { error: 'Prompt must be between 10-300 characters' },
        { status: 400 }
      )
    }

    // Validate lyrics length (10-600 characters)
    if (lyrics.length < 10 || lyrics.length > 600) {
      return NextResponse.json(
        { error: 'Lyrics must be between 10-600 characters' },
        { status: 400 }
      )
    }

    // Default audio settings
    const defaultAudioSettings = {
      sample_rate: 44100,
      bitrate: 256000,
      format: "mp3"
    }

    const musicRequest: MusicGenerationRequest = {
      model,
      prompt,
      lyrics,
      audio_setting: audio_setting || defaultAudioSettings,
      output_format: "hex"
    }

    console.log('Making request to MiniMax API:', {
      model: musicRequest.model,
      prompt: musicRequest.prompt,
      lyrics: musicRequest.lyrics.substring(0, 100) + '...',
      audio_setting: musicRequest.audio_setting
    })

    // Make request to MiniMax API
    const response = await fetch('https://api.minimax.io/v1/music_generation', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MINIMAX_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(musicRequest),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('MiniMax API error:', response.status, errorText)
      return NextResponse.json(
        { error: `MiniMax API error: ${response.status}` },
        { status: response.status }
      )
    }

    const musicResponse: MusicGenerationResponse = await response.json()

    // Check for API errors
    if (musicResponse.base_resp.status_code !== 0) {
      console.error('MiniMax API returned error:', musicResponse.base_resp)
      return NextResponse.json(
        { error: musicResponse.base_resp.status_msg },
        { status: 400 }
      )
    }

    // Check if music generation is complete
    if (musicResponse.data.status === 1) {
      return NextResponse.json({
        status: 'in_progress',
        message: 'Music generation in progress. Please try again in a few moments.',
        trace_id: musicResponse.trace_id
      })
    }

    // Convert hex audio data to base64 for easier handling
    const hexAudio = musicResponse.data.audio
    const audioBuffer = Buffer.from(hexAudio, 'hex')
    const base64Audio = audioBuffer.toString('base64')

    return NextResponse.json({
      status: 'completed',
      audio_data: base64Audio,
      audio_format: musicRequest.audio_setting.format,
      trace_id: musicResponse.trace_id,
      message: 'Music generated successfully'
    })

  } catch (error) {
    console.error('Music generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
