"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import {
   MoveUpRight, Terminal, Command, Globe, Target,
   Plus, X, ArrowRight, Search, MousePointer2, Eye, Fingerprint, Activity, Pointer
} from "lucide-react";

/**
 * WESS PORTFOLIO — TRADITIONAL_LOG [VERSION_0.7.1]
 * Protocolo: Foco em Fidelidade Técnica e Clareza Estratégica
 * Status: Restaurado para a estrutura original de 0.7.1
 */

/**
 * ANIMATED_TEXT [MODULE_V1.2]
 * Protocolo: Revelação escalonada para máxima fidelidade visual
 */

export { withPrefix } from "./utils/paths";
import { withPrefix } from "./utils/paths";
import CaseStudyView from "./CaseStudyView";

export function AnimatedText({
   text,
   type = "words",
   className = "",
   delay = 0,
   stagger = 0.05,
   once = true,
   yOffset = 25
}: {
   text: string,
   type?: "words" | "chars",
   className?: string,
   delay?: number,
   stagger?: number,
   once?: boolean,
   yOffset?: number
}) {
   const elements = type === "words" ? text.split(" ") : text.split("");

   const container = {
      hidden: { opacity: 0 },
      visible: {
         opacity: 1,
         transition: {
            staggerChildren: stagger,
            delayChildren: delay
         }
      }
   };

   const item: any = {
      hidden: {
         opacity: 0,
         y: yOffset,
         filter: "blur(12px)"
      },
      visible: {
         opacity: 1,
         y: 0,
         filter: "blur(0px)",
         transition: {
            duration: 1.2,
            ease: [0.215, 0.61, 0.355, 1]
         }
      }
   };


   return (
      <motion.div
         variants={container}
         initial="hidden"
         whileInView="visible"
         viewport={{ once, margin: "-5% 0px -5% 0px" }}
         className={className}
         style={{ display: className.includes('block') ? 'block' : 'inline-block' }}
      >
         {elements.map((el, i) => (
            <motion.span
               key={i}
               variants={item}
               className="inline-block"
               style={{ whiteSpace: "pre" }}
            >
               {el}{type === "words" && i !== elements.length - 1 ? "\u00A0" : ""}
            </motion.span>
         ))}
      </motion.div>
   );
}

/**
 * SHUFFLE_TEXT [MODULE_V1.0]
 * Protocolo: Character scramble animates on scroll-entry, then resolves to final text.
 * Inspired by: artefakt.mov <c-shuffle-chars>
 */
export function ShuffleText({
   text,
   className = "",
   delay = 0,
   speed = 30,
   once = true
}: {
   text: string;
   className?: string;
   delay?: number;
   speed?: number;
   once?: boolean;
}) {
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
            if (frame > totalFrames) { setDisplayed(text); clearInterval(interval); }
         }, speed);
      }, delayMs);
      return () => clearTimeout(timer);
   }, [isInView, text, delay, speed]);

   return <span ref={ref} className={`font-mono ${className}`} aria-label={text}>{displayed}</span>;
}


const CLIENTS = [
   "Einstein Hospital Israelita",
   "Lenovo",
   "GYMPASS",
   "PSA Peugeot",
   "Claro",
   "Hershey's",
   "Hotels.com",
   "YOUCOM",
   "Grupo DPSP",
   "ACSC"
];

export function GlitchImage({ src, isHovered, isDark = false, isTransparent = false, objectFit = "cover" }: { src: string, isHovered: boolean, isDark?: boolean, isTransparent?: boolean, objectFit?: "cover" | "contain" }) {
   return (
      <div className={`relative w-full h-full ${!isTransparent ? "overflow-hidden" : "overflow-visible"} ${!isTransparent ? (isDark ? "bg-black" : "bg-white") : "bg-transparent"}`}>
         <img
            src={src}
            alt="Preview"
            className={`w-full h-full grayscale transition-all duration-700 ease-out ${objectFit === "cover" ? "object-cover" : "object-contain"} ${isHovered ? 'brightness-[1.1] grayscale-0' : 'scale-100 grayscale'}`}
         />
      </div>
   );
}

const TypewriterText = ({ text, delay = 0, className = "" }: { text: string, delay?: number, className?: string }) => {
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
         <span className={`inline-block w-2 ml-1 bg-current transition-opacity align-bottom mb-[2px] ${showCursor ? 'opacity-100' : 'opacity-0'}`}>&nbsp;</span>
      </div>
   );
};

/**
 * TRON_HERO [COMPONENT_V4.0]
 * Dual-canvas | Particle physics | Magnetic Cursor | Ambient Clusters
 */
