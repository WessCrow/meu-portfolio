"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { withPrefix } from "../../app/utils/paths";
import { TypewriterText } from "../ui/TypewriterText";

interface TronHeroProps {
  isDarkMode: boolean;
  heroRef: React.RefObject<HTMLDivElement | null>;
  cursorXSpring?: any;
  cursorYSpring?: any;
}

export function TronHero({ 
  isDarkMode, 
  heroRef, 
  cursorXSpring, 
  cursorYSpring 
}: TronHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const [rawBitmap, setRawBitmap] = useState<string | null>(null);

  const dummyX = useMotionValue(0);
  const dummyY = useMotionValue(0);
  const parallaxX1 = useTransform(cursorXSpring || dummyX, [0, 1920], [8, -8]);
  const parallaxY1 = useTransform(cursorYSpring || dummyY, [0, 1080], [8, -8]);

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
    let lastMouseX = -1000;
    let lastMouseY = -1000;
    let isHover = false;
    const trailPoints: { x: number, y: number, age: number }[] = [];
    const MAX_TRAIL_AGE = 50;

    const handleMove = (e: MouseEvent) => {
      const rect = mainCanvas.getBoundingClientRect();
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

    const ZONES = [
      { nx: 0.04, ny: 0.15 },
      { nx: 0.04, ny: 0.50 },
      { nx: 0.04, ny: 0.82 },
      { nx: 0.96, ny: 0.15 },
      { nx: 0.96, ny: 0.50 },
      { nx: 0.96, ny: 0.82 },
    ];

    const SKILLS = [
      '<p class="skills-line">\n  Cluster 01 [INTELIGÊNCIA]\n  Fluxos com IA\n  Descoberta Rápida\n  Sistemas de Prompt\n  Decisão por Dados\n</p>',
      '<p class="skills-line">\n  Cluster 02 [INTERFACE]\n  Design Systems\n  UX de Precisão\n  Interfaces Acessíveis\n  UI Escalável\n</p>',
      '<p class="skills-line">\n  Cluster 03 [ESTRATÉGIA]\n  Pensamento de Produto\n  Jornadas Otimizadas\n  Service Design\n  Métricas de ROI\n</p>',
      '<p class="skills-line">\n  Cluster 04 [INOVAÇÃO]\n  Pensamento Sistêmico\n  Prototipação Ágil\n  Tecnologias Emergentes\n  Liderança Estratégica\n</p>'
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
        this.holdDuration = 360; 
        this.alpha = 0.2; 
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
        ctx.font = `bold ${size}px "Geist Mono", monospace`;

        const baseC = isDarkMode ? 255 : 0; 
        ctx.fillStyle = `rgba(${baseC}, ${baseC}, ${baseC}, ${this.alpha})`;

        const isRightSide = this.x > (ctx.canvas.width / window.devicePixelRatio) / 2;
        ctx.textAlign = isRightSide ? 'right' : 'left';

        lines.forEach((row, li) => {
          const isLast = (li === lines.length - 1);
          const text = row + (isLast && this.state !== 'hold' && blink ? '█' : '');
          ctx.fillText(text, this.x, this.y + li * (size * 1.25));
        });
        ctx.textAlign = 'left';
      }
    }

    let clusters: Cluster[] = [];
    let frame = 0;
    let pulsePhase = 0;
    let clusterFrames = 0;

    const N_VAL = N;
    const RADIUS = 380;

    let animId: number;
    const loop = () => {
      frame++;
      pulsePhase += 0.045;
      clusterFrames++;

      bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

      if (clusterFrames > 60) {
        clusterFrames = 0;
        const targetCount = 2 + Math.floor(Math.random() * 3);
        if (clusters.length < targetCount && Math.random() < 0.6) {
          const zIndex = Math.floor(Math.random() * ZONES.length);
          const z = ZONES[zIndex]!;

          const px_z = z.nx * (bgCanvas.width / dpr);
          const py_z = z.ny * (bgCanvas.height / dpr);
          const isOccupied = clusters.some(c =>
            Math.abs(c.x - px_z) < 1 &&
            Math.abs(c.y - py_z) < 1
          );

          if (!isOccupied) {
            clusters.push(new Cluster(z, bgCanvas.width / dpr, bgCanvas.height / dpr));
          }
        }
      }

      const rect_inner = containerRef.current!.getBoundingClientRect();
      const mainScale_inner = Math.max(rect_inner.width / mainW, rect_inner.height / mainH);

      clusters = clusters.filter(c => c.state !== 'done');
      clusters.forEach(c => {
        c.tick();
        c.draw(bgCtx, mainScale_inner);
      });

      mainCtx.clearRect(0, 0, mainW, mainH);
      mainCtx.font = `bold ${FONT_PX}px 'Courier New', monospace`;
      mainCtx.textBaseline = 'top';

      const isMouseMoving = (mouseX !== lastMouseX || mouseY !== lastMouseY);
      if (isHover && isMouseMoving) {
        trailPoints.push({ x: mouseX, y: mouseY, age: 0 });
        lastMouseX = mouseX;
        lastMouseY = mouseY;
      }

      for (let i = trailPoints.length - 1; i >= 0; i--) {
        trailPoints[i]!.age++;
        if (trailPoints[i]!.age > MAX_TRAIL_AGE) {
          trailPoints.splice(i, 1);
        }
      }

      if (frame % 9 === 0) {
        const toSwap = Math.floor(N_VAL * 0.012);
        for (let k = 0; k < toSwap; k++) {
          const idx = Math.floor(Math.random() * N_VAL);
          const lv = bitmap[idx];
          if (lv !== undefined && lv > 0) chars[idx] = rc(lv);
        }
      }

      for (let i = 0; i < N_VAL; i++) {
        if (!bitmap[i]) continue;

        for (let t = 0; t < trailPoints.length; t++) {
          const tr = trailPoints[t]!;
          const dx = px[i]! - tr.x;
          const dy = py[i]! - tr.y;
          const distSq = dx * dx + dy * dy;

          const factor = 1 - (tr.age / MAX_TRAIL_AGE);
          const radius = 42 * factor;
          const rSq = radius * radius;

          if (distSq < rSq && distSq > 0.1) {
            const dist = Math.sqrt(distSq);
            const penetration = radius - dist;
            const pushX = (dx / dist) * penetration;
            const pushY = (dy / dist) * penetration;

            px[i] += pushX * 0.8;
            py[i] += pushY * 0.8;
            vx[i] += pushX * 0.15;
            vy[i] += pushY * 0.15;
          }
        }

        if (px[i]! < -12 || px[i]! > mainW + 12) continue;

        const disp = Math.sqrt((px[i]! - ox[i]!) ** 2 + (py[i]! - oy[i]!) ** 2);

        vx[i] += (ox[i]! - px[i]!) * 0.016;
        vy[i] += (oy[i]! - py[i]!) * 0.016;
        vx[i] *= 0.84;
        vy[i] *= 0.84;

        px[i] += vx[i]!;
        py[i] += vy[i]!;

        const lv_val = bitmap[i]!;
        let b = 0;
        if (lv_val === 4) b = 255;
        else if (lv_val === 3) b = 190;
        else if (lv_val === 2) b = 130;
        else b = 70;

        const fade = Math.max(0, 1 - (disp / 90));
        if (fade <= 0.01) continue;

        let dustColor;
        if (isDarkMode) {
          dustColor = disp < 1.0 ? b : Math.min(255, b + disp * 2.0);
        } else {
          dustColor = disp < 1.0 ? (255 - b) : Math.max(0, (255 - b) - disp * 2.0);
        }

        const alpha = disp < 0.5 ? 1.0 : (0.5 + 0.5 * fade);

        mainCtx.fillStyle = `rgba(${dustColor}, ${dustColor}, ${dustColor}, ${alpha})`;
        mainCtx.fillText(chars[i]!, px[i]!, py[i]!);
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
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(circle, ${isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />
      <div className={`relative w-full h-full flex items-center justify-center overflow-hidden pointer-events-none ${isDarkMode ? "mix-blend-screen" : "mix-blend-multiply"}`}>
        <canvas
          ref={mainCanvasRef}
          className="relative z-10 cursor-none w-full h-full object-cover pointer-events-auto scale-[1.2] origin-bottom md:origin-center opacity-50"
        />
      </div>
      <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-center items-center md:flex-row md:justify-between w-full max-w-[1920px] mx-auto px-6 md:px-16 lg:px-32 xl:px-48">
        <motion.div style={{ x: parallaxX1 }} className="flex flex-col w-full md:w-auto">
          <div className={`flex flex-col items-center md:items-start text-center md:text-left gap-4 md:gap-6 ${isDarkMode ? "text-white" : "text-black"} md:-translate-x-[20%]`}>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="font-mono font-bold text-[10px] md:text-xs lg:text-sm tracking-[0.2em]"
            >
              Olá, eu sou o
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
              Designer com 18 anos de experiência em produtos digitais. Utilizo IA para acelerar discovery, reduzir retrabalho e entregar interfaces de alta performance para negócios que escalam.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
