# Firebase Storage CORS Fix for Image Uploads

## 🚨 Problem
The CORS error occurs when uploading images to Firebase Storage from the browser:
```
Access to XMLHttpRequest at 'https://firebasestorage.googleapis.com/v0/b/wildmind-db37a.firebasestorage.app/o?name=reference-images%2F1754131153020_reference-image.jpg' from origin 'http://localhost:3000' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: It does not have HTTP ok status.
```

## 🔧 Solution 1: Server-Side Upload (Implemented)

I've implemented a server-side upload solution that bypasses CORS issues entirely:

### ✅ What's Fixed:
1. **Created `/api/upload-image/route.ts`** - Server-side upload endpoint
2. **Updated `ImageUploader.tsx`** - Now uses server-side API instead of direct Firebase upload
3. **No CORS issues** - Uploads happen server-side, not client-side

### 🎯 How it works:
1. User selects image → Creates preview
2. User confirms upload → Sends to `/api/upload-image`
3. Server uploads to Firebase Storage → Returns URL
4. Client receives URL → Continues with generation

### ✅ Benefits:
- ✅ **No CORS issues** - Server-side uploads
- ✅ **Better security** - Server validates files
- ✅ **Consistent behavior** - Works in all environments
- ✅ **Error handling** - Proper validation and error messages

## 🔧 Solution 2: Fix Firebase Storage CORS (Alternative)

If you prefer direct client-side uploads, configure Firebase Storage CORS:

### Step 1: Update CORS Configuration
The `cors.json` file has been updated to include POST requests:

```json
[
  {
    "origin": ["*"],
    "method": ["GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS"],
    "maxAgeSeconds": 3600,
    "responseHeader": [
      "Content-Type",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Methods",
      "Access-Control-Allow-Headers",
      "Access-Control-Max-Age",
      "X-Requested-With",
      "Authorization",
      "Content-Length",
      "Cache-Control"
    ]
  }
]
```

### Step 2: Apply CORS Configuration
```bash
# Install Google Cloud SDK if not installed
# https://cloud.google.com/sdk/docs/install

# Authenticate
gcloud auth login

# Set project
gcloud config set project wildmind-db37a

# Apply CORS configuration
gsutil cors set cors.json gs://wildmind-db37a.firebasestorage.app
```

### Step 3: Verify CORS Configuration
```bash
# Check current CORS settings
gsutil cors get gs://wildmind-db37a.firebasestorage.app
```

## 🎯 Current Status

### ✅ Implemented (Recommended):
- **Server-side upload API** (`/api/upload-image`)
- **Updated ImageUploader** to use server-side upload
- **No CORS issues** - Uploads work immediately

### 🔄 Alternative (If needed):
- **Updated CORS configuration** in `cors.json`
- **Instructions** for applying CORS to Firebase Storage

## 🚀 Testing

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to Image Library:**
   - Go to `/view/imagelibrary`
   - Select "Jewelry" category
   - Upload an image

3. **Expected behavior:**
   - ✅ Image preview appears
   - ✅ Upload completes without CORS errors
   - ✅ Firebase Storage URL is returned
   - ✅ Generation process continues

## 🔍 Troubleshooting

### If server-side upload fails:
1. Check browser console for errors
2. Check server logs for detailed error messages
3. Verify Firebase configuration in `lib/firebase.ts`
4. Ensure environment variables are set correctly

### If you want to use direct Firebase uploads:
1. Apply the CORS configuration using gsutil
2. Wait 5-10 minutes for changes to propagate
3. Clear browser cache and hard refresh
4. Test upload functionality

## 📝 Environment Variables Required

Ensure these are set in your `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=wildmind-db37a
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=wildmind-db37a.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 🎉 Summary

The CORS issue has been resolved by implementing a **server-side upload solution**. This approach:

- ✅ **Eliminates CORS issues** completely
- ✅ **Provides better security** and validation
- ✅ **Works immediately** without additional configuration
- ✅ **Maintains all functionality** of the original upload system

The image upload in the Jewelry section should now work without any CORS errors! 