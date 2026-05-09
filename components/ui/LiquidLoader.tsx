"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface LiquidLoaderProps {
  onComplete: () => void;
  isDarkMode: boolean;
}

const LOADING_LINES = [
  "[RUNNING] Inicializando UX/UI Designer.v26...",
  "[DATA] Carregando 18 anos de registros e protocolos de design..."
];

const CHAR_SPEED     = 18;
const PAUSE_BETWEEN  = 350;
const PAUSE_EXIT     = 400;
const SESSION_KEY    = "wess-intro-seen";

export function LiquidLoader({ onComplete }: LiquidLoaderProps) {
  const alreadySeen = useRef(
    typeof sessionStorage !== "undefined" && !!sessionStorage.getItem(SESSION_KEY)
  );

  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedText, setDisplayedText]       = useState("");
  const [showCursor, setShowCursor]             = useState(true);
  const [isExiting, setIsExiting]               = useState(false);

  // Repeat visit → skip immediately, no animation
  useEffect(() => {
    if (alreadySeen.current) {
      onComplete();
      return;
    }
    sessionStorage.setItem(SESSION_KEY, "1");
  }, [onComplete]);

  // Typewriter — only runs on first visit
  useEffect(() => {
    if (alreadySeen.current) return;

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
          }, PAUSE_BETWEEN);
        } else {
          setTimeout(() => {
            setIsExiting(true);
            setTimeout(onComplete, PAUSE_EXIT);
          }, PAUSE_BETWEEN);
        }
      }
    }, CHAR_SPEED);

    return () => clearInterval(interval);
  }, [currentLineIndex, onComplete]);

  // Cursor blink
  useEffect(() => {
    if (alreadySeen.current) return;
    const id = setInterval(() => setShowCursor(p => !p), 500);
    return () => clearInterval(id);
  }, []);

  if (alreadySeen.current) return null;

  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-busy={!isExiting}
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black text-white pointer-events-none px-[var(--spacing-section)] text-center"
    >
      <div className="flex flex-col items-center w-full max-w-lg mx-auto">
        <div className="font-mono text-xs md:text-sm tracking-[0.2em] uppercase flex items-center justify-center flex-wrap gap-y-2">
          <span>{displayedText}</span>
          <span aria-hidden="true" className={`inline-block w-[2px] h-4 bg-white ml-1 transition-opacity ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
        </div>
        <span className="sr-only">Carregando o portfolio de Wess. Aguarde um momento.</span>
      </div>
    </motion.div>
  );
}
