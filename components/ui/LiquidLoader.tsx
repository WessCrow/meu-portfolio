"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LiquidLoaderProps {
  onComplete: () => void;
  isDarkMode: boolean;
}

const LOADING_LINES = [
  "[RUNNING] Inicializando UX/UI Designer.v26...",
  "[DATA] Carregando 18 anos de registros e protocolos de design..."
];

export function LiquidLoader({ onComplete, isDarkMode }: LiquidLoaderProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    let i = 0;
    const text = LOADING_LINES[currentLineIndex];
    if (!text) return;

    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        if (currentLineIndex < LOADING_LINES.length - 1) {
          setTimeout(() => {
            setDisplayedText("");
            setCurrentLineIndex(prev => prev + 1);
          }, 800);
        } else {
          setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => onComplete(), 800);
          }, 800);
        }
      }
    }, 40);
    return () => clearInterval(interval);
  }, [currentLineIndex, onComplete]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-busy={!isExiting}
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black text-white pointer-events-none px-[var(--spacing-section)] text-center`}
    >
      <div className="flex flex-col items-center w-full max-w-lg mx-auto">
        <div className="font-mono text-xs md:text-sm tracking-[0.2em] uppercase flex items-center justify-center flex-wrap gap-y-2">
          <span>{displayedText}</span>
          <span aria-hidden="true" className={`inline-block w-[2px] h-4 bg-white ml-1 transition-opacity ${showCursor ? 'opacity-100' : 'opacity-0'}`}>|</span>
        </div>
        <span className="sr-only">Carregando o terminal de projetos de Wess. Aguarde um momento.</span>
      </div>
    </motion.div>
  );
}
