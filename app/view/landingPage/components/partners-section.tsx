import React from "react";

const PartnersSection = () => {
  return (
    <div className="flex flex-col">
      <div className="text-white flex justify-center">
        <h2 className="mb-12 text-center text-6xl font-bold ">
          <span className="text-white">Our </span>
          <span className="bg-gradient-to-r from-[#5AD7FF] to-[#656BF5] bg-clip-text text-transparent">
            Partners
          </span>
        </h2>
      </div>

      <div className="flex ">
        <div className="bg-black w-[15vw] h-[100px] relative shadow-[100px_100px_100px_100px_rgba(0,3,0,1)]">
          <div className="absolute left-0 top-0 h-full w-[30px]"></div>
        </div>

        <div className="w-[70vw] overflow-hidden relative bg-black flex justify-center">
          {/* Scrolling Images */}
          <div className="flex w-max animate-scroll">
            <img
              className="w-64 mx-4 h-24"
              src="/Landingpage/Partners/Google-Cloud-Logo.png"
              alt=""
            />
            <img
              className="w-64 mx-4 h-24"
              src="/Landingpage/Partners/Hugging_Face.png"
              alt=""
            />
            <img
              className="w-64 mx-4 h-24"
              src="/Landingpage/Partners/Mistral AI.png"
              alt=""
            />
            <img
              className="w-64 mx-4 h-24"
              src="/Landingpage/Partners/wildchildstudio.png"
              alt=""
            />
            {/* Duplicate for smooth transition */}
            <img
              className="w-64 mx-4"
              src="/Landingpage/Partners/Google-Cloud-Logo.png"
              alt=""
            />
            <img
              className="w-64 mx-4"
              src="/Landingpage/Partners/Hugging_Face.png"
              alt=""
            />
            <img
              className="w-64 mx-4"
              src="/Landingpage/Partners/Mistral AI.png"
              alt=""
            />
            <img
              className="w-64 mx-4"
              src="/Landingpage/Partners/wildchildstudio.png"
              alt=""
            />
          </div>

          {/* Tailwind CSS Styles */}
          <style>
            {`
    @keyframes scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-scroll {
      animation: scroll 3s linear infinite;
    }
    `}
          </style>
        </div>

        <div className="bg-black w-[15vw] h-[100px] relative shadow-[0_0_90px_50px_rgba(0,3,0,1)]">
          <div className="absolute left-0 top-0 h-full w-[30px] "></div>
        </div>
      </div>
    </div>
  );
};

export default PartnersSection;
