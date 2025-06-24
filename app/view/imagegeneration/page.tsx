"use client";

import React, { useState } from 'react';
import Header from './compo/Header'; 
import Input from './compo/Input'; 
import ImagePreview from './compo/ImagePreview'; 
import NavigationFull from '../Core/NavigationFull'; 
import ProtectedRoute from '@/app/utils/ProtectedRoute';
import Footer from '../Core/Footer';
import Models from "./selectionmodel/phoenix-models"

const DEFAULT_MODEL = "Stable Diffusion XL";
const DEFAULT_TOKEN_COST = 18;
const DEFAULT_API_ENDPOINT = "https://api.wildmindai.com";

const MODEL_ENDPOINTS: Record<string, string> = {
  "Stable Diffusion XL": "https://api.wildmindai.com",
  "Stable Diffusion 3.5 Medium": "https://api.wildmindai.com/medium/",
  // Add other models and their endpoints if needed
};

const ImageGenMain = () => {
    const [images, setImages] = useState<string[]>([]);
    const [selectedModel, setSelectedModelState] = useState(DEFAULT_MODEL);
    const [selectedTokenCost, setSelectedTokenCost] = useState(DEFAULT_TOKEN_COST);

    const handleImageGenerated = (imageUrl: string) => {
        setImages((prevImages) => [...prevImages, imageUrl]); // Store multiple images
    };

    // Determine endpoint based on selected model
    const apiEndpoint = MODEL_ENDPOINTS[selectedModel] || DEFAULT_API_ENDPOINT;

    const setSelectedModel = (model: string, tokenCost: number) => {
        setSelectedModelState(model);
        setSelectedTokenCost(tokenCost);
    };

    return (
    <>
    <ProtectedRoute>
        <div className='bg-black min-h-screen flex relative'>
            {/* Main Content */}
            <div className="flex-1">
                <NavigationFull />
                <Header />
                <Input onImageGenerated={handleImageGenerated} /> 
                <ImagePreview images={images} />
                <Models setSelectedModel={setSelectedModel} toggleModels={() => {}} />
                {/* Pass apiEndpoint and selectedModel to the component that makes the API request */}
                {/* <TextToImageForm apiEndpoint={apiEndpoint} selectedModel={selectedModel} tokenCost={selectedTokenCost} /> */}
            </div>
        </div>
        <Footer />
        </ProtectedRoute>
        
        </>
    );
};

export default ImageGenMain;
