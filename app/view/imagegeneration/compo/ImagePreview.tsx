import React from 'react';
import Image from 'next/image';

const ImagePreview = ({ images = [] }: { images?: string[] }) => {
  if (!images || images.length === 0) {
    return <p className="text-white text-center mt-9">No images generated yet.</p>;
  }

  return (
    <div className='flex justify-center gap-6 mt-9 mb:flex-col mb:items-center mb:gap-4'>
      {images.map((src, index) => (
        <Image 
          key={index}
          src={src}
          alt={`Generated ${index}`}
          width={512}
          height={512}
          className='w-auto h-auto mb:w-[90vw] mb:h-auto'
        />
      ))}
    </div>
  );
  
};

export default ImagePreview;
