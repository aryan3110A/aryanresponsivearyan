"use client";

import { useState } from "react";
import ImageOverlay from "./components/image-overlay";
import MasonryLayout from "./components/masorny-layout";
import NavigationFull from "../Core/NavigationFull";
import Footer from "../Core/Footer";

// Define the image data structure
interface ArtImage {
  id: string;
  src: string;
  alt: string;
  username: string;
  model: string;
  prompt: string;
  liked?: boolean;
  bookmarked?: boolean;
}

// Sample images without hardcoded dimensions
const sampleImages: ArtImage[] = [
  {
    id: "1",
    src: "/artstation/Card.png",
    alt: "Eiffel Tower with burger",
    username: "Username",
    model: "Flux.1 Dev",
    prompt: "A giant burger in front of the Eiffel Tower with trees",
    liked: false,
    bookmarked: false,
  },
  {
    id: "2",
    src: "/artstation/Card1.png",
    alt: "Mystical forest",
    username: "Username",
    model: "Name",
    prompt: "txt txt txt txt",
    liked: false,
    bookmarked: false,
  },
  {
    id: "3",
    src: "/artstation/Card.png",
    alt: "Lighthouse",
    username: "Username",
    model: "Name",
    prompt: "A lighthouse on rocky shore",
    liked: false,
    bookmarked: false,
  },
  {
    id: "4",
    src: "/artstation/Card.png",
    alt: "Abstract art",
    username: "Username",
    model: "Name",
    prompt: "Abstract digital art",
    liked: false,
    bookmarked: false,
  },
  {
    id: "5",
    src: "/artstation/Card2.png",
    alt: "Nature scene",
    username: "Username",
    model: "Name",
    prompt: "Beautiful nature landscape",
    liked: false,
    bookmarked: false,
  },
  {
    id: "6",
    src: "/artstation/Card1.png",
    alt: "Urban cityscape",
    username: "Username",
    model: "Name",
    prompt: "Futuristic cityscape at night",
    liked: false,
    bookmarked: false,
  },
  {
    id: "7",
    src: "/artstation/Card1.png",
    alt: "Portrait",
    username: "Username",
    model: "Name",
    prompt: "Artistic portrait",
    liked: false,
    bookmarked: false,
  },
  {
    id: "8",
    src: "/artstation/Card.png",
    alt: "Space scene",
    username: "Username",
    model: "Name",
    prompt: "Nebula in deep space",
    liked: false,
    bookmarked: false,
  },
  {
    id: "9",
    src: "/artstation/Card2.png",
    alt: "Mountain landscape",
    username: "Username",
    model: "Name",
    prompt: "Mountain landscape at sunset",
    liked: false,
    bookmarked: false,
  },
  {
    id: "10",
    src: "/artstation/Card1.png",
    alt: "Wide panorama",
    username: "Username",
    model: "Name",
    prompt: "Wide panoramic landscape",
    liked: false,
    bookmarked: false,
  },
  {
    id: "11",
    src: "/artstation/Card.png",
    alt: "Eiffel Tower with burger",
    username: "Username",
    model: "Flux.1 Dev",
    prompt: "A giant burger in front of the Eiffel Tower with trees",
    liked: false,
    bookmarked: false,
  },

  {
    id: "12",
    src: "/artstation/Card2.png",
    alt: "Mountain landscape",
    username: "Username",
    model: "Name",
    prompt: "Mountain landscape at sunset",
    liked: false,
    bookmarked: false,
  },

];

export default function ArtStation() {
  const [selectedImage, setSelectedImage] = useState<ArtImage | null>(null);
  const [images, setImages] = useState(sampleImages);

  const handleLikeToggle = (image: ArtImage) => {
    const updatedImages = images.map((img) =>
      img.id === image.id ? { ...img, liked: !img.liked } : img
    );
    setImages(updatedImages);
  };

  // Handle image bookmark toggle
  const handleBookmarkToggle = (image: ArtImage) => {
    const updatedImages = images.map((img) =>
      img.id === image.id ? { ...img, bookmarked: !img.bookmarked } : img
    );
    setImages(updatedImages);
  };

  return (
    <>
      {" "}
        <NavigationFull />
      <div className="w-full min-h-screen bg-black text-white p-5">
        <div className="max-w-[90%] mx-auto mt-20">
          <h1 className="text-3xl font-bold mb-2">ArtStation Gallery</h1>
          <p className="text-xl mb-10">Explore AI-generated artwork</p>

          {/* Use the MasonryLayout component */}
          <MasonryLayout
            images={sampleImages}
            onImageClick={setSelectedImage}
            onLikeToggle={handleLikeToggle}
            onBookmarkToggle={handleBookmarkToggle}
          />
        </div>

        {/* Image Overlay Modal */}
        {selectedImage && (
          <ImageOverlay
            image={selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        )}
      </div>

      <Footer />
    </>
  );
}
