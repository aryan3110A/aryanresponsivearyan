# MiniMax Video Generation Integration

This directory contains the complete integration of MiniMax video generation API into the text-to-video component.

## Features Implemented

### 1. MiniMax API Integration
- **API Route**: `/api/generate-video` - Handles video generation requests
- **Models Supported**:
  - MiniMax-Hailuo-02 (1080P, max 10s duration)
  - T2V-01-Director (720P, 25FPS, camera control)
  - I2V-01-Director (720P, 25FPS, image-to-video)
  - S2V-01 (720P, 25FPS, subject reference)

### 2. Video Settings Panel
- **Model Selection**: Choose from available MiniMax models
- **Duration Control**: 6s or 10s (model dependent)
- **Camera Movements**: 15 different camera movements for Director models
- **Image Upload**: First frame image support for I2V models
- **Resolution Mapping**: Automatic resolution selection based on aspect ratio

### 3. Video Display
- **Native Video Player**: Proper HTML5 video elements with controls
- **Download Support**: Download generated videos as MP4 files
- **Responsive Design**: Works on desktop and mobile devices

### 4. File Storage
- **Local Storage**: Videos are downloaded and stored in `/public/static/videos/`
- **Static Serving**: Videos served as static files from the server

## Configuration

### Environment Variables
Add to your `.env.local` file:
```
NEXT_PUBLIC_MINMAX_API_KEY=your_minimax_api_key_here
```

### Next.js Configuration
The `next.config.js` has been updated to allow MiniMax domains for video downloads.

## API Usage

### Basic Text-to-Video
```javascript
const response = await fetch('/api/generate-video', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: "A woman drinking coffee",
    model: "MiniMax-Hailuo-02",
    selectedAspectRatio: "16:9",
    selectedQuality: "HD",
    duration: 6
  })
})
```

### Image-to-Video
```javascript
const response = await fetch('/api/generate-video', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: "A woman drinking coffee",
    model: "I2V-01-Director",
    first_frame_image: "data:image/jpeg;base64,/9j/4AAQ...",
    duration: 6
  })
})
```

### Camera Movement Control
```javascript
const response = await fetch('/api/generate-video', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: "A woman drinking coffee [Pan left], [Zoom in]",
    model: "T2V-01-Director",
    duration: 6
  })
})
```

## Camera Movements

For Director models, you can use these camera movement instructions:
- `[Truck left]`, `[Truck right]`
- `[Pan left]`, `[Pan right]`
- `[Push in]`, `[Pull out]`
- `[Pedestal up]`, `[Pedestal down]`
- `[Tilt up]`, `[Tilt down]`
- `[Zoom in]`, `[Zoom out]`
- `[Shake]`
- `[Tracking shot]`
- `[Static shot]`

## File Structure

```
texttovideo/
├── componennts/
│   ├── InputSection.tsx       # Main input and video display
│   ├── SettingsPanel.tsx      # Settings panel with video options
│   ├── VideoSettings.tsx      # Video-specific settings component
│   └── videoModels.ts         # Model configurations and helpers
├── page.tsx                   # Main page component
└── README.md                  # This file
```

## Error Handling

The integration includes comprehensive error handling:
- API key validation
- Task timeout handling (5 minutes)
- Download failure fallbacks
- User-friendly error messages

## Notes

1. **Group ID**: You may need to configure the `group_id` parameter based on your MiniMax account
2. **File Cleanup**: Consider implementing a cleanup mechanism for old video files
3. **Rate Limiting**: MiniMax API may have rate limits - implement appropriate handling
4. **File Size**: Generated videos can be large - consider compression or streaming options

## Testing

To test the integration:
1. Set up your MiniMax API key in `.env.local`
2. Start the development server
3. Navigate to the text-to-video page
4. Enter a prompt and generate a video
5. Check the `/public/static/videos/` directory for saved files
