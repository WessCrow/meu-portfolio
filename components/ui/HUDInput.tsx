"use client";

import React, { useState } from "react";
import type { LucideIcon } from "lucide-react";

interface HUDInputProps {
  label: string;
  placeholder: string;
  icon: LucideIcon;
  value: string;
  onChange: (val: string) => void;
  isDark?: boolean;
  type?: string;
  required?: boolean;
  multiline?: boolean;
}

export function HUDInput({
  label,
  placeholder,
  icon: Icon,
  value,
  onChange,
  isDark = true,
  type = 'text',
  required,
  multiline
}: HUDInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = `hud-input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  const containerClasses = `w-full border p-4 font-mono text-xs uppercase tracking-wider outline-none focus:outline-none focus-visible:outline-none transition-all placeholder:opacity-40 cursor-none ${
    multiline ? 'resize-none' : ''
  } ${
    isDark
      ? `bg-black text-white placeholder:text-white/40 ${isFocused || value ? 'border-white' : 'border-white/20 hover:border-white/40'}`
      : `bg-white text-black placeholder:text-black/40 ${isFocused || value ? 'border-black' : 'border-black/20 hover:border-black/40'}`
  }`;

  return (
    <div className="flex flex-col gap-2 group w-full">
      <div className="flex justify-between items-center px-1">
        {/* WCAG 1.3.1 — label associado via htmlFor */}
        <label htmlFor={inputId} className="font-mono text-[9px] uppercase tracking-widest font-black" style={{ color: 'var(--color-text-label)' }}>{label}</label>
        <Icon size={10} aria-hidden="true" className={`transition-opacity ${isFocused ? 'opacity-100' : 'opacity-40'}`} />
      </div>
      <div className={`relative transition-all duration-300 ${isFocused ? 'scale-[1.01]' : ''}`}>
        {multiline ? (
          <textarea
            id={inputId}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            required={required}
            aria-required={required}
            rows={3}
            className={containerClasses}
          />
        ) : (
          <input
            id={inputId}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            required={required}
            aria-required={required}
            className={containerClasses}
          />
        )}
        
        {/* Subtle corner marks for HUD feel */}
        {(isFocused || value) && (
          <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r pointer-events-none ${isDark ? 'border-white' : 'border-black'}`} />
        )}
      </div>
    </div>
  );
}
