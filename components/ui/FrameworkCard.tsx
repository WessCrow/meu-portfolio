"use client";

import React from 'react';
import { ScrollReveal } from './ScrollReveal';

interface FrameworkCardProps {
  index: string;
  subtitle: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isDark: boolean;
}

export function FrameworkCard({ index, subtitle, title, description, icon: IconComponent, isDark }: FrameworkCardProps) {
  return (
    <ScrollReveal delay={parseInt(index) * 0.1}>
      <div className={`p-[var(--spacing-section)] border-t border-muted group hover:bg-canvas transition-colors flex flex-col h-full ${isDark ? "text-white" : "text-black"}`}>
        {/* Header: matches ExpCell style but with dynamic phase label */}
        <div className="flex justify-between items-start mb-8">
          <span className="font-mono text-[9px] opacity-40 tracking-[0.4em] uppercase font-bold">{index} // {subtitle}</span>
        </div>

        {/* ICON AREA: Hero of the card */}
        <div className="relative flex items-center justify-center py-12 mb-8 overflow-hidden">
          <div className={`w-full max-w-[160px] h-[160px] transition-transform duration-700 ease-out group-hover:scale-110 ${isDark ? "text-white" : "text-black"}`}>
            {IconComponent}
          </div>
        </div>

        {/* CONTENT AREA: Bottom-aligned like ExpCell */}
        <div className="mt-auto space-y-4">
          <h4 className="font-mono text-[10px] uppercase opacity-40 tracking-[0.3em] group-hover:opacity-100 transition-opacity uppercase font-bold">
            {subtitle}
          </h4>
          <h3 className={`text-2xl font-display group-hover:translate-x-1 transition-transform tracking-tight uppercase font-bold ${isDark ? "text-white" : "text-ink"}`}>
            {title}
          </h3>
          <p className={`font-body text-xs leading-loose transition-colors tracking-tight font-medium ${isDark ? "text-white/70" : "text-ink-muted"}`}>
            "{description}"
          </p>
        </div>
      </div>
    </ScrollReveal>
  );
}

export const IconDescoberta = () => (
   <svg viewBox="0 0 100 100" className="w-full h-full stroke-current fill-none" strokeWidth="1.2">
      <circle cx="50" cy="50" r="40" />
      <circle cx="50" cy="50" r="25" strokeDasharray="4 4" className="opacity-40" />
      <circle cx="50" cy="50" r="12" />
      <line x1="50" y1="10" x2="50" y2="90" className="opacity-20" />
      <line x1="10" y1="50" x2="90" y2="50" className="opacity-20" />
      <circle cx="50" cy="50" r="2" fill="currentColor" />
   </svg>
);

export const IconDefinicao = () => (
   <svg viewBox="0 0 100 100" className="w-full h-full stroke-current fill-none" strokeWidth="1.2">
      <path d="M50 10 L85 80 L15 80 Z" />
      <line x1="50" y1="10" x2="50" y2="80" />
      <line x1="50" y1="10" x2="35" y2="80" className="opacity-40" />
      <line x1="50" y1="10" x2="65" y2="80" className="opacity-40" />
      <line x1="25" y1="60" x2="75" y2="60" className="opacity-20" />
      <line x1="35" y1="40" x2="65" y2="40" className="opacity-20" />
   </svg>
);

export const IconDesenvolvimento = () => (
   <svg viewBox="0 0 100 100" className="w-full h-full stroke-current fill-none" strokeWidth="1.2">
      <rect x="30" y="30" width="40" height="40" transform="rotate(45 50 50)" />
      <rect x="38" y="38" width="24" height="24" transform="rotate(45 50 50)" strokeDasharray="2 2" className="opacity-40" />
      <path d="M50 8 L92 50 L50 92 L8 50 Z" className="opacity-20" />
      <circle cx="50" cy="50" r="2" fill="currentColor" />
   </svg>
);

export const IconEntrega = () => (
   <svg viewBox="0 0 100 100" className="w-full h-full stroke-current fill-none" strokeWidth="1.2">
      <path d="M50 5 L88 27 L88 73 L50 95 L12 73 L12 27 Z" />
      <path d="M50 25 L72 38 L72 62 L50 75 L28 62 L28 38 Z" className="opacity-60" />
      <line x1="50" y1="5" x2="50" y2="95" className="opacity-10" />
      <line x1="12" y1="27" x2="88" y2="73" className="opacity-10" />
      <line x1="88" y1="27" x2="12" y2="73" className="opacity-10" />
      <circle cx="50" cy="50" r="3" fill="currentColor" />
   </svg>
);
