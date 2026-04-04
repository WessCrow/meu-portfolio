"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { GlitchImage } from './GlitchImage';

interface ProjectRowProps {
  step: string;
  title: string;
  desc: string;
  img: string;
  isDark?: boolean;
  icon?: LucideIcon;
  onClick?: () => void;
  hoverColor?: string;
}

export function ProjectRow({ step, title, desc, img, isDark, icon: Icon, onClick, hoverColor }: ProjectRowProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      type="button"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{ zIndex: 50, transition: { duration: 0 } }}
      aria-label={`Ver case ${title}`}
      style={{ backgroundColor: isHovered && hoverColor ? hoverColor : undefined }}
      className="w-full text-left grid grid-cols-1 md:grid-cols-12 border-b border-muted py-6 px-4 md:p-[var(--spacing-section)] items-center group cursor-pointer hover:bg-surface-sunken transition-colors relative gap-y-4 md:gap-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
    >
      <div className="col-span-12 md:col-span-3 flex items-center gap-[var(--spacing-4)]">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={12} className="text-ink opacity-40 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />}
          <span className="font-mono text-[10px] opacity-40 uppercase tracking-[0.3em] font-bold">Case {step}</span>
        </div>
        <div className="w-8 h-[1px] bg-muted group-hover:w-[var(--spacing-12)] transition-all" />
      </div>
      <div className="col-span-12 md:col-span-5 relative">
        <h3 className="text-2xl font-display font-bold leading-none tracking-tighter uppercase transition-transform group-hover:translate-x-[var(--spacing-2)] duration-700 text-ink">
          {title}.
        </h3>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: 40, rotateX: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: 40, rotateX: 15 }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[360px] h-[360px] z-50 pointer-events-none hidden lg:block"
            >
              <div className="w-full h-full bg-transparent overflow-visible">
                <GlitchImage
                  src={img}
                  isHovered={isHovered}
                  isDark={isDark ?? false}
                  isTransparent={true}
                  objectFit="contain"
                />
              </div>
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-center">
                <span className="font-mono text-[10px] opacity-40 uppercase tracking-widest bg-muted text-on-dark px-2 py-1 font-bold whitespace-nowrap">Protocolo_H_Fidelity_Case_{step}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="col-span-12 md:col-span-4 flex flex-col gap-[var(--spacing-2)] relative z-10">
        <p className="font-body text-sm leading-loose text-ink-muted group-hover:text-ink transition-opacity font-medium">
          {desc}
        </p>
        <span className="font-mono text-[8px] opacity-40 group-hover:opacity-100 transition-opacity uppercase font-bold tracking-widest">Recon_Ativo</span>
      </div>
    </motion.button>
  );
}
