"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface HUDCursorProps {
  isHoveringClickable: boolean;
  cursorXSpring: any;
  cursorYSpring: any;
  activeCase: string | null;
}

export function HUDCursor({
  isHoveringClickable,
  cursorXSpring,
  cursorYSpring,
  activeCase
}: HUDCursorProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* AXIS LINES */}
      <motion.div style={{ y: cursorYSpring }} className={`absolute left-0 w-full h-[1px] ${activeCase ? "bg-black/15" : "bg-white opacity-15 mix-blend-difference"}`} />
      <motion.div style={{ x: cursorXSpring }} className={`absolute top-0 h-full w-[1px] ${activeCase ? "bg-black/15" : "bg-white opacity-15 mix-blend-difference"}`} />

      {/* TERMINAL SIGHT */}
      <motion.div
        style={{ x: cursorXSpring, y: cursorYSpring }}
        className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none"
      >
        <motion.div
          animate={{
            scale: isHoveringClickable ? 1.8 : 1
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={`relative w-6 h-6 rounded-full border-[1px] flex items-center justify-center ${activeCase ? "border-black/40" : "border-white mix-blend-difference"}`}
        >
          <div className={`absolute w-[40%] h-[1px] transition-colors duration-200 ${activeCase ? "bg-black/40" : "bg-white"}`} />
          <div className={`absolute h-[40%] w-[1px] transition-colors duration-200 ${activeCase ? "bg-black/40" : "bg-white"}`} />
        </motion.div>
      </motion.div>
    </div>
  );
}