export function TronHero({ isDarkMode, heroRef, cursorXSpring, cursorYSpring }: { isDarkMode: boolean; heroRef: React.RefObject<HTMLDivElement | null>; cursorXSpring?: any; cursorYSpring?: any }) {
   const containerRef = useRef<HTMLDivElement>(null);
   const bgCanvasRef = useRef<HTMLCanvasElement>(null);
   const mainCanvasRef = useRef<HTMLCanvasElement>(null);
   const [rawBitmap, setRawBitmap] = useState<string | null>(null);

   const dummyX = useMotionValue(0);
   const dummyY = useMotionValue(0);
   const parallaxX1 = useTransform(cursorXSpring || dummyX, [0, 1920], [8, -8]);
   const parallaxY1 = useTransform(cursorYSpring || dummyY, [0, 1080], [8, -8]);
   const parallaxX2 = useTransform(cursorXSpring || dummyX, [0, 1920], [15, -15]);
   const parallaxY2 = useTransform(cursorYSpring || dummyY, [0, 1080], [15, -15]);

   useEffect(() => {
      fetch(withPrefix("/img/wess_tron_raw.txt"))
         .then(res => res.text())
         .then(text => setRawBitmap(text.trim()))
         .catch(err => console.error("Failed to load Tron ASCII raw data", err));
   }, []);

   useEffect(() => {
      if (!rawBitmap || !bgCanvasRef.current || !mainCanvasRef.current || !containerRef.current) return;

      const bgCanvas = bgCanvasRef.current;
      const mainCanvas = mainCanvasRef.current;
      const bgCtx = bgCanvas.getContext('2d');
      const mainCtx = mainCanvas.getContext('2d', { willReadFrequently: true });
      if (!bgCtx || !mainCtx) return;

      const dpr = window.devicePixelRatio || 1;

      // Config
      const COLS = 160;
      const ROWS = 65;
      const FONT_PX = 14.0;
      const CHAR_W = FONT_PX * 0.60;
      const CHAR_H = FONT_PX * 1.12;
      const PAD = 16;

      const mainW = Math.floor(COLS * CHAR_W + PAD * 2);
      const mainH = Math.floor(ROWS * CHAR_H + PAD * 2);

      mainCanvas.width = mainW * dpr;
      mainCanvas.height = mainH * dpr;
      mainCtx.scale(dpr, dpr);

      const resizeBg = () => {
         const rect = containerRef.current!.getBoundingClientRect();
         bgCanvas.width = rect.width * dpr;
         bgCanvas.height = rect.height * dpr;
         bgCtx.scale(dpr, dpr);
      };
      window.addEventListener('resize', resizeBg);
      resizeBg();

      // Particles Init
      const N = COLS * ROWS;
      const px = new Float32Array(N);
      const py = new Float32Array(N);
      const ox = new Float32Array(N);
      const oy = new Float32Array(N);
      const vx = new Float32Array(N);
      const vy = new Float32Array(N);
      const aOff = new Float32Array(N);
      const bitmap = new Uint8Array(N);

      const POOLS = [
         '',
         '. , -',
         ': ; ~ +',
         'x X = * %',
         '# @ W 8 B M &'
      ];
      const chars = new Array(N).fill('');
      const rc = (lv: number) => {
         const p = POOLS[lv];
         if (!p) return '';
         const opts = p.replace(/ /g, '');
         return opts[Math.floor(Math.random() * opts.length)] || '';
      };

      for (let i = 0; i < N; i++) {
         const lv = parseInt(rawBitmap[i] || '0', 10);
         bitmap[i] = lv;
         if (lv > 0) {
            const col = i % COLS;
            const row = Math.floor(i / COLS);
            const x = PAD + col * CHAR_W;
            const y = PAD + row * CHAR_H;
            ox[i] = x;
            oy[i] = y;
            px[i] = x;
            py[i] = y;

            aOff[i] = Math.random() * Math.PI * 2;
            chars[i] = rc(lv);
         }
      }

      let mouseX = -1000;
      let mouseY = -1000;
      let lastMouseX = -1000;  // Track if mouse is moving
      let lastMouseY = -1000;
      let isHover = false;
      const trailPoints: { x: number, y: number, age: number }[] = [];
      const MAX_TRAIL_AGE = 50; // The length of the brush stroke "tail"

      const handleMove = (e: MouseEvent) => {
         const rect = mainCanvas.getBoundingClientRect();
         // Account for object-cover scaling and centered cropping
         // We use mainW and mainH instead of mainCanvas.width since particles live in logical space (unscaled by dpr)
         const scale = Math.max(rect.width / mainW, rect.height / mainH);
         const displayW = mainW * scale;
         const displayH = mainH * scale;
         const offsetX = (rect.width - displayW) / 2;
         const offsetY = (rect.height - displayH) / 2;

         mouseX = (e.clientX - rect.left - offsetX) / scale;
         mouseY = (e.clientY - rect.top - offsetY) / scale;
         isHover = true;
      };
      const handleLeave = () => {
         isHover = false;
      };

      mainCanvas.addEventListener('mousemove', handleMove);
      mainCanvas.addEventListener('mouseleave', handleLeave);

      // Clusters (ambient code)
      const ZONES = [
         { nx: 0.04, ny: 0.15 },  // TL (Left Aligned)
         { nx: 0.04, ny: 0.50 },  // ML (Left Aligned)
         { nx: 0.04, ny: 0.82 },  // BL (Left Aligned)
         { nx: 0.96, ny: 0.15 },  // TR (Right Aligned)
         { nx: 0.96, ny: 0.50 },  // MR (Right Aligned)
         { nx: 0.96, ny: 0.82 },  // BR (Right Aligned)
      ];

      const SKILLS = [
         '<p class="skills-line">\n  AI Engineer\n  UX Research\n  Behavioral Analysis\n  Data-Driven Insights\n  Human-Centered Design\n</p>',
         '<p class="skills-line">\n  UI Designer\n  Design Systems\n  Visual Architecture\n  Interaction Design\n  Accessibility\n</p>',
         '<p class="skills-line">\n  UX Designer\n  Service Design\n  Journey Mapping\n  Experience Strategy\n  Product Thinking\n</p>',
         '<p class="skills-line">\n  Innovation Designer\n  Systems Thinking\n  Emerging Technologies\n  Prototyping\n  Strategic Design\n</p>'
      ];

      const makeLines = () => {
         const skill = SKILLS[Math.floor(Math.random() * SKILLS.length)];
         return skill!.split('\n');
      };

      class Cluster {
         x: number; y: number;
         full: string;
         visible: number;
         total: number;
         state: 'typing' | 'hold' | 'deleting' | 'done';
         typeDelay: number;
         holdTimer: number;
         typeSpeed: number;
         deleteSpeed: number;
         holdDuration: number;
         alpha: number;

         constructor(zone: { nx: number, ny: number }, canvasW: number, canvasH: number) {
            this.x = zone.nx * canvasW;
            this.y = zone.ny * canvasH;
            this.full = makeLines().join('\n');
            this.total = this.full.length;
            this.visible = 0;
            this.state = 'typing';
            this.typeDelay = 0;
            this.holdTimer = 0;
            this.typeSpeed = 10 + Math.floor(Math.random() * 15);
            this.deleteSpeed = 5 + Math.floor(Math.random() * 10);
            this.holdDuration = 360; // Hold much longer
            this.alpha = 0.2; // 20% opacity (mais apagado)
         }

         tick() {
            if (this.state === 'typing') {
               if (++this.typeDelay >= this.typeSpeed) {
                  this.typeDelay = 0;
                  this.visible = Math.min(this.visible + 1, this.total);
                  if (this.visible >= this.total) {
                     this.state = 'hold';
                     this.holdTimer = 0;
                  }
               }
            } else if (this.state === 'hold') {
               if (++this.holdTimer >= this.holdDuration) {
                  this.state = 'deleting';
                  this.typeDelay = 0;
               }
            } else if (this.state === 'deleting') {
               if (++this.typeDelay >= this.deleteSpeed) {
                  this.typeDelay = 0;
                  this.visible = Math.max(this.visible - 1, 0);
                  if (this.visible <= 0) {
                     this.state = 'done';
                  }
               }
            }
         }

         draw(ctx: CanvasRenderingContext2D, mainScale: number = 1.0) {
            const lines = this.full.slice(0, this.visible).split('\n');
            const blink = Math.floor(Date.now() / 400) % 2 === 0;
            const size = (FONT_PX * 0.90) * mainScale;
            // Match exactly Geist Mono
            ctx.font = `bold ${size}px "Geist Mono", monospace`;

            const baseC = isDarkMode ? 255 : 0; // Pure white/black for base before alpha
            ctx.fillStyle = `rgba(${baseC}, ${baseC}, ${baseC}, ${this.alpha})`;

            // Right-align text if it's placed on the right side of the screen (e.g nx > 0.5)
            // ctx.canvas.width is the physical width, our this.x is logical.
            const isRightSide = this.x > (ctx.canvas.width / window.devicePixelRatio) / 2;
            ctx.textAlign = isRightSide ? 'right' : 'left';

            lines.forEach((row, li) => {
               const isLast = (li === lines.length - 1);
               const text = row + (isLast && this.state !== 'hold' && blink ? '█' : '');
               // Tighter line-spacing (1.25 instead of 1.50)
               ctx.fillText(text, this.x, this.y + li * (size * 1.25));
            });
            // Reset text align for other drawings
            ctx.textAlign = 'left';
         }
      }

      let clusters: Cluster[] = [];
      let frame = 0;
      let pulsePhase = 0;
      let clusterFrames = 0;

      // Massive interaction radius for space dust
      const RADIUS = 380;
      const RCX = RADIUS / CHAR_W;
      const RCY = RADIUS / CHAR_H;

      let animId: number;
      const loop = () => {
         frame++;
         pulsePhase += 0.045;
         clusterFrames++;

         // BG Layer TICK
         bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

         // Módulo de Spawn Desordenado e Assimétrico (Ex: 2x1, 1x3, 1x1)
         if (clusterFrames > 60) {
            clusterFrames = 0;
            const targetCount = 2 + Math.floor(Math.random() * 3); // De 2 a 4 skills no total
            if (clusters.length < targetCount && Math.random() < 0.6) {
               const zIndex = Math.floor(Math.random() * ZONES.length);
               const z = ZONES[zIndex]!;

               // Validação de colisão de zona (Impede texto encavalar)
               const px = z.nx * (bgCanvas.width / dpr);
               const py = z.ny * (bgCanvas.height / dpr);
               const isOccupied = clusters.some(c =>
                  Math.abs(c.x - px) < 1 &&
                  Math.abs(c.y - py) < 1
               );

               if (!isOccupied) {
                  clusters.push(new Cluster(z, bgCanvas.width / dpr, bgCanvas.height / dpr));
               }
            }
         }

         const rect = containerRef.current!.getBoundingClientRect();
         const mainScale = Math.max(rect.width / mainW, rect.height / mainH);

         clusters = clusters.filter(c => c.state !== 'done');
         clusters.forEach(c => {
            c.tick();
            c.draw(bgCtx, mainScale);
         });

         // Main Layer TICK
         mainCtx.clearRect(0, 0, mainW, mainH);
         mainCtx.font = `bold ${FONT_PX}px 'Courier New', monospace`;
         mainCtx.textBaseline = 'top';

         const pulse = 0.55 + 0.45 * Math.sin(pulsePhase);

         // Trail Physics Tick
         const isMouseMoving = (mouseX !== lastMouseX || mouseY !== lastMouseY);
         if (isHover && isMouseMoving) {
            // Adds the "head" of the brush stroke only when actively moving
            trailPoints.push({ x: mouseX, y: mouseY, age: 0 });
            lastMouseX = mouseX;
            lastMouseY = mouseY;
         }

         // Age and prune the trail
         for (let i = trailPoints.length - 1; i >= 0; i--) {
            trailPoints[i].age++;
            if (trailPoints[i]!.age > MAX_TRAIL_AGE) {
               trailPoints.splice(i, 1);
            }
         }

         // ASCII Breathing effect
         if (frame % 9 === 0) {
            const toSwap = Math.floor(N * 0.012);
            for (let k = 0; k < toSwap; k++) {
               const idx = Math.floor(Math.random() * N);
               const lv = bitmap[idx];
               if (lv !== undefined && lv > 0) chars[idx] = rc(lv);
            }
         }

         for (let i = 0; i < N; i++) {
            if (!bitmap[i]) continue;

            // Water Trail Deconstruction Physics (Grosso para Fino)
            for (let t = 0; t < trailPoints.length; t++) {
               const tr = trailPoints[t]!;
               const dx = px[i]! - tr.x;
               const dy = py[i]! - tr.y;
               const distSq = dx * dx + dy * dy;

               const factor = 1 - (tr.age / MAX_TRAIL_AGE); // 1.0 at head, 0.0 at tail
               const radius = 42 * factor; // Thick to thin teardrop radius (35 + 20%)
               const rSq = radius * radius;

               if (distSq < rSq && distSq > 0.1) {
                  const dist = Math.sqrt(distSq);
                  const penetration = radius - dist;
                  const pushX = (dx / dist) * penetration;
                  const pushY = (dy / dist) * penetration;

                  // Immediately snap to the edge of the rigid body
                  px[i] += pushX * 0.8;
                  py[i] += pushY * 0.8;

                  // Also add physical velocity so they float elastically outward from the stack
                  vx[i] += pushX * 0.15;
                  vy[i] += pushY * 0.15;
               }
            }

            if (px[i]! < -12 || px[i]! > mainW + 12) continue;

            const disp = Math.sqrt((px[i] - ox[i]) ** 2 + (py[i] - oy[i]) ** 2);

            // Space Dust Fluid Spring Physics
            // Higher friction and slower spring creates the liquid re-filling effect
            vx[i] += (ox[i]! - px[i]!) * 0.016;
            vy[i] += (oy[i]! - py[i]!) * 0.016;
            vx[i] *= 0.84;
            vy[i] *= 0.84;

            px[i] += vx[i]!;
            py[i] += vy[i]!;

            // Space Dust Grayscale Colors - Maximum Contrast & Detail Rule
            const lv = bitmap[i]!;

            // Explicit contrast steps instead of linear math
            let b = 0;
            if (lv === 4) b = 255;
            else if (lv === 3) b = 190;
            else if (lv === 2) b = 130;
            else b = 70;

            // Fade out smoothly based on displacement (particles fly away)
            const fade = Math.max(0, 1 - (disp / 90));
            if (fade <= 0.01) continue;

            // White dust on Dark Mode, Dark dust on Light Mode
            let dustColor;
            if (isDarkMode) {
               dustColor = disp < 1.0 ? b : Math.min(255, b + disp * 2.0);
            } else {
               dustColor = disp < 1.0 ? (255 - b) : Math.max(0, (255 - b) - disp * 2.0);
            }

            // Keep alpha at 1.0 when resting for max detail, otherwise fade the 'trail' slightly
            const alpha = disp < 0.5 ? 1.0 : (0.5 + 0.5 * fade);

            mainCtx.fillStyle = `rgba(${dustColor}, ${dustColor}, ${dustColor}, ${alpha})`;
            mainCtx.fillText(chars[i], px[i], py[i]);
         }

         animId = requestAnimationFrame(loop);
      };

      loop();

      return () => {
         cancelAnimationFrame(animId);
         mainCanvas.removeEventListener('mousemove', handleMove);
         mainCanvas.removeEventListener('mouseleave', handleLeave);
         window.removeEventListener('resize', resizeBg);
      };
   }, [rawBitmap, isDarkMode]);

   return (
      <div
         ref={(node) => {
            if (containerRef) (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
            if (heroRef) (heroRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
         }}
         className={`absolute inset-0 overflow-hidden flex items-center justify-center transition-colors duration-1000 select-none ${isDarkMode ? "bg-[#060606]" : "bg-white"}`}
      >
         <canvas ref={bgCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

         {/* HERO DOT-GRID BACKGROUND */}
         <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
               backgroundImage: `radial-gradient(circle, ${isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} 1px, transparent 1px)`,
               backgroundSize: '24px 24px'
            }}
         />

         {/* Main container keeps aspect ratio centered */}
         <div className={`relative w-full h-full flex items-center justify-center overflow-hidden pointer-events-none ${isDarkMode ? "mix-blend-screen" : "mix-blend-multiply"}`}>
            <canvas
               ref={mainCanvasRef}
               className="relative z-10 cursor-none w-full h-full object-cover pointer-events-auto scale-[1.2] origin-bottom md:origin-center opacity-50"
            />
         </div>

         {/* UI OVERLAYS */}
         <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-center items-center md:flex-row md:justify-between w-full max-w-[1920px] mx-auto px-6 md:px-16 lg:px-32 xl:px-48">
            {/* Left Overlay */}
            <motion.div style={{ x: parallaxX1, y: parallaxY1 }} className="flex flex-col w-full md:w-auto">
               <div className={`flex flex-col items-center md:items-start text-center md:text-left gap-4 md:gap-6 ${isDarkMode ? "text-white" : "text-black"} md:-translate-x-[20%]`}>
                  <motion.span
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.2, duration: 0.8 }}
                     className="font-mono  font-bold text-[10px] md:text-xs lg:text-sm tracking-[0.2em]"
                  >
                     Bem-vindo! eu sou o
                  </motion.span>
                  <motion.img
                     initial={{ opacity: 0, filter: "blur(10px)", scale: 1.1 }}
                     animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                     transition={{ delay: 0.3, duration: 1.2, ease: "easeOut" }}
                     src={withPrefix("/img/logo_wess.svg")}
                     alt="Wess Logo"
                     className={`w-[260px] md:w-[330px] lg:w-[700px] object-contain ${!isDarkMode ? "invert" : ""}`}
                  />
                  <motion.p
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.5, duration: 1 }}
                     className="font-body text-xs md:text-sm lg:text-base opacity-60 max-w-[320px] md:max-w-[700px] leading-relaxed font-medium hidden md:block"
                  >
                     Designer estratégico com 18 anos de bagagem em ux e produtos digitais, entrego interfaces de alta resolução para serviços memoraveis.
                  </motion.p>

               </div>
            </motion.div>

            {/* Right Overlay - REMOVED AS REQUESTED */}
            {false && (
               <motion.div style={{ x: parallaxX2, y: parallaxY2 }} className="hidden md:flex flex-col w-full md:w-auto">
                  <div className={`flex flex-col items-center ${isDarkMode ? "text-white" : "text-[rgba(0,0,0,0.7)]"} md:-translate-x-[50%] lg:-translate-x-[100%] translate-y-[5%]`}>
                     <TypewriterText text={`INICIALIZANDO\nTERMINAL DE\nPROJETOS...`} delay={0.8} className="text-[9px] md:text-xs tracking-[0.2em] text-center" />
                  </div>
               </motion.div>
            )}
         </div>
      </div>
   );
}



