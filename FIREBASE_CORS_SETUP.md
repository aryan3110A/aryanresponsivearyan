# Firebase Storage CORS Configuration Guide

## 🚨 CRITICAL: The Root Cause

Your Firebase Storage images are timing out because **CORS (Cross-Origin Resource Sharing) is not configured** for your Firebase Storage bucket. This is why:

- ✅ **Image preloading works** (server-side fetch)
- ❌ **Browser display fails** (client-side CORS blocked)
- ⏰ **Images timeout** after 10 seconds

## 🔧 IMMEDIATE FIX: Configure CORS

### Method 1: Using Google Cloud Console (Recommended)

1. **Install Google Cloud SDK**: https://cloud.google.com/sdk/docs/install
2. **Authenticate with Google Cloud**:
   ```bash
   gcloud auth login
   ```
3. **Set your project**:
   ```bash
   gcloud config set project wild-mind-ai
   ```
4. **Apply CORS configuration**:
   ```bash
   gsutil cors set cors.json gs://wild-mind-ai.firebasestorage.app
   ```

### Method 2: Using Firebase CLI (Alternative)

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```
2. **Login to Firebase**:
   ```bash
   firebase login
   ```
3. **Set project**:
   ```bash
   firebase use wild-mind-ai
   ```
4. **Configure CORS** (requires Google Cloud SDK):
   ```bash
   gsutil cors set cors.json gs://wild-mind-ai.firebasestorage.app
   ```

### Method 3: Manual Configuration (If above fails)

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Select project**: `wild-mind-ai`
3. **Navigate to**: Cloud Storage → Buckets
4. **Find bucket**: `wild-mind-ai.firebasestorage.app`
5. **Click on bucket name**
6. **Go to**: Permissions tab
7. **Add CORS configuration** (if available in UI)

## 📋 CORS Configuration Explained

The `cors.json` file contains:

```json
[
  {
    "origin": ["*"],                    // Allow all origins (for development)
    "method": ["GET", "HEAD"],          // Allow GET and HEAD requests
    "maxAgeSeconds": 3600,              // Cache CORS preflight for 1 hour
    "responseHeader": [                 // Required headers
      "Content-Type",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Methods"
    ]
  }
]
```

## 🎯 Expected Results After CORS Setup

### ✅ Before CORS (Current Issue):
```
✅ Image preloaded successfully: https://firebasestorage.googleapis.com/...
⏰ Image loading timeout: https://firebasestorage.googleapis.com/...
```

### ✅ After CORS (Fixed):
```
✅ Image preloaded successfully: https://firebasestorage.googleapis.com/...
✅ Image loaded and displayed successfully
```

## 🔍 Verify CORS Configuration

After applying CORS, verify it works:

```bash
# Check current CORS configuration
gsutil cors get gs://wild-mind-ai.firebasestorage.app

# Test CORS with curl
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://firebasestorage.googleapis.com/v0/b/wild-mind-ai.firebasestorage.app/o/test
```

## 🚨 Important Notes

1. **CORS changes take 5-10 minutes** to propagate globally
2. **Clear browser cache** after applying CORS
3. **Hard refresh** your app (Ctrl+F5 / Cmd+Shift+R)
4. **For production**, restrict origins to your actual domain instead of `"*"`

## 🔧 Production CORS Configuration

For production, update `cors.json`:

```json
[
  {
    "origin": [
      "https://yourdomain.com",
      "https://www.yourdomain.com",
      "http://localhost:3000"
    ],
    "method": ["GET", "HEAD"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type"]
  }
]
```

## 🎯 Alternative Solutions (If CORS Setup Fails)

### Option 1: Proxy Images Through Next.js API

Create `/api/image-proxy/[...path].ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const imagePath = params.path.join('/')
  const imageUrl = `https://firebasestorage.googleapis.com/v0/b/wild-mind-ai.firebasestorage.app/o/${imagePath}?alt=media`
  
  try {
    const response = await fetch(imageUrl)
    const imageBuffer = await response.arrayBuffer()
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/png',
        'Cache-Control': 'public, max-age=31536000',
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Image not found' }, { status: 404 })
  }
}
```

### Option 2: Use Firebase Storage Download URLs

Ensure you're using proper download URLs with tokens:

```typescript
import { getDownloadURL } from 'firebase/storage'

// This generates URLs that work without CORS issues
const downloadURL = await getDownloadURL(storageRef)
```

## 🎉 Summary

**The image timeout issue is caused by missing CORS configuration on your Firebase Storage bucket.**

**To fix:**
1. **Install Google Cloud SDK**
2. **Run**: `gsutil cors set cors.json gs://wild-mind-ai.firebasestorage.app`
3. **Wait 5-10 minutes** for propagation
4. **Hard refresh** your app
5. **Test image generation** - should work perfectly!

**This is a one-time setup that will permanently fix the image loading issues.** 🚀
