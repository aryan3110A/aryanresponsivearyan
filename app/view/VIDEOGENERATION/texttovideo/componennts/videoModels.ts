// MiniMax Video Generation Models Configuration

export interface VideoModel {
  id: string
  name: string
  description: string
  maxDuration: number
  supportedResolutions: string[]
  features: string[]
  type: 'text-to-video' | 'image-to-video' | 'subject-reference'
  supportedAspectRatios: string[]
  apiModel: string // The actual model name to send to API
  supportsFirstFrameImage: boolean
  supportsCameraMovements: boolean
  supportsSubjectReference: boolean
}

export interface CameraMovement {
  id: string
  name: string
  instruction: string
}

// API Parameter interfaces based on MiniMax documentation
export interface TextToVideoParams {
  model: string
  prompt: string
  duration?: number
  resolution?: string
  prompt_optimizer?: boolean
}

export interface ImageToVideoParams {
  model: string
  prompt?: string // Optional for I2V models
  first_frame_image: string // base64 encoded image
  duration?: number
  resolution?: string
  prompt_optimizer?: boolean
}

export interface SubjectReferenceParams {
  model: string
  prompt: string
  subject_reference: Array<{
    type: "character" // Currently only "character" is supported
    image: string[] // Array containing base64 encoded image (array length is 1)
  }>
  duration?: number
  resolution?: string
  prompt_optimizer?: boolean
  // Note: S2V-01 does not support first_frame_image or aspect_ratio according to API docs
}

export const VIDEO_MODELS: VideoModel[] = [
  {
    id: "MiniMax-Hailuo-02",
    name: "MiniMax Hailuo 02",
    description: "High-quality video generation model, supports 1080P, max 10s duration video",
    maxDuration: 10,
    supportedResolutions: ["768P", "1080P"],
    features: ["High Quality", "1080P Support", "10s Duration", "Text to Video", "Image to Video"],
    type: "text-to-video",
    supportedAspectRatios: ["1:1", "16:9", "9:16"],
    apiModel: "MiniMax-Hailuo-02",
    supportsFirstFrameImage: true,
    supportsCameraMovements: false,
    supportsSubjectReference: false
  },
  {
    id: "T2V-01-Director",
    name: "T2V-01 Director",
    description: "Enhanced precision shot control, support text to video. 720P, 25FPS",
    maxDuration: 6,
    supportedResolutions: ["720P"],
    features: ["Camera Control", "Shot Precision", "25FPS", "Text to Video"],
    type: "text-to-video",
    supportedAspectRatios: ["1:1", "16:9", "9:16"],
    apiModel: "T2V-01-Director",
    supportsFirstFrameImage: false,
    supportsCameraMovements: true,
    supportsSubjectReference: false
  },
  {
    id: "I2V-01-Director",
    name: "I2V-01 Director",
    description: "Enhanced precision shot control, support image to video. 720P, 25FPS",
    maxDuration: 6,
    supportedResolutions: ["720P"],
    features: ["Image to Video", "Camera Control", "25FPS"],
    type: "image-to-video",
    supportedAspectRatios: ["1:1", "16:9", "9:16"],
    apiModel: "I2V-01-Director",
    supportsFirstFrameImage: true,
    supportsCameraMovements: true,
    supportsSubjectReference: false
  },
  {
    id: "S2V-01",
    name: "S2V-01",
    description: "Subject Reference video generation model. 768P/1080P, 25FPS",
    maxDuration: 6,
    supportedResolutions: ["768P", "1080P"],
    features: ["Subject Reference", "768P", "1080P", "25FPS"],
    type: "subject-reference",
    supportedAspectRatios: ["1:1", "16:9", "9:16"],
    apiModel: "S2V-01",
    supportsFirstFrameImage: false,
    supportsCameraMovements: false,
    supportsSubjectReference: true
  }
]

