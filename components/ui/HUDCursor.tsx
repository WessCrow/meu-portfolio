"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface HUDCursorProps {
  isHoveringClickable: boolean;
  cursorXSpring: any;
  cursorYSpring: any;
  isDarkBackground: boolean;
}

export function HUDCursor({
  isHoveringClickable,
  cursorXSpring,
  cursorYSpring,
  isDarkBackground
}: HUDCursorProps) {
  return (
    <div id="hud-cursor" className="fixed inset-0 pointer-events-none z-[9999]">
      {/* AXIS LINES — #F6F6F6 at 30% opacity */}
      <motion.div
        style={{ y: cursorYSpring, backgroundColor: '#F6F6F6', opacity: 1 }}
        className="absolute left-0 w-full h-[1px]"
      />
      <motion.div
        style={{ x: cursorXSpring, backgroundColor: '#F6F6F6', opacity: 1 }}
        className="absolute top-0 h-full w-[1px]"
      />

      {/* TERMINAL SIGHT */}
      <motion.div
        style={{ x: cursorXSpring, y: cursorYSpring }}
        className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none"
      >
        <motion.div
          animate={{ scale: isHoveringClickable ? 1.8 : 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={`relative w-6 h-6 rounded-full border-[1px] flex items-center justify-center transition-colors duration-300 ${isDarkBackground ? "border-white" : "border-black"}`}
        >
          <div className={`absolute w-[40%] h-[1px] transition-colors duration-300 ${isDarkBackground ? "bg-white" : "bg-black"}`} />
          <div className={`absolute h-[40%] w-[1px] transition-colors duration-300 ${isDarkBackground ? "bg-white" : "bg-black"}`} />
        </motion.div>
      </motion.div>
    </div>
  );
}
