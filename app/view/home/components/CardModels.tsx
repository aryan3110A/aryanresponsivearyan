import React from "react";

interface CardModelsProps {
  imageSrc: string;
  title: string;
  details: string;
  buttonText: string;
  onButtonClick: () => void;
}

const CardModels: React.FC<CardModelsProps> = ({
  imageSrc,
  title,
  details,
  buttonText,
  onButtonClick,
}) => {
  return (
    <div className="relative w-[280px] bg-black rounded-2xl overflow-hidden">
      <div className="group relative overflow-hidden">
        {/* Image with Hover Effect */}
        <div className="relative overflow-hidden">
          <img
            src={imageSrc}
            className="w-full h-[350px] object-cover transition-transform duration-300 group-hover:scale-110"
            alt={title}
          />

          {/* Title (Hidden on Hover) */}
          <div className="absolute bottom-0 h-[70px] left-0 right-0 bg-black bg-opacity-50 text-white text-[14px] font-semibold px-4 py-2 rounded-t-lg transition-opacity duration-300 group-hover:opacity-0">
            {title}
          </div>

          {/* Details (Appear from Bottom Inside Image) */}
          <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-60 text-white text-sm p-4 opacity-0 translate-y-full transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
            {details}
          </div>
        </div>
      </div>

      {/* Run Button */}
      <div className="p-4">
  <button
    className="w-[81px] h-[31px] flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg transition-all duration-300  group
               hover:bg-white hover:text-black"
    onClick={onButtonClick}
  >
    <img
      src="./home/featurescard/play.svg"
      className="w-4 h-4 group-hover:hidden"
      alt="Play"
    />
    <img
      src="./home/featurescard/playblack.svg"
      className="w-4 h-4 hidden group-hover:block"
      alt="Play Hover"
    />
    {buttonText}
  </button>
</div>


    </div>
  );
};

export default CardModels;
