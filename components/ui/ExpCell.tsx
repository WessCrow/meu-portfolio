"use client";

import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface ExpCellProps {
  id: string;
  entity: string;
  role: string;
  desc: string;
  icon?: LucideIcon;
  isDark?: boolean;
}

export function ExpCell({ id, entity, role, desc, icon: Icon, isDark }: ExpCellProps) {
  return (
    <div className={`p-[var(--spacing-section)] border-t border-muted group hover:bg-canvas transition-colors flex flex-col h-full ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
      <div className="flex justify-between items-start mb-8">
        <span className="font-mono text-[9px] opacity-40 tracking-[0.4em] uppercase font-bold">{id} // LOG_DE_EMPRESAS</span>
        {Icon && <Icon size={14} className={`opacity-20 group-hover:opacity-100 transition-opacity ${isDark ? "text-white" : "text-ink"}`} strokeWidth={1.5} />}
      </div>
      <div className="mt-auto space-y-4">
        <h4 className="font-mono text-[10px] uppercase opacity-40 tracking-[0.3em] group-hover:opacity-100 transition-opacity uppercase font-bold">{entity}</h4>
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
