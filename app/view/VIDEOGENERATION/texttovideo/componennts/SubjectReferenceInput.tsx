"use client"

import { Upload } from "lucide-react"
import Image from "next/image"

interface SubjectReferenceInputProps {
  subjectImage: string | null
}

export default function SubjectReferenceInput({
  subjectImage
}: SubjectReferenceInputProps) {



  return (
    <div className="space-y-6">
      {/* Subject Image Display */}
      <div>
        <label className="block text-white text-sm font-medium mb-2">
          Subject Reference Image <span className="text-red-400">*</span>
        </label>
        <div className="text-gray-400 text-xs mb-3">
          Upload an image using the attachment button in the main input field above
        </div>

        {!subjectImage ? (
          <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-red-600 rounded-lg bg-red-900/20">
            <Upload className="w-8 h-8 text-red-400 mb-2" />
            <span className="text-red-400 text-sm font-medium">⚠️ Subject image required for S2V-01</span>
            <span className="text-red-300 text-xs mt-1">Use the attachment button (📎) in the main input above</span>
          </div>
        ) : (
          <div className="relative">
            <div className="relative w-full h-32 bg-gray-800 rounded-lg overflow-hidden">
              <Image
                src={subjectImage}
                alt="Subject reference"
                fill
                className="object-cover"
              />
            </div>
            <div className="mt-2 text-center">
              <span className="text-green-400 text-sm">✓ Subject image uploaded successfully</span>
            </div>
          </div>
        )}
      </div>



      {/* Tips */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
        <h4 className="text-blue-300 text-sm font-medium mb-2">Tips for better results:</h4>
        <ul className="text-blue-200 text-xs space-y-1">
          <li>• Use clear, high-quality images of the subject</li>
          <li>• Ensure the subject is well-lit and clearly visible</li>
          <li>• Avoid cluttered backgrounds in the reference image</li>
          <li>• Be specific about the actions and scene in your description</li>
        </ul>
      </div>
    </div>
  )
}
