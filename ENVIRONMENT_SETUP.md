# Environment Variable Setup for Branding Kit Features

## Overview
The following Branding Kit features now use the `NEXT_PUBLIC_BACKEND_KONTEXT` environment variable instead of hardcoded ngrok URLs:

1. **Logo Generation** (`app/view/BRANDINGKIT/LOGOGENERATION/page.tsx`)
2. **Mockups Generation** (`app/view/BRANDINGKIT/Mockupgeneration/page.tsx`)
3. **Product with Model Pose** (`app/view/BRANDINGKIT/PRODUCT_WITH_MODEL_POSE/page.tsx`)

## Setup Instructions

### 1. Create `.env.local` file
Create a `.env.local` file in your project root with the following content:

```bash
# Backend URL for Branding Kit features
NEXT_PUBLIC_BACKEND_KONTEXT=https://f3f35ea9db7b.ngrok-free.app

# Other existing environment variables can be added here
# NEXT_PUBLIC_BACKEND_URL=https://a68c2c8c4b6b.ngrok-free.app
```

### 2. Update URL when needed
When you need to change the backend URL, simply update the `NEXT_PUBLIC_BACKEND_KONTEXT` value in your `.env.local` file:

```bash
# Example: Change to a new ngrok URL
NEXT_PUBLIC_BACKEND_KONTEXT=https://new-ngrok-url.ngrok-free.app
```

### 3. Restart your development server
After updating the `.env.local` file, restart your Next.js development server for the changes to take effect:

```bash
npm run dev
# or
yarn dev
```

## Benefits
- ✅ **Centralized Configuration**: All branding kit features use one environment variable
- ✅ **Easy Updates**: Change URL in one place instead of multiple files
- ✅ **Environment-Specific**: Different URLs for development, staging, and production
- ✅ **No Code Changes**: URL updates don't require code modifications

## Fallback URLs
Each feature includes a fallback URL in case the environment variable is not set:
- Logo Generation: `https://6debd752a0c4.ngrok-free.app`
- Mockups Generation: `https://6debd752a0c4.ngrok-free.app`
- Product with Model Pose: `https://f3f35ea9db7b.ngrok-free.app`

## Notes
- The `NEXT_PUBLIC_` prefix makes this variable available in the browser
- This variable only affects the branding kit features
- Other features continue to use their existing environment variables
- The Python backend files don't need updates as they're server-side 