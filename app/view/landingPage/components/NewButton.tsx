"use client";
import React from "react";
import { ChevronRight } from "lucide-react";

interface NewButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  background?: string; // hex code
  hoverBackground?: string; // hex code
  glowColor?: string; // hex code
  textColor?: string; // hex code
}

const NewButton: React.FC<NewButtonProps> = ({
  text,
  onClick,
  className = "",
  type = "button",
  background = "#0073E6",
  hoverBackground = "#0059B3",
  glowColor = "#3399ff",
  textColor = "#fff",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 border-[2px] border-white/20 rounded-3xl text-xs font-medium transition-colors duration-200 flex items-center ${className}`}
      style={{
        background: background,
        color: textColor,
        boxShadow: `0 0 8px 2px ${glowColor}`,
      }}
      onMouseOver={e => (e.currentTarget.style.background = hoverBackground)}
      onMouseOut={e => (e.currentTarget.style.background = background)}
    >
      <span className="flex-1 text-left">{text}</span>
      <span
        className="flex items-center justify-center w-5 h-5 rounded-full bg-white shrink-0 focus:outline-none border-none p-0 ml-2"
        style={{ color: background }}
        aria-label="arrow"
      >
        <ChevronRight className="w-5 h-5" />
      </span>
    </button>
  );
};

export default NewButton;
