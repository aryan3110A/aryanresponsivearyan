"use client"

interface SummarySectionProps {
  showSummary: boolean;
  selectedModel: string;
  selectedBackground: string;
  selectedAspectRatio: string;
  selectedFont: string;
}

export default function SummarySection({
  showSummary,
  selectedModel,
  selectedBackground,
  selectedAspectRatio,
  selectedFont,
}: SummarySectionProps) {
  return (
    <div className="bg-white/10 backdrop-blur-3xl rounded-lg p-4 space-y-2 text-sm text-gray-300 mt-2 mb-6 mx-2 md:mx-6">
      <div className="flex justify-between">
        <span className="font-semibold text-white">Model Selection:</span>
        <span className="text-white">{showSummary ? selectedModel : ''}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-semibold text-white">Select Background:</span>
        <span className="text-white">{showSummary ? selectedBackground : ''}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-semibold text-white">Frame Size:</span>
        <span className="text-white">{showSummary ? selectedAspectRatio : ''}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-semibold text-white">Font Select:</span>
        <span className="text-white">{showSummary ? selectedFont : ''}</span>
      </div>
    </div>
  );
} 