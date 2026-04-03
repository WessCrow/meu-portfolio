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

  const containerClasses = `w-full bg-surface-sunken/40 border p-4 font-mono text-xs uppercase tracking-wider outline-none transition-all placeholder:opacity-20 cursor-none ${
    multiline ? 'resize-none' : ''
  } ${
    isFocused 
      ? 'border-accent-innovation ring-1 ring-accent-innovation/20' 
      : 'border-muted hover:border-ink/20'
  }`;

  return (
    <div className="flex flex-col gap-2 group w-full">
      <div className="flex justify-between items-center px-1">
        <label className="font-mono text-[9px] uppercase tracking-widest opacity-40 font-black">{label}</label>
        <Icon size={10} className={`transition-opacity ${isFocused ? 'opacity-100 text-accent-innovation' : 'opacity-20'}`} />
      </div>
      <div className={`relative transition-all duration-300 ${isFocused ? 'scale-[1.01]' : ''}`}>
        {multiline ? (
          <textarea 
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            required={required}
            rows={3}
            className={containerClasses}
          />
        ) : (
          <input 
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            required={required}
            className={containerClasses}
          />
        )}
        
        {/* Subtle corner marks for HUD feel */}
        {isFocused && (
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-accent-innovation pointer-events-none" />
        )}
      </div>
    </div>
  );
}