// Camera movement instructions for Director models
export const CAMERA_MOVEMENTS: CameraMovement[] = [
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
// Quality to Resolution mapping for UI
export const QUALITY_TO_RESOLUTION = {
  "SD": "720P",
  "HD": "720P",
  "Full HD": "1080P",
  "2K": "1080P",
  "4K": "1080P"
}

// Model-specific resolution constraints
export const MODEL_RESOLUTION_CONSTRAINTS = {
  "MiniMax-Hailuo-02": {
    "1:1": ["768P", "1080P"],
    "16:9": ["768P", "1080P"],
    "9:16": ["768P", "1080P"]
  },
  "T2V-01-Director": {
    "1:1": ["720P"],
    "16:9": ["720P"],
    "9:16": ["720P"]
  },
  "I2V-01-Director": {
    "1:1": ["720P"],
    "16:9": ["720P"],
    "9:16": ["720P"]
  },
  "S2V-01": {
    "1:1": ["768P", "1080P"],
    "16:9": ["768P", "1080P"],
    "9:16": ["768P", "1080P"]
  }
}

// Duration limits based on model and resolution (from MiniMax API docs)
export const DURATION_LIMITS = {
  "MiniMax-Hailuo-02": {
    "768P": [6, 10],
    "1080P": [6], // 1080P only supports 6s according to docs
    "720P": [6]
  },
  "T2V-01-Director": {
    "720P": [6]
  },
  "I2V-01-Director": {
    "720P": [6]
  },
  "S2V-01": {
    "768P": [6],
    "1080P": [6]
  },
  "T2V-01": {
    "720P": [6]
  },
  "I2V-01": {
    "720P": [6]
  },
  "I2V-01-live": {
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
  return model?.supportsFirstFrameImage || false
}

// Helper function to check if model supports camera movements
export function supportsCameraMovements(modelId: string): boolean {
  const model = VIDEO_MODELS.find(m => m.id === modelId)
  return model?.supportsCameraMovements || false
}

// Helper function to check if model supports subject reference
export function supportsSubjectReference(modelId: string): boolean {
  const model = VIDEO_MODELS.find(m => m.id === modelId)
  return model?.supportsSubjectReference || false
}

// Helper function to get model type
export function getModelType(modelId: string): string {
  const model = VIDEO_MODELS.find(m => m.id === modelId)
  return model?.type || "text-to-video"
}

// Helper function to get API model name
export function getApiModelName(modelId: string): string {
  const model = VIDEO_MODELS.find(m => m.id === modelId)
  return model?.apiModel || modelId
}

// Helper function to get supported aspect ratios for a model
export function getSupportedAspectRatios(modelId: string): string[] {
  const model = VIDEO_MODELS.find(m => m.id === modelId)
  return model?.supportedAspectRatios || ["16:9"]
}

// Helper function to get the correct API resolution based on quality and model constraints
export function getApiResolution(modelId: string, quality: string, aspectRatio: string): string {
  // Convert UI quality to base resolution
  const baseResolution = QUALITY_TO_RESOLUTION[quality as keyof typeof QUALITY_TO_RESOLUTION] || "720P"

  // Get model-specific constraints
  const modelConstraints = MODEL_RESOLUTION_CONSTRAINTS[modelId as keyof typeof MODEL_RESOLUTION_CONSTRAINTS]

  if (!modelConstraints || !modelConstraints[aspectRatio as keyof typeof modelConstraints]) {
    return "720P" // Default fallback
  }

  const supportedResolutions = modelConstraints[aspectRatio as keyof typeof modelConstraints]

  // If the base resolution is supported, use it; otherwise use the highest supported resolution
  if (supportedResolutions.includes(baseResolution)) {
    return baseResolution
  }

  // Return the highest supported resolution for this model and aspect ratio
  if (supportedResolutions.includes("1080P")) return "1080P"
  if (supportedResolutions.includes("768P")) return "768P"
  return "720P"
}

// Helper function to get available quality options for a model and aspect ratio
export function getAvailableQualities(modelId: string, aspectRatio: string): string[] {
  const modelConstraints = MODEL_RESOLUTION_CONSTRAINTS[modelId as keyof typeof MODEL_RESOLUTION_CONSTRAINTS]

  if (!modelConstraints || !modelConstraints[aspectRatio as keyof typeof modelConstraints]) {
    return ["HD"] // Default fallback
  }

  const supportedResolutions = modelConstraints[aspectRatio as keyof typeof modelConstraints]
  const availableQualities: string[] = []

  // Map supported resolutions back to quality options
  if (supportedResolutions.includes("720P")) {
    availableQualities.push("HD")
  }
  if (supportedResolutions.includes("768P")) {
    availableQualities.push("HD") // 768P maps to HD
  }
  if (supportedResolutions.includes("1080P")) {
    availableQualities.push("Full HD")
  }

  return availableQualities.length > 0 ? availableQualities : ["HD"]
}
