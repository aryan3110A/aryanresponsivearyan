import React from "react";

interface CardFeaturesProps {
  imageSrc: string;
  showOverlay?: boolean;
  overlayText?: string;
  overlayOpacity?: number;
  textColor?: string;
  textSize?: string;
  title?: string;
  buttonText?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  buttonIconSrc?: string;
  buttonHoverIconSrc?: string;
  onButtonClick?: () => void;
}

const CardFeatures: React.FC<CardFeaturesProps> = ({
  imageSrc,
  showOverlay = true, // New prop to control overlay visibility
  overlayText = "Coming Soon",
  overlayOpacity = 0.5,
  textColor = "white",
  textSize = "text-lg",
  title = "Image Creation",
  buttonText = "Run",
  buttonColor = "#6E9BF2",
  buttonTextColor = "white",
  buttonIconSrc = "./home/featurescard/play.svg",
  buttonHoverIconSrc = "./home/featurescard/playblack.svg",
  onButtonClick,
}) => {
  return (
    <div className="w-[240px]">
      {/* Image Section with Conditional Overlay */}
      <div className="relative w-[240px] h-[198px] overflow-hidden group">
        <img
          src={imageSrc}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 "
          alt="Feature Image"
        />

        {/* Only show overlay if showOverlay is true */}
        {showOverlay && (
          <div
            className="absolute inset-0 flex justify-center items-center"
            style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }}
          >
            <span
              className={`${textSize} font-light`}
              style={{ color: textColor }}
            >
              {overlayText}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="flex justify-between items-center m-3">
  <div className="text-[12px]">{title}</div>
  <div className="group">
    <button
      className="w-[81px] h-[31px] flex justify-center items-center rounded-lg transition-all duration-300 
                 hover:bg-white hover:text-black"
      onClick={onButtonClick}
      style={{
        backgroundColor: buttonColor,
        color: buttonTextColor,
      }}
    >
      {/* Default Icon */}
      <img
        src={buttonIconSrc}
        className="w-2 mr-1 transition-all duration-300 group-hover:hidden"
        alt="Default Icon"
      />
      {/* Hover Icon */}
      <img
        src={buttonHoverIconSrc}
        className="w-2 mr-1 hidden transition-all duration-300 group-hover:block"
        alt="Hover Icon"
      />
      {buttonText}
    </button>
  </div>
</div>



    </div>
  );
};

export default CardFeatures;
