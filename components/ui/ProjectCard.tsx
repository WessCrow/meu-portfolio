"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface ProjectCardProps {
  step: string;
  title: string;
  desc: string;
  img: string;
  icon: LucideIcon;
  onClick?: () => void;
  isDark?: boolean;
}

export function ProjectCard({ 
  step, 
  title, 
  desc, 
  img, 
  icon: Icon, 
  onClick, 
  isDark = true 
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className="grid grid-cols-1 md:grid-cols-12 border-b border-muted cursor-none group relative overflow-hidden transition-colors hover:bg-surface-sunken"
    >
      <div className="md:col-span-1 p-[var(--spacing-section)] border-r border-muted flex items-center justify-center font-mono text-[9px] opacity-30 italic font-bold">
        {step}
      </div>
      <div className="md:col-span-3 p-[var(--spacing-section)] border-r border-muted flex items-center gap-4">
        <Icon size={16} className="opacity-20 group-hover:opacity-100 transition-opacity" />
        <h3 className="text-2xl font-display tracking-tighter uppercase font-bold group-hover:translate-x-1 transition-transform">
          {title}
        </h3>
      </div>
      <div className="md:col-span-4 p-[var(--spacing-section)] border-r border-muted flex items-center relative overflow-hidden min-h-[140px]">
        {/* THUMBNAIL PREVIEW ON HOVER */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="absolute inset-0 z-0"
            >
              <img src={img} alt={title} className="w-full h-full object-cover grayscale opacity-20" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="md:col-span-4 p-[var(--spacing-section)] flex flex-col gap-[var(--spacing-2)] relative z-10">
        <p className="font-body text-sm leading-loose text-ink-muted group-hover:text-ink transition-opacity font-medium">
          {desc}
        </p>
        <span className="font-mono text-[8px] opacity-40 group-hover:opacity-100 transition-opacity uppercase font-bold tracking-widest">Recon_Ativo</span>
      </div>
    </motion.div>
  );
}
