import React from 'react';

const ImagePreview = ({ images = [] }: { images?: string[] }) => {
  if (!images || images.length === 0) {
    return <p className="text-white text-center mt-9">No images generated yet.</p>;
  }

  return (
    <div className='flex justify-center gap-6 mt-9'>
      {images.map((src, index) => (
        <img key={index} className='w-auto h-auto' src={src} alt={`Generated ${index}`} />
      ))}
    </div>
  );
};

export default ImagePreview;
