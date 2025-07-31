# 🎵 Music Generation Testing Guide

## Local Testing Steps

### 1. **Start the Development Server**
```bash
npm run dev
```
This will start your app on `http://localhost:3000`

### 2. **Check Environment Variables**
Make sure your `.env.local` file contains:
```
MINIMAX_API_KEY=your_actual_api_key_here
```

### 3. **Test the Web Interface**
1. Navigate to `http://localhost:3000/view/musicgeneration/texttomusic`
2. Enter some lyrics (10-600 characters)
3. Click "Generate" button
4. Check the browser console for logs

### 4. **Test the API Directly**
Run the test script:
```bash
node test-music-local.js
```

### 5. **Manual API Testing with curl**
```bash
curl -X POST http://localhost:3000/api/generate-music \
  -H "Content-Type: application/json" \
  -d '{
    "model": "music-1.5",
    "prompt": "Generate music based on the provided lyrics",
    "lyrics": "This is a test song\nWith simple lyrics\nTo check if the API works",
    "audio_setting": {
      "sample_rate": 44100,
      "bitrate": 256000,
      "format": "mp3"
    },
    "output_format": "hex"
  }'
```

## What to Look For

### ✅ **Success Indicators:**
- API returns `status_code: 0`
- `audio_data` field contains hex string (for hex format)
- `audio_url` field contains URL (for url format)
- Request completes within 30 seconds
- Audio player appears on the web interface

### ❌ **Error Indicators:**
- `status_code` is not 0
- Error messages about timeouts
- API returns 408 (timeout) or 500 (server error)
- Request takes longer than 60 seconds

## Debugging Tips

### 1. **Check Console Logs**
Look for these messages in the browser console:
- "Starting music generation..."
- "Music generation completed successfully"
- Any error messages

### 2. **Check Network Tab**
In browser DevTools → Network tab:
- Look for the `/api/generate-music` request
- Check response status and body
- Check request/response timing

### 3. **Common Issues**

**Timeout Issues:**
- Try shorter lyrics (under 100 characters)
- Check if MINIMAX_API_KEY is correct
- Verify internet connection

**API Key Issues:**
- Ensure MINIMAX_API_KEY is set in `.env.local`
- Check if the API key is valid and has credits
- Try regenerating the API key

**CORS Issues:**
- Make sure you're testing on `localhost:3000`
- Check browser console for CORS errors

## Expected Behavior

### **Fast Generation (5-15 seconds):**
- Simple lyrics with basic structure
- Short prompts
- Standard audio settings

### **Slower Generation (15-30 seconds):**
- Complex lyrics with multiple sections
- Longer prompts
- High-quality audio settings

### **Timeout (30+ seconds):**
- Very long lyrics (500+ characters)
- Complex song structures
- Network issues

## Testing Different Scenarios

### 1. **Basic Test**
```json
{
  "lyrics": "Hello world\nThis is a test\nSimple lyrics\nFor testing"
}
```

### 2. **Structured Test**
```json
{
  "lyrics": "Verse one lyrics here\nMore verse content\n\nChorus lyrics here\nMore chorus content\n\nBridge lyrics here\nMore bridge content"
}
```

### 3. **Long Test**
```json
{
  "lyrics": "This is a longer song with multiple verses and choruses that should test the timeout handling and polling mechanism..."
}
```

## Vercel Deployment Testing

After deploying to Vercel:

1. **Test the live URL** (e.g., `https://your-app.vercel.app/view/musicgeneration/texttomusic`)
2. **Check Vercel Function Logs** in the Vercel dashboard
3. **Monitor for timeout errors** in the logs
4. **Test with different lyrics lengths** to ensure reliability

## Performance Expectations

- **Local Development:** 5-30 seconds
- **Vercel Production:** 10-45 seconds (due to cold starts)
- **Timeout Limit:** 60 seconds (configured in vercel.json)

## Troubleshooting

### If Local Testing Fails:
1. Check `.env.local` file
2. Verify MINIMAX_API_KEY is valid
3. Check internet connection
4. Try restarting the dev server

### If Vercel Deployment Fails:
1. Check Vercel function logs
2. Verify environment variables in Vercel dashboard
3. Test with shorter lyrics first
4. Check if the API key has sufficient credits 