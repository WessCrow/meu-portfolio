"use client";

import React from "react";

interface GlitchImageProps {
  src: string;
  isHovered: boolean;
  isDark?: boolean;
  isTransparent?: boolean;
  objectFit?: "cover" | "contain";
}

export function GlitchImage({ 
  src, 
  isHovered, 
  isDark = false, 
  isTransparent = false, 
  objectFit = "cover" 
}: GlitchImageProps) {
  return (
    <div className={`relative w-full h-full ${!isTransparent ? "overflow-hidden" : "overflow-visible"} ${!isTransparent ? (isDark ? "bg-black" : "bg-white") : "bg-transparent"}`}>
      <img
        src={src}
        alt="Preview"
        className={`w-full h-full grayscale transition-all duration-700 ease-out ${objectFit === "cover" ? "object-cover" : "object-contain"} ${isHovered ? 'brightness-[1.1] grayscale-0' : 'scale-100 grayscale'}`}
      />
    </div>
  );
}
