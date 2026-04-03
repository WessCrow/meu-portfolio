"use client";

import React, { useState, useEffect, useRef } from "react";

interface ShuffleTextProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
  once?: boolean;
}

export function ShuffleText({
  text,
  className = "",
  delay = 0,
  speed = 30,
  once = true
}: ShuffleTextProps) {
  const [displayed, setDisplayed] = useState(text);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const GLITCH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%*+-=:/|";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          setIsInView(true);
          if (once) observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [once]);

  useEffect(() => {
    if (!isInView) return;
    let frame = 0;
    const totalFrames = text.length * 2;
    const delayMs = delay * 1000;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed(
          text.split("").map((char, i) => {
            if (char === " ") return " ";
            if (i < frame / 2) return char;
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          }).join("")
        );
        frame++;
        if (frame > totalFrames) {
          setDisplayed(text);
          clearInterval(interval);
        }
      }, speed);
    }, delayMs);
    return () => clearTimeout(timer);
  }, [isInView, text, delay, speed]);

  return (
    <span 
      ref={ref} 
      className={`font-mono ${className}`} 
      aria-label={text}
    >
      {displayed}
    </span>
  );
}
