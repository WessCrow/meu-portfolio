"use client";

import React, { useState, useEffect } from "react";

interface TypewriterTextProps {
  text: string;
  delay?: number;
  className?: string;
}

export function TypewriterText({ text, delay = 0, className = "" }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let timeoutId: number;

    const startTyping = () => {
      let currentText = "";
      let i = 0;

      const typeNextChar = () => {
        if (i < text.length) {
          currentText += text.charAt(i);
          setDisplayedText(currentText);
          i++;
          timeoutId = window.setTimeout(typeNextChar, Math.random() * 50 + 30);
        }
      };

      typeNextChar();
    };

    timeoutId = window.setTimeout(startTyping, delay * 1000);

    return () => window.clearTimeout(timeoutId);
  }, [text, delay]);

  useEffect(() => {
    const cursorInterval = window.setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => window.clearInterval(cursorInterval);
  }, []);

  return (
    <div className={`font-mono uppercase tracking-widest font-bold whitespace-pre-line leading-relaxed ${className}`}>
      {displayedText}
      <span 
        aria-hidden="true"
        className={`inline-block w-2 ml-1 bg-current transition-opacity align-bottom mb-[2px] ${showCursor ? 'opacity-100' : 'opacity-0'}`}
      >
        &nbsp;
      </span>
    </div>
  );
}
