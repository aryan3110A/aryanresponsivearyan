"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";

export const TextHoverEffect = ({
  text,
  duration,
  className,
  backgroundMode = false,
  externalHovered = false,
  mousePosition = { x: 0, y: 0 },
}: {
  text: string;
  duration?: number;
  automatic?: boolean;
  className?: string;
  backgroundMode?: boolean;
  externalHovered?: boolean;
  mousePosition?: { x: number; y: number };
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  useEffect(() => {
    if (svgRef.current && (cursor.x !== null || mousePosition.x !== 0)) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const x = mousePosition.x || cursor.x;
      const y = mousePosition.y || cursor.y;
      const cxPercentage = ((x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor, mousePosition]);

  // Handle external hover state for background mode
  useEffect(() => {
    if (externalHovered && backgroundMode) {
      setHovered(true);
    } else if (!externalHovered && backgroundMode) {
      setHovered(false);
    }
  }, [externalHovered, backgroundMode]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 1920 200"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className={`select-none w-full h-full ${className || ""}`}
      preserveAspectRatio="xMidYMid slice"
      style={{ cursor: 'pointer' }}
    >
      <defs>
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="25%"
        >
          {(hovered || externalHovered) && (
            <>
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="25%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="75%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </>
          )}
        </linearGradient>

        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="20%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id="textMask">
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#revealMask)"
          />
        </mask>
      </defs>
      
      {/* Transparent background for hover detection */}
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill="transparent"
        style={{ pointerEvents: 'all' }}
      />
      
      {/* Background Mode - Simple visible text */}
      {backgroundMode && (
        <>
          <text
            x="960"
            y="100"
            textAnchor="middle"
            dominantBaseline="middle"
            strokeWidth="1"
            className="font-[helvetica] font-bold"
            style={{ 
              opacity: (hovered || externalHovered) ? 1 : 0.1,
              stroke: "#FFFFFF",
              fill: "transparent",
              fontSize: "180px"
            }}
          >
            {text}
          </text>
          <motion.text
            x="960"
            y="100"
            textAnchor="middle"
            dominantBaseline="middle"
            strokeWidth="1"
            className="font-[helvetica] font-bold"
            initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
            animate={{
              strokeDashoffset: 0,
              strokeDasharray: 1000,
            }}
            transition={{
              duration: 4,
              ease: "easeInOut",
            }}
            style={{ 
              opacity: (hovered || externalHovered) ? 1 : 0.05,
              stroke: "#FFFFFF",
              fill: "transparent",
              fontSize: "180px"
            }}
          >
            {text}
          </motion.text>
          <text
            x="960"
            y="100"
            textAnchor="middle"
            dominantBaseline="middle"
            stroke="url(#textGradient)"
            strokeWidth="1"
            mask="url(#textMask)"
            className="font-[helvetica] font-bold"
            style={{ 
              opacity: (hovered || externalHovered) ? 1 : 0,
              fontSize: "180px"
            }}
          >
            {text}
          </text>
        </>
      )}
      
      {/* Interactive Mode - Complex effects */}
      {!backgroundMode && (
        <>
          <text
            x="960"
            y="100"
            textAnchor="middle"
            dominantBaseline="middle"
            strokeWidth="2"
            className="font-[helvetica] font-bold"
            style={{ 
              opacity: hovered ? 0.7 : 0,
              stroke: "#666666",
              fill: "transparent"
            }}
          >
            {text}
          </text>
          <motion.text
            x="960"
            y="100"
            textAnchor="middle"
            dominantBaseline="middle"
            strokeWidth="1"
            className="font-[helvetica] font-bold"
            initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
            animate={{
              strokeDashoffset: 0,
              strokeDasharray: 1000,
            }}
            transition={{
              duration: 4,
              ease: "easeInOut",
            }}
            style={{ 
              opacity: 1,
              stroke: "#888888",
              fill: "transparent"
            }}
          >
            {text}
          </motion.text>
          <text
            x="960"
            y="100"
            textAnchor="middle"
            dominantBaseline="middle"
            stroke="url(#textGradient)"
            strokeWidth="1.5"
            mask="url(#textMask)"
            className="font-[helvetica] font-bold"
            style={{ 
              opacity: 1,
              filter: "blur(0.3px)"
            }}
          >
            {text}
          </text>
        </>
      )}
    </svg>
  );
};