export function HUDCursor({
   isHoveringClickable,
   cursorXSpring,
   cursorYSpring,
   activeCase
}: {
   isHoveringClickable: boolean;
   cursorXSpring: any;
   cursorYSpring: any;
   activeCase: string | null;
}) {
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

export function ProjectRow({ step, title, desc, img, isDark, icon: Icon, onClick }: { step: string, title: string, desc: string, img: string, isDark?: boolean, icon?: React.ElementType, onClick?: () => void }) {
   const [isHovered, setIsHovered] = useState(false);

   return (
      <motion.div
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}
         onClick={onClick}
         whileHover={{ zIndex: 50, transition: { duration: 0 } }}
         className="grid grid-cols-1 md:grid-cols-12 border-b border-muted p-[var(--spacing-section)] items-center group cursor-pointer hover:bg-surface-sunken transition-colors relative"
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
            <p className="font-body text-sm leading-relaxed text-ink-muted group-hover:text-ink transition-opacity font-medium">
               {desc}
            </p>
            <span className="font-mono text-[8px] opacity-40 group-hover:opacity-100 transition-opacity uppercase font-bold tracking-widest">Recon_Ativo</span>
         </div>
      </motion.div>
   );
}


export default function WessPortfolio() {
   const [isMounted, setIsMounted] = useState(false);
   const [isLoading, setIsLoading] = useState(true);
   const [isDarkMode, setIsDarkMode] = useState(true);
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const [isHoveringClickable, setIsHoveringClickable] = useState(false);
   const [isScrolled, setIsScrolled] = useState(false);
   const [activeCase, setActiveCase] = useState<string | null>(null);
   const cursorX = useMotionValue(-100);
   const cursorY = useMotionValue(-100);
   const heroRef = useRef<HTMLDivElement>(null);


   useEffect(() => {
      // FORCE DARK MODE BY DEFAULT - CLEAR PREVIOUS SESSION STATE
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
      localStorage.setItem("wess-theme", "dark");
   }, []);

   // Handle Case Study Theme Isolation
   useEffect(() => {
      if (activeCase) {
         // Force light mode on document level ONLY for Case Studies
         document.documentElement.classList.remove("dark");
      } else {
         // Landing page is ALWAYS dark by standard
         document.documentElement.classList.add("dark");
      }
   }, [activeCase]);

   const toggleTheme = () => {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      if (newTheme) {
         document.documentElement.classList.add("dark");
         localStorage.setItem("wess-theme", "dark");
      } else {
         document.documentElement.classList.remove("dark");
         localStorage.setItem("wess-theme", "light");
      }
   };

   const springConfig = { damping: 30, stiffness: 400 };
   const cursorXSpring = useSpring(cursorX, springConfig);
   const cursorYSpring = useSpring(cursorY, springConfig);

   useEffect(() => {
      setIsMounted(true);
      const moveCursor = (e: MouseEvent) => {
         cursorX.set(e.clientX);
         cursorY.set(e.clientY);
      };

      const handleMouseOver = (e: MouseEvent) => {
         const target = e.target as HTMLElement;
         if (!target) return;

         const isClickable = target.closest('button') ||
            target.closest('a') ||
            target.closest('[role="button"]') ||
            target.closest('.cursor-pointer');

         setIsHoveringClickable(!!isClickable);
      };

      const handleScroll = () => {
         setIsScrolled(window.scrollY > 20);
      };

      window.addEventListener("mousemove", moveCursor);
      window.addEventListener("mouseover", handleMouseOver);
      window.addEventListener("scroll", handleScroll);
      return () => {
         window.removeEventListener("mousemove", moveCursor);
         window.removeEventListener("mouseover", handleMouseOver);
         window.removeEventListener("scroll", handleScroll);
      };
   }, []);



   if (!isMounted) return null;

   return (
      <div className={`relative min-h-screen overflow-x-hidden selection:bg-ink selection:text-canvas cursor-none transition-colors duration-1000 ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}>
         <AnimatePresence>
            {isLoading && <LiquidLoader onComplete={() => setIsLoading(false)} isDarkMode={isDarkMode} />}
         </AnimatePresence>
         <HUDCursor isHoveringClickable={isHoveringClickable} cursorXSpring={cursorXSpring} cursorYSpring={cursorYSpring} activeCase={activeCase} />

         {/* HEADER PROTOCOL (0.7.1) */}
         <header className={`fixed top-0 left-0 w-full z-[80] border-b border-muted transition-colors px-6 md:px-8 h-[53px] flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] font-normal ${isDarkMode ? "bg-black/90 text-white backdrop-blur-md" : "bg-white text-black"}`}>
            {/* LOGO */}
            <div className="flex items-center gap-6">
               <div className={`transition-all duration-500 overflow-hidden flex items-center ${!isScrolled ? 'w-0 opacity-0 -ml-6' : 'w-[28px] opacity-100'}`}>
                  <div className={`w-[28px] h-[28px] bg-ink grayscale shrink-0 ${isDarkMode ? "opacity-100" : "opacity-60"}`} style={{ maskImage: `url(${withPrefix("/logo_black.svg")})`, maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }} />
               </div>
               <div className="flex items-center gap-2">
                  <span className="hidden md:inline opacity-50 tracking-widest uppercase text-white drop-shadow-md">Wess // Soluções em design que conectam usuários e negócios desde 2008.</span>
                  <span className="md:hidden opacity-50 tracking-widest uppercase text-white drop-shadow-md">Wess // Projetando desde 2008.</span>
               </div>
            </div>

            {/* DESKTOP NAV */}
            <div className={`hidden md:flex items-center gap-10 transition-all duration-500 overflow-hidden ${!isScrolled ? 'opacity-0 translate-y-[-10px] pointer-events-none' : 'opacity-100 translate-y-0'}`}>
               {(
                  [["cases", "PROJETOS"], ["experience", "EXPERIÊNCIA"], ["connect", "CONTATO"]] as const
               ).map(([anchor, label]) => (
                  <a key={anchor} href={`#${anchor}`} className="hover:line-through transition-all opacity-90 hover:opacity-100 text-white drop-shadow-md">{label}</a>
               ))}
            </div>

            {/* MOBILE RIGHT: HAMBURGER */}
            <div className="flex md:hidden items-center gap-4">
               <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex flex-col gap-[5px] cursor-none p-1"
                  aria-label="Menu"
               >
                  <motion.span animate={{ rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? 7 : 0 }} className="block w-5 h-[1.5px] bg-ink origin-center transition-all" />
                  <motion.span animate={{ opacity: isMenuOpen ? 0 : 1 }} className="block w-5 h-[1.5px] bg-ink" />
                  <motion.span animate={{ rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? -7 : 0 }} className="block w-5 h-[1.5px] bg-ink origin-center transition-all" />
               </button>
            </div>
         </header>

         {/* MOBILE MENU OVERLAY */}
         <AnimatePresence>
            {isMenuOpen && (
               <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.25 }}
                  className={`fixed top-[53px] left-0 w-full z-[79] ${isDarkMode ? "bg-black" : "bg-white"} border-b border-muted flex flex-col font-mono text-[11px] uppercase tracking-[0.3em] md:hidden`}
               >
                  {([["cases", "PROJETOS"], ["experience", "EXPERIÊNCIA"], ["connect", "CONTATO"]] as const).map(([anchor, label]) => (
                     <a
                        key={anchor}
                        href={`#${anchor}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="px-6 py-5 border-b border-muted opacity-60 hover:opacity-100 hover:bg-surface-sunken transition-all"
                     >{label}</a>
                  ))}
               </motion.div>
            )}
         </AnimatePresence>

         <main className="pt-[53px] max-w-[1920px] mx-auto min-h-[calc(100vh-53px)]">

            {/* TRON ASCII HERO — REBOOTED v4.0 */}
            <section
               className={`col-span-12 h-[100dvh] min-h-[600px] -mt-[53px] pt-[53px] w-full flex items-center justify-center border-b border-muted overflow-hidden relative transition-colors duration-1000 ${isDarkMode ? 'bg-[#060606]' : 'bg-white'}`}
            >
               <TronHero isDarkMode={isDarkMode} heroRef={heroRef} cursorXSpring={cursorXSpring} cursorYSpring={cursorYSpring} />
            </section>


            {/* TELEMETRY MATRIX (002) */}
            <section className={`grid grid-cols-1 md:grid-cols-12 border-b border-muted transition-colors divide-x divide-muted ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}>
               <div className="md:col-span-3 p-[var(--spacing-section)] flex items-center justify-center font-mono text-[10px] uppercase opacity-20 tracking-widest text-ink font-bold gap-3">
                  <Activity size={12} />
                  Protocolos_Ativos.v26
               </div>
               <div className="md:col-span-3 p-[var(--spacing-section)] flex flex-col gap-2 group hover:bg-surface-sunken transition-colors">
                  <div className="flex justify-between items-start">
                     <span className="font-mono text-[8px] opacity-30 uppercase tracking-[0.4em] font-bold">IAUX_LOG</span>
                     <Terminal size={12} className="opacity-10 group-hover:opacity-40" />
                  </div>
                  <span className="font-mono text-[11px] font-bold uppercase tracking-tighter ">SÊNIOR_ESTRATÉGICO</span>
               </div>
               <div className="md:col-span-3 p-[var(--spacing-section)] flex flex-col gap-2 group hover:bg-surface-sunken transition-colors">
                  <div className="flex justify-between items-start">
                     <span className="font-mono text-[8px] opacity-30 uppercase tracking-[0.4em] font-bold">VISUAL_LOG</span>
                     <Eye size={12} className="opacity-10 group-hover:opacity-40" />
                  </div>
                  <span className="font-mono text-[11px] font-bold uppercase tracking-tighter">ESPECIALISTA</span>
               </div>
               <div className="md:col-span-3 p-[var(--spacing-section)] flex flex-col gap-2 group hover:bg-surface-sunken transition-colors">
                  <div className="flex justify-between items-start">
                     <span className="font-mono text-[8px] opacity-30 uppercase tracking-[0.4em] font-bold">GESTÃO_LOG</span>
                     <Fingerprint size={12} className="opacity-10 group-hover:opacity-40" />
                  </div>
                  <span className="font-mono text-[11px] font-bold uppercase tracking-tighter">LED_NATURAL</span>
               </div>
            </section>

            {/* AREA_CASES: VERTICAL STRATEGIC SEQUENCE — TYPOGRAPHIC ALIGNMENT v1.5.0 */}
            <section id="cases" className={`col-span-12 flex flex-col transition-colors relative ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}>
               <div className={`grid grid-cols-1 md:grid-cols-12 border-b border-muted ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}>
                  <div className="md:col-span-3 p-[var(--spacing-section)] border-r border-muted flex items-center">
                     <ScrollReveal>
                        <span className="font-mono text-[9px] opacity-30 uppercase tracking-[0.4em] italic font-bold">002 // AREA_CASES</span>
                     </ScrollReveal>
                  </div>
                  <div className="md:col-span-9 p-[var(--spacing-section)]">
                     <ScrollReveal delay={0.1}>
                        <h2 className="text-4xl font-display leading-[0.8] tracking-tighter uppercase font-bold">
                           <ShuffleText text="LOG_DE_ENTREGAS" delay={0.15} speed={25} />
                        </h2>

                     </ScrollReveal>
                  </div>
               </div>
               <div className="flex flex-col">
                  <ProjectRow
                     step="01"
                     title="GC-HDLAB"
                     desc="Refatoração Capacity: Performance e Integridade de Dados no HDLab."
                     img={withPrefix("/img/mockup_hdlab.png")}
                     icon={Target}
                     onClick={() => setActiveCase("hdlab")}
                  />
                  <ProjectRow
                     step="02"
                     title="BioAIDesign"
                     desc="Otimização de Usabilidade e Centralização Metodológica."
                     img={withPrefix("/img/mockup_bioai.png")}
                     icon={Fingerprint}
                     onClick={() => setActiveCase("bioai")}
                  />
                  <ProjectRow
                     step="03"
                     title="Anestesia Pediátrica"
                     desc="Design Estratégico para Mitigação de Risco Clínico."
                     img={withPrefix("/img/mockup_anestesia.png")}
                     icon={Eye}
                     onClick={() => setActiveCase("anestesia")}
                  />
                  <ProjectRow
                     step="04"
                     title="Youcom"
                     desc="Design Estratégico para o Comportamento Digital."
                     img={withPrefix("/img/thumb_yc.png")}
                     icon={Plus}
                     onClick={() => setActiveCase("youcom")}
                  />
               </div>
            </section>

            {/* STRATEGIC PARTNERS (MARQUEE) — v0.9.12 */}
            <section className={`col-span-12 border-b border-muted py-12 overflow-hidden whitespace-nowrap group ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}>
               <div className="flex gap-24 animate-marquee items-center translate-z-0">
                  {[...CLIENTS, ...CLIENTS, ...CLIENTS].map((client, i) => (
                     <motion.span
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        className="font-display text-lg md:text-2xl opacity-20 hover:opacity-100 transition-all tracking-tighter uppercase font-bold hover:line-through"
                     >
                        {client}
                     </motion.span>
                  ))}
               </div>
            </section>

            {/* IDENTITY BLOCK (003 // SOLICITE) — UNIFIED PATTERN v1.7.0 */}
            <section id="experience" className={`col-span-12 flex flex-col transition-colors relative ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}>
               {/* SECTION HEADER — MATCHING 002 PATTERN */}
               <div className={`grid grid-cols-1 md:grid-cols-12 border-b border-muted ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}>
                  <div className="md:col-span-3 p-[var(--spacing-section)] border-r border-muted flex items-center">
                     <ScrollReveal>
                        <span className={`font-mono text-[9px] opacity-40 uppercase tracking-[0.4em] italic font-bold ${isDarkMode ? "text-white" : "text-black"}`}>003 // LOGS_EXPERIÊNCIAS</span>
                     </ScrollReveal>
                  </div>
                  <div className="md:col-span-9 p-[var(--spacing-section)]">
                     <ScrollReveal delay={0.1}>
                        <h2 className={`text-4xl font-display leading-[0.8] tracking-tighter uppercase font-bold ${isDarkMode ? "text-white" : "text-black"}`}>
                           <ShuffleText text="ÚLTIMOS_LOGS" delay={0.15} speed={25} />
                        </h2>

                     </ScrollReveal>
                  </div>
               </div>

               {/* SECTION CONTENT — EXPANDED TO FULL WIDTH */}
               <div className="grid grid-cols-1 md:grid-cols-12">
                  <div className={`col-span-12 p-[var(--spacing-section)] md:p-32 flex flex-col items-start justify-center relative overflow-hidden group min-h-[60vh] transition-colors ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}>
                     <ScrollReveal>
                        <h2 className={`text-3xl md:text-[50px] font-display font-bold leading-[1.1] tracking-tighter uppercase ${isDarkMode ? "text-white" : "text-black"} max-w-none md:max-w-none text-left relative z-10 transition-transform duration-1000 group-hover:translate-x-4`}>
                           <AnimatedText text="Eu construo interfaces inteligentes e intuitivas." type="words" stagger={0.1} delay={0.2} /> <br />
                           <AnimatedText text="Substituo incertezas por fluxos" type="words" stagger={0.1} delay={0.4} /> <br />
                           <AnimatedText text="objetivos que guiam o usuário com total clareza" type="words" stagger={0.1} delay={0.6} />
                        </h2>

                     </ScrollReveal>
                     {/* Subtle Scanline for consistency */}
                     <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/[0.01] to-transparent h-[100%] w-full animate-scan pointer-events-none opacity-50" />
                  </div>
               </div>
            </section>


            {/* EXPERIENCE_LOG — TYPOGRAPHIC ALIGNMENT v1.5.0 */}
            <section className={`col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-b border-muted min-h-[400px] divide-y md:divide-y-0 md:divide-x divide-muted transition-colors ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}>
               <ScrollReveal delay={0.1}><ExpCell isDark={isDarkMode} id="01" entity="EINSTEIN" role="Gestor de Inovação" desc="Design estratégico aplicado à saúde. Desenvolvimento de interfaces de alta resolução." icon={Terminal} /></ScrollReveal>
               <ScrollReveal delay={0.2}><ExpCell isDark={isDarkMode} id="02" entity="COMPASSO UOL" role="Líder de Produto" desc="Direcionamento estratégico para grandes players do varejo. Foco em escalabilidade e métricas." icon={Search} /></ScrollReveal>
               <ScrollReveal delay={0.3}><ExpCell isDark={isDarkMode} id="03" entity="BRADESCO / SABION" role="UX/UI Estrategista" desc="Entrega de interfaces centradas em resultados para plataformas de larga escala." icon={Activity} /></ScrollReveal>
               <ScrollReveal delay={0.4}><ExpCell isDark={isDarkMode} id="04" entity="TITANS GROUP" role="UX/UI" desc="Arquitetura de soluções digitais para o mercado LatAm e produtos proprietários." icon={Pointer} /></ScrollReveal>
            </section>


            {/* CONNECT_FOOTER: DIRECT CTA ARCHITECTURE — v1.3.0 */}
            <footer id="connect" className={`col-span-12 border-t border-muted transition-colors pt-24 pb-12 ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}>
               {/* TOP SECTION: CONTACT & SOCIALS */}
               <div className="px-6 md:px-12 lg:px-24 grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
                  {/* CONTACT COLS */}
                  <div className="flex flex-col gap-2">
                     <a href="mailto:contateowess@gmail.com" className="text-xl md:text-2xl font-display font-bold tracking-tighter hover:line-through transition-all lowercase">contateowess@gmail.com</a>
                     <div className="flex flex-col font-mono text-[11px] opacity-40 tracking-widest uppercase gap-1">
                        <span>log_Brasil</span>
                        <div className="flex items-center gap-2">
                           <span>Terminal_sempre_disponível</span>
                           <div className="w-2 h-2 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] rounded-sm" />
                        </div>
                     </div>
                  </div>

                  {/* CENTER: BEHANCE */}
                  <div className="flex flex-col md:items-center">
                     <a href="#" className="text-xl md:text-2xl font-display font-bold tracking-tighter hover:line-through transition-all">Behance</a>
                  </div>

                  {/* RIGHT: LINKEDIN */}
                  <div className="flex flex-col md:items-end">
                     <a href="#" className="text-xl md:text-2xl font-display font-bold tracking-tighter hover:line-through transition-all">LinkedIn</a>
                  </div>
               </div>

               {/* METADATA ROW */}
               <div className="px-6 md:px-12 lg:px-24 flex flex-col md:flex-row justify-between items-center gap-8 mb-16 font-mono text-[10px] tracking-[0.2em] opacity-40 uppercase">
                  <span>©2026 Design & Codificação feito com emoção.</span>
                  <a href="#" className="hover:line-through transition-all">Vamos conversar →</a>
                  <span>DEUS_NO_CONTROLE</span>
               </div>

               {/* MASSIVE BRANDING LOGO */}
               <div className="px-4 md:px-8 pointer-events-none select-none overflow-hidden">
                  <div className="flex justify-center items-center py-8">
                     <div
                        className={`w-full h-[150px] md:h-[250px] lg:h-[400px] transition-all duration-1000 ${isDarkMode ? "bg-white" : "bg-black"}`}
                        style={{
                           maskImage: `url(${withPrefix("/img/logo_wess.svg")})`,
                           maskSize: 'contain',
                           maskRepeat: 'no-repeat',
                           maskPosition: 'bottom center'
                        }}
                     />
                  </div>
               </div>
            </footer>
         </main>

         <AnimatePresence>
            {activeCase && (
               <CaseStudyView
                  key={activeCase}
                  isOpen={!!activeCase}
                  onClose={() => setActiveCase(null)}
                  isDarkMode={false}
                  caseId={activeCase}
                  onNext={(id) => setActiveCase(id)}
               />
            )}
         </AnimatePresence>
      </div>
   );
}


function StatusItem({ label, value }: { label: string, value: string }) {
   return (
      <div className="flex justify-between items-center border-b border-muted pb-2">
         <span className="font-mono text-[9px] opacity-30 tracking-widest uppercase">{label}</span>
         <span className="font-mono text-[9px] font-bold tracking-tighter uppercase">{value}</span>
      </div>
   );
}

export function ExpCell({ id, entity, role, desc, icon: Icon, isDark }: { id: string, entity: string, role: string, desc: string, icon?: React.ElementType, isDark?: boolean }) {
   return (
      <div className={`p-[var(--spacing-section)] border-t border-muted group hover:bg-canvas transition-colors flex flex-col h-full ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
         <div className="flex justify-between items-start mb-8">
            <span className="font-mono text-[9px] opacity-40 tracking-[0.4em] uppercase font-bold">{id} // LOG_DE_EMPRESAS</span>
            {Icon && <Icon size={14} className={`opacity-20 group-hover:opacity-100 transition-opacity ${isDark ? "text-white" : "text-ink"}`} strokeWidth={1.5} />}
         </div>
         <div className="mt-auto space-y-4">
            <h4 className="font-mono text-[10px] uppercase opacity-40 tracking-[0.3em] group-hover:opacity-100 transition-opacity uppercase font-bold">{entity}</h4>
            <h3 className={`text-2xl font-display group-hover:translate-x-1 transition-transform tracking-tight uppercase font-bold ${isDark ? "text-white" : "text-ink"}`}>
               {role}
            </h3>
            <p className={`font-body text-xs leading-relaxed transition-colors tracking-tight font-medium ${isDark ? "text-white/70" : "text-ink-muted"}`}>
               "{desc}"
            </p>
         </div>
      </div>
   )
}

export function ScrollReveal({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) {
   return (
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true, margin: "-100px" }}
         transition={{ duration: 0.8, delay, ease: [0.215, 0.61, 0.355, 1] as any }}

         className={className}
      >
         {children}
      </motion.div>
   );
}

export function ProjectTile({ id, tag, title, img, details, isDark }: { id: string, tag: string, title: string, img: string, details: string, isDark?: boolean }) {

   const [isHovered, setIsHovered] = useState(false);

   return (
      <motion.div
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}
         className="border-b border-muted group cursor-none relative overflow-hidden h-[500px] flex flex-col hover:bg-surface-sunken transition-all duration-500"
      >
         <div className="p-[var(--spacing-section)] flex justify-between items-start font-mono text-[9px] relative z-10 transition-opacity duration-500" style={{ opacity: isHovered ? 0.2 : 0.8 }}>
            <span className="opacity-40 tracking-widest uppercase font-bold">{id} // SCAN_DE_PROJETO</span>
            <span className="opacity-40 tracking-[0.2em] uppercase font-bold">{tag}</span>
         </div>
         <div className="flex-1 flex flex-col justify-end p-[var(--spacing-section)] relative z-10" style={{ opacity: isHovered ? 0.2 : 1 }}>
            <h3 className="text-5xl font-display leading-[0.8] mb-4 group-hover:translate-x-2 transition-transform duration-700 tracking-tighter uppercase font-bold text-ink">{title}</h3>
            <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} className="h-[1px] bg-muted origin-left" />
         </div>
         <div className="absolute inset-0 z-0 opacity-5 group-hover:opacity-15 transition-all duration-1000">
            <motion.img animate={{ scale: isHovered ? 1.05 : 1 }} src={img} className="w-full h-full object-cover grayscale blur-[1px] group-hover:blur-none" />
         </div>
         <AnimatePresence>
            {isHovered && (
               <motion.div
                  initial={{ opacity: 0, scale: 0.98, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.02, y: -5 }}
                  className="absolute inset-x-8 top-12 bottom-12 z-40 bg-surface/95 backdrop-blur-xl border border-muted p-[var(--spacing-section)] shadow-[0_45px_120px_rgba(0,0,0,0.15)] flex flex-col"
               >
                  <div className="flex justify-between items-start mb-8 text-ink">
                     <div className="space-y-1">
                        <h4 className="text-4xl font-display leading-[0.9] tracking-tighter uppercase font-bold">{title}</h4>
                        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-muted italic uppercase">{tag} // PROTOCOLO</p>
                     </div>
                     <div className="w-12 h-12 border border-muted flex items-center justify-center group-hover:border-ink transition-colors">
                        <MoveUpRight strokeWidth={1} size={20} className="text-ink" />
                     </div>
                  </div>
                  <div className={`flex-1 mb-[var(--spacing-8)] overflow-hidden border border-muted ${isDark ? "bg-black" : "bg-white"}`}>
                     <GlitchImage src={img} isHovered={true} isDark={isDark ?? false} />

                  </div>

                  <p className="font-body text-sm leading-relaxed text-ink/70 font-medium">"{details}"</p>
                  <div className="grid grid-cols-2 gap-[var(--spacing-4)] pb-[var(--spacing-4)] border-t border-muted pt-[var(--spacing-8)] text-[9px] font-mono tracking-widest uppercase opacity-40 mt-auto font-bold">
                     <div className="flex flex-col gap-[var(--spacing-2)]"><span>ID_SISTEMA: {id}</span><span>CAMADA_SCAN: ALTA</span></div>
                     <div className="text-right flex flex-col gap-[var(--spacing-2)]"><span>LINHA_012</span><span>STATUS: VERIFICADO</span></div>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </motion.div>
   );
}

export function LiquidLoader({ onComplete, isDarkMode }: { onComplete: () => void, isDarkMode: boolean }) {
   const text = "Carregando terminal de projetos do wess...";
   const [displayedText, setDisplayedText] = useState("");
   const [showCursor, setShowCursor] = useState(true);
   const [isExiting, setIsExiting] = useState(false);

   useEffect(() => {
      let i = 0;
      const interval = setInterval(() => {
         if (i < text.length) {
            setDisplayedText(text.slice(0, i + 1));
            i++;
         } else {
            clearInterval(interval);
            // Settle briefy then exit
            setTimeout(() => {
               setIsExiting(true);
               setTimeout(() => onComplete(), 800);
            }, 500);
         }
      }, 50);
      return () => clearInterval(interval);
   }, []);

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
         <div className="flex flex-col items-center w-full max-w-sm mx-auto">
            <div className="font-mono text-xs md:text-sm tracking-[0.3em] uppercase flex items-center justify-center flex-wrap gap-y-2">
               <span>{displayedText}</span>
               <span aria-hidden="true" className={`inline-block w-[2px] h-4 bg-white ml-1 transition-opacity ${showCursor ? 'opacity-100' : 'opacity-0'}`}>|</span>
            </div>
            {/* Screen reader only text for accessibility stability */}
            <span className="sr-only">Carregando o terminal de projetos de Wess. Aguarde um momento.</span>
         </div>
      </motion.div>
   );
}
