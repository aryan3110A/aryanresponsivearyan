"use client";

import React, { useState } from "react";
import Image from "next/image";
import SelectionModel from "../selectionmodel/app-container"; // Import SelectionModel here

interface InputProps {
    onImageGenerated?: (imageUrl: string) => void; // Accept function as an optional prop
}

const Input: React.FC<InputProps> = ({ onImageGenerated }) => {
    const [text, setText] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [showSelectionModel, setShowSelectionModel] = useState(false); // Toggle SelectionModel

    const handleGenerate = async () => {
        if (!text) return alert("Please enter a prompt!");

        try {
            const response = await fetch("http://localhost:5001/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text }),
            });

            const data = await response.json();

            if (response.ok) {
                setImageUrl(data.image_url);

                // Call onImageGenerated if it exists
                if (onImageGenerated) {
                    onImageGenerated(data.image_url);
                }
            } else {
                console.error("Error:", data.error);
            }
        } catch (error) {
            console.error("Request failed:", error);
        }
    };

    return (
        <div className="text-white flex items-center relative justify-center -mt-16">
            {/* SelectionModel - Appears only when showSelectionModel is true */}
            {showSelectionModel && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex">
                    <div className="absolute left-0 top-0 h-full w-[380px]">
                        <SelectionModel onClose={() => setShowSelectionModel(false)} />
                    </div>
                </div>
            )}

            <div className="relative w-[60vw]">
                <input
                    type="text"
                    className="w-full pr-[4rem] pl-4 py-2 rounded-full bg-gray-800 text-white outline-none h-16"
                    placeholder="Enter text..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button
                    onClick={handleGenerate}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center px-4 lg:px-6 h-[2.5rem] lg:h-[3rem] rounded-full font-medium text-white transition-colors bg-gradient-to-b from-[#5AD7FF] to-[#656BF5]"
                >
                    <Image src="/ImageGeneate/Group.svg" alt="Generate" width={24} height={24} className="mr-2" /> Generate
                </button>
            </div>

            {/* Settings Button (Opens SelectionModel instead of navigating) */}
            <button
                onClick={() => setShowSelectionModel(true)}
                className="bg-[#272626] rounded-full cursor-pointer ml-4 p-3"
            >
                <Image src="/ImageGeneate/setting.svg" width={36} height={36} alt="Settings" />
            </button>

            {imageUrl && (
                <div className="mt-6">
                    <Image src={imageUrl} alt="Generated" width={800} height={600} className="w-auto h-auto" />
                </div>
            )}
        </div>
    );
};

export default Input;
