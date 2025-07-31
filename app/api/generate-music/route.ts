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

    console.log('Making request to MiniMax API:', {
      model: musicRequest.model,
      prompt: musicRequest.prompt.substring(0, 50) + '...',
      lyrics: musicRequest.lyrics.substring(0, 50) + '...',
      audio_setting: musicRequest.audio_setting,
      output_format: musicRequest.output_format
    })

    // Make request to MiniMax API
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
      console.error('MiniMax API error:', response.status, errorText)
      return NextResponse.json(
        { error: `MiniMax API error: ${response.status} - ${errorText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('MiniMax API response:', JSON.stringify(data, null, 2))
    
    // Check for API errors
    if (data.base_resp?.status_code !== 0) {
      console.error('MiniMax API returned error:', data.base_resp)
      return NextResponse.json(
        { 
          status_code: data.base_resp.status_code,
          status_msg: data.base_resp.status_msg 
        },
        { status: 400 }
      )
    }

    // Check if generation is complete
    if (data.data?.status === 2) {
      console.log('Music generation completed successfully')
      
      if (output_format === "hex" && data.data.audio) {
        return NextResponse.json({
          status_code: 0,
          audio_data: data.data.audio,
          audio_format: musicRequest.audio_setting.format,
          trace_id: data.trace_id,
          status_msg: 'Music generated successfully'
        })
      } else if (output_format === "url") {
        // For URL format, we need to check if there's a URL in the response
        // Since the API doesn't seem to return URLs, we'll return the hex data anyway
        return NextResponse.json({
          status_code: 0,
          audio_data: data.data.audio,
          audio_format: musicRequest.audio_setting.format,
          trace_id: data.trace_id,
          status_msg: 'Music generated successfully'
        })
      }
    } else if (data.data?.status === 1) {
      // Still processing (though this shouldn't happen with MiniMax)
      return NextResponse.json({
        status: 'pending',
        trace_id: data.trace_id,
        status_msg: 'Music generation in progress'
      })
    }

    // Fallback error
    return NextResponse.json(
      { 
        status_code: 500,
        status_msg: 'Unexpected response from MiniMax API' 
      },
      { status: 500 }
    )

  } catch (error) {
    console.error('Music generation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
