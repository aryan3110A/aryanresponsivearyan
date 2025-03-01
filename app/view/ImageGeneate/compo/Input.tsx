import React, { useState } from 'react';

const Input = () => {
    const [text, setText] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const handleGenerate = async () => {
        if (!text) return alert("Please enter a prompt!");

        try {
            const response = await fetch('http://localhost:5001/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });

            const data = await response.json();

            if (response.ok) {
                setImageUrl(data.image_url);
            } else {
                console.error("Error:", data.error);
            }
        } catch (error) {
            console.error("Request failed:", error);
        }
    };

    return (
        <div className="text-white flex items-center relative justify-center">
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
                    <img src="/ImageGeneate/Group.svg" alt="Generate" className="mr-2" /> Generate
                </button>
            </div>

            {imageUrl && (
                <div className="mt-6">
                    <img src={imageUrl} alt="Generated" className="w-auto h-auto" />
                </div>
            )}
        </div>
    );
};

export default Input;
