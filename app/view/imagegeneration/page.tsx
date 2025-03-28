"use client";

import React, { useState } from 'react';
import Header from './compo/Header'; 
import Input from './compo/Input'; 
import ImagePreview from './compo/ImagePreview'; 
import NavigationFull from '../Core/NavigationFull'; 

const ImageGenMain = () => {
    const [images, setImages] = useState<string[]>([]);

    const handleImageGenerated = (imageUrl: string) => {
        setImages((prevImages) => [...prevImages, imageUrl]); // Store multiple images
    };

    return (
        <div className='bg-black min-h-screen flex relative'>
            {/* Main Content */}
            <div className="flex-1">
                <NavigationFull />
                <Header />
                <Input onImageGenerated={handleImageGenerated} /> 
                <ImagePreview images={images} />
            </div>
        </div>
    );
};

export default ImageGenMain;
