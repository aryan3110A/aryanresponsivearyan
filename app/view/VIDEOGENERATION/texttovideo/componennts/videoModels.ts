// MiniMax Video Generation Models Configuration

export interface VideoModel {
  id: string
  name: string
  description: string
  maxDuration: number
  supportedResolutions: string[]
  features: string[]
  type: 'text-to-video' | 'image-to-video' | 'subject-reference'
}

export const VIDEO_MODELS: VideoModel[] = [
  {
    id: "MiniMax-Hailuo-02",
    name: "MiniMax Hailuo 02",
    description: "High-quality video generation model, supports 1080P, max 10s duration video",
    maxDuration: 10,
    supportedResolutions: ["768P", "1080P"],
    features: ["High Quality", "1080P Support", "10s Duration"],
    type: "text-to-video"
  },
  {
    id: "T2V-01-Director",
    name: "T2V-01 Director",
    description: "Enhanced precision shot control, support text to video. 720P, 25FPS",
    maxDuration: 6,
    supportedResolutions: ["720P"],
    features: ["Camera Control", "Shot Precision", "25FPS"],
    type: "text-to-video"
  },
  {
    id: "I2V-01-Director", 
    name: "I2V-01 Director",
    description: "Enhanced precision shot control, support image to video. 720P, 25FPS",
    maxDuration: 6,
    supportedResolutions: ["720P"],
    features: ["Image to Video", "Camera Control", "25FPS"],
    type: "image-to-video"
  },
  {
    id: "S2V-01",
    name: "S2V-01",
    description: "Subject Reference video generation model. 720P, 25FPS",
    maxDuration: 6,
    supportedResolutions: ["720P"],
    features: ["Subject Reference", "720P", "25FPS"],
    type: "subject-reference"
  }
]

// Camera movement instructions for Director models
export const CAMERA_MOVEMENTS = [
  { id: "truck-left", name: "Truck Left", instruction: "[Truck left]" },
  { id: "truck-right", name: "Truck Right", instruction: "[Truck right]" },
  { id: "pan-left", name: "Pan Left", instruction: "[Pan left]" },
  { id: "pan-right", name: "Pan Right", instruction: "[Pan right]" },
  { id: "push-in", name: "Push In", instruction: "[Push in]" },
  { id: "pull-out", name: "Pull Out", instruction: "[Pull out]" },
  { id: "pedestal-up", name: "Pedestal Up", instruction: "[Pedestal up]" },
  { id: "pedestal-down", name: "Pedestal Down", instruction: "[Pedestal down]" },
  { id: "tilt-up", name: "Tilt Up", instruction: "[Tilt up]" },
  { id: "tilt-down", name: "Tilt Down", instruction: "[Tilt down]" },
  { id: "zoom-in", name: "Zoom In", instruction: "[Zoom in]" },
  { id: "zoom-out", name: "Zoom Out", instruction: "[Zoom out]" },
  { id: "shake", name: "Shake", instruction: "[Shake]" },
  { id: "tracking", name: "Tracking Shot", instruction: "[Tracking shot]" },
  { id: "static", name: "Static Shot", instruction: "[Static shot]" }
]

// Resolution mapping for different aspect ratios
export const RESOLUTION_MAPPING = {
  "1:1": {
    "720P": "720P",
    "768P": "768P", 
    "1080P": "720P" // 1:1 aspect ratio limited to 720P for most models
  },
  "16:9": {
    "720P": "720P",
    "768P": "768P",
    "1080P": "1080P"
  },
  "9:16": {
    "720P": "720P", 
    "768P": "720P", // Vertical videos typically limited to 720P
    "1080P": "720P"
  },
  "4:3": {
    "720P": "720P",
    "768P": "720P",
    "1080P": "720P"
  }
}

// Duration limits based on model and resolution
export const DURATION_LIMITS = {
  "MiniMax-Hailuo-02": {
    "768P": [6, 10],
    "1080P": [6]
  },
  "T2V-01-Director": {
    "720P": [6]
  },
  "I2V-01-Director": {
    "720P": [6]
  },
  "S2V-01": {
    "720P": [6]
  }
}

// Helper function to get available durations for a model and resolution
export function getAvailableDurations(modelId: string, resolution: string): number[] {
  return DURATION_LIMITS[modelId as keyof typeof DURATION_LIMITS]?.[resolution as keyof typeof DURATION_LIMITS[keyof typeof DURATION_LIMITS]] || [6]
}

// Helper function to get supported resolutions for a model
export function getSupportedResolutions(modelId: string): string[] {
  const model = VIDEO_MODELS.find(m => m.id === modelId)
  return model?.supportedResolutions || ["720P"]
}

// Helper function to check if model supports image input
export function supportsImageInput(modelId: string): boolean {
  const model = VIDEO_MODELS.find(m => m.id === modelId)
  return model?.type === "image-to-video" || modelId === "MiniMax-Hailuo-02"
}

// Helper function to check if model supports camera movements
export function supportsCameraMovements(modelId: string): boolean {
  return modelId.includes("Director")
}
