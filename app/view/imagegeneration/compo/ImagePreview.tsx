import React from "react";
import Image from "next/image";

const ImagePreview = ({ images = [] }: { images?: string[] }) => {
  if (!images || images.length === 0) {
    return (
      <p className="text-white text-center mt-9">No images generated yet.</p>
    );
  }

  // Only show the most recent image
  const latestImage = images[images.length - 1];

  const handleDownload = async () => {
    try {
      // Convert base64 to blob
      const response = await fetch(latestImage);
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `generated-image-${Date.now()}.png`;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
      alert("Failed to download image. Please try again....");
    }
  };

  return (
    <div className="flex flex-col items-center mt-9">
      <div className="relative overflow-hidden rounded-2xl shadow-lg group">
        <div className="relative w-[512px] h-[512px] mb:w-[90vw] mb:h-[90vw]">
          <Image
            src={latestImage}
            alt="Generated Image"
            fill
            style={{ objectFit: "contain" }}
            className="rounded-2xl"
          />
        </div>
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={handleDownload}
            className="bg-white/90 hover:bg-white text-black px-6 py-3 rounded-full font-medium flex items-center gap-2 transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
