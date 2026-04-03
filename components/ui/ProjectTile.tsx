"use client";

import React from "react";
import { motion } from "framer-motion";

interface ProjectTileProps {
  id: string;
  tag: string;
  title: string;
  details: string;
  img: string;
}

export function ProjectTile({ id, tag, title, details, img }: ProjectTileProps) {
  return (
    <div className="group border-r border-muted bg-surface hover:bg-surface-sunken transition-all relative overflow-hidden min-h-[400px] flex flex-col justify-end">
      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0">
        <img 
          src={img} 
          alt={title} 
          className="w-full h-full object-cover grayscale opacity-10 group-hover:opacity-40 transition-all duration-700 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80" />
      </div>

      {/* CONTENT */}
      <div className="p-10 relative z-10 space-y-4">
        <div className="flex justify-between items-center opacity-40">
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] font-bold italic">{id} // {tag}</span>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-3xl font-display font-bold tracking-tighter uppercase">{title}</h3>
          <p className="font-body text-sm opacity-60 leading-relaxed font-medium max-w-xs">{details}</p>
        </div>

        <motion.div 
          className="pt-6 flex items-center gap-3 font-mono text-[9px] tracking-[0.3em] font-bold uppercase opacity-0 group-hover:opacity-100 transition-all"
          initial={{ x: -10 }}
          whileHover={{ x: 0 }}
        >
          MAIS_DETALHES <div className="w-12 h-[1px] bg-ink" />
        </motion.div>
      </div>

      {/* TOP DECOR */}
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-muted opacity-20 pointer-events-none group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
