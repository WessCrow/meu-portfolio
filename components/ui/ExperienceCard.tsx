"use client";

import React from "react";
import { Terminal, Search, Activity, Pointer } from "lucide-react";

interface ExperienceCardProps {
  id: string;
  entity: string;
  role: string;
  desc: string;
  icon?: "terminal" | "search" | "activity" | "pointer";
  isDark?: boolean;
}

const icons = {
  terminal: Terminal,
  search: Search,
  activity: Activity,
  pointer: Pointer
};

export function ExperienceCard({ 
  id, 
  entity, 
  role, 
  desc, 
  icon, 
  isDark = true 
}: ExperienceCardProps) {
  const IconComponent = icon ? icons[icon] : null;

  return (
    <div className={`p-[var(--spacing-section)] border-t border-muted group hover:bg-canvas transition-colors flex flex-col h-full ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
      <div className="flex justify-between items-start mb-8">
        <span className="font-mono text-[9px] opacity-40 tracking-[0.4em] uppercase font-bold">{id} // LOG_DE_EMPRESAS</span>
        {IconComponent && <IconComponent size={14} className={`opacity-20 group-hover:opacity-100 transition-opacity ${isDark ? "text-white" : "text-ink"}`} strokeWidth={1.5} />}
      </div>
      <div className="mt-auto space-y-4">
        <h4 className="font-mono text-[10px] uppercase opacity-40 tracking-[0.3em] group-hover:opacity-100 transition-opacity font-bold">{entity}</h4>
        <h3 className={`text-2xl font-display group-hover:translate-x-1 transition-transform tracking-tight uppercase font-bold ${isDark ? "text-white" : "text-ink"}`}>
          {role}
        </h3>
        <p className={`font-body text-xs leading-loose transition-colors tracking-tight font-medium ${isDark ? "text-white/70" : "text-ink-muted"}`}>
          "{desc}"
        </p>
      </div>
    </div>
  );
}
