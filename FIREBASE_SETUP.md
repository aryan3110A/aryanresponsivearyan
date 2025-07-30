# Firebase Setup Guide for WildMind AI

## 1. Firebase Storage Rules

Copy the contents of `firebase-storage.rules` to your Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `wildmind-db37a`
3. Navigate to **Storage** → **Rules**
4. Replace the existing rules with the content from `firebase-storage.rules`
5. Click **Publish**

## 2. Firebase Storage Configuration

### Enable Firebase Storage:
1. In Firebase Console, go to **Storage**
2. Click **Get Started**
3. Choose **Start in test mode** (or use the custom rules above)
4. Select a storage location (preferably close to your users)

### Verify Configuration:
- Project ID: `wildmind-db37a`
- Storage Bucket: `wildmind-db37a.firebasestorage.app`
- Rules: Allow read/write access as defined in the rules file

## 3. Environment Variables

Ensure these are set in your `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBYPFYLUTcKgudD0upjPKuzf46rZ04A37g
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=wildmind-db37a.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=wildmind-db37a
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=wildmind-db37a.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=62403175976
NEXT_PUBLIC_FIREBASE_APP_ID=1:62403175976:web:2461e103dca6518dabb71d
```

## 4. Testing Firebase Storage

You can test Firebase Storage access by:

1. Opening browser console
2. Looking for these logs:
   ```
   🔧 Storage config check - Project ID: wildmind-db37a
   📤 Uploading to Firebase Storage: generated-images/...
   ✅ Upload successful: generated-images/...
   ```

## 5. Common Issues & Solutions

### Issue: "storage/unknown" error
**Solution:** 
- Check Firebase Storage rules are published
- Verify project ID matches in environment variables
- Ensure Storage is enabled in Firebase Console

### Issue: "storage/unauthorized" error
**Solution:**
- Update Storage rules to allow write access
- Check if authentication is required but not provided

### Issue: "storage/quota-exceeded" error
**Solution:**
- Check Firebase Storage usage in console
- Upgrade Firebase plan if needed

### Issue: CORS errors when downloading images
**Solution:**
- This is expected for BFL URLs - the app handles this by downloading server-side
- Firebase Storage URLs should not have CORS issues

## 6. Storage Structure

The app creates this folder structure in Firebase Storage:

```
/generated-images/
  ├── 1704067200000_flux_pro_beautiful_sunset.png
  ├── 1704067300000_flux_max_mountain_landscape.png
  └── ...

/uploaded-images/
  ├── 1704067400000_reference_image.png
  └── ...
```

## 7. Monitoring

Monitor storage usage in Firebase Console:
- **Storage** → **Usage** tab
- Check for upload errors in **Storage** → **Files** tab
- Monitor costs in **Usage and billing**

## 8. Security Notes

Current rules allow public read/write access for simplicity. For production:

1. **Add authentication:**
   ```javascript
   allow read, write: if request.auth != null;
   ```

2. **Add file size limits:**
   ```javascript
   allow write: if request.resource.size < 10 * 1024 * 1024; // 10MB
   ```

3. **Add file type validation:**
   ```javascript
   allow write: if request.resource.contentType.matches('image/.*');
   ```
