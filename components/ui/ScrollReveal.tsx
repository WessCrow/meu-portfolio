"use client";

import React from "react";
import { motion } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  distance?: number;
  direction?: "up" | "down" | "left" | "right";
}

export function ScrollReveal({ 
  children, 
  delay = 0, 
  className = "",
  distance = 20,
  direction = "up"
}: ScrollRevealProps) {
  const offsets = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance }
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...offsets[direction]
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0,
        y: 0 
      }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.8, 
        delay, 
        ease: [0.215, 0.61, 0.355, 1] 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
