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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, lyrics, model = "music-1.5", audio_setting, output_format = "hex" } = body

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

    // Validate output_format
    if (output_format && !["hex", "url"].includes(output_format)) {
      return NextResponse.json(
        { error: 'Output format must be either "hex" or "url"' },
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
      output_format
    }

    // Make initial request to MiniMax API (do not wait for completion)
    const response = await fetch(
      'https://api.minimax.io/v1/music_generation',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.MINIMAX_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(musicRequest),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `MiniMax API error: ${response.status} - ${errorText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    // Return trace_id and status
    return NextResponse.json({
      status: 'pending',
      trace_id: data.trace_id || data.data?.trace_id,
      status_msg: 'Music generation started. Poll status endpoint.'
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
