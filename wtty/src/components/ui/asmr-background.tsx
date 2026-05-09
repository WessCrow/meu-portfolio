import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

const OVERLAY = {
  pt: {
    title: 'Fricção atmosférica',
    subtitle: 'Ambiente cinético interativo',
  },
  en: {
    title: 'Atmospheric friction',
    subtitle: 'Interactive kinetic environment',
  },
} as const;

export interface ASMRStaticBackgroundProps {
  /** Quantidade de partículas (performance). */
  particleCount?: number;
  className?: string;
  /** Textos do painel central. */
  lang?: 'pt' | 'en';
  showOverlay?: boolean;
  /** Segue o cursor com um anel (usa variáveis CSS no :root). */
  showCursorRing?: boolean;
}

/**
 * Fundo cinético canvas (vórtice magnético + partículas estilo vidro/carvão).
 * Next.js App Router: adicione `"use client"` no topo se necessário.
 */
export function ASMRStaticBackground({
  particleCount = 1000,
  className,
  lang = 'en',
  showOverlay = true,
  showCursorRing = true,
}: ASMRStaticBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const copy = OVERLAY[lang];

  useEffect(() => {
    const root = document.documentElement;
    const setMouseCss = (x: number, y: number) => {
      root.style.setProperty('--mouse-x', `${x}px`);
      root.style.setProperty('--mouse-y', `${y}px`);
    };
    const onWinMove = (e: MouseEvent) => setMouseCss(e.clientX, e.clientY);
    const onWinTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) setMouseCss(t.clientX, t.clientY);
    };
    window.addEventListener('mousemove', onWinMove);
    window.addEventListener('touchmove', onWinTouch, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onWinMove);
      window.removeEventListener('touchmove', onWinTouch);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const raw = canvas.getContext('2d');
    if (!raw) return;
    const c: CanvasRenderingContext2D = raw;

    let width = 0;
    let height = 0;
    let animationFrameId = 0;
    let particles: Particle[] = [];
    const mouse = { x: -1000, y: -1000 };
    let running = true;

    const MAGNETIC_RADIUS = 280;
    const VORTEX_STRENGTH = 0.07;
    const PULL_STRENGTH = 0.12;
    const count = Math.max(200, Math.min(2500, Math.round(particleCount)));

    class Particle {
      x = 0;
      y = 0;
      vx = 0;
      vy = 0;
      size = 0;
      alpha = 0;
      color = '';
      rotation = 0;
      rotationSpeed = 0;
      frictionGlow = 0;

      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5 + 0.5;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        const isGlass = Math.random() > 0.7;
        this.color = isGlass ? '240, 245, 255' : '80, 80, 85';
        this.alpha = Math.random() * 0.4 + 0.1;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.05;
      }

      update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAGNETIC_RADIUS && dist > 1e-4) {
          const force = (MAGNETIC_RADIUS - dist) / MAGNETIC_RADIUS;
          this.vx += (dx / dist) * force * PULL_STRENGTH;
          this.vy += (dy / dist) * force * PULL_STRENGTH;
          this.vx += (dy / dist) * force * VORTEX_STRENGTH * 10;
          this.vy -= (dx / dist) * force * VORTEX_STRENGTH * 10;
          this.frictionGlow = force * 0.7;
        } else {
          this.frictionGlow *= 0.92;
        }

        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.95;
        this.vy *= 0.95;
        this.vx += (Math.random() - 0.5) * 0.04;
        this.vy += (Math.random() - 0.5) * 0.04;
        this.rotation += this.rotationSpeed + (Math.abs(this.vx) + Math.abs(this.vy)) * 0.05;

        if (this.x < -20) this.x = width + 20;
        if (this.x > width + 20) this.x = -20;
        if (this.y < -20) this.y = height + 20;
        if (this.y > height + 20) this.y = -20;
      }

      draw() {
        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.rotation);

        const finalAlpha = Math.min(this.alpha + this.frictionGlow, 0.9);
        c.fillStyle = `rgba(${this.color}, ${finalAlpha})`;

        if (this.frictionGlow > 0.3) {
          c.shadowBlur = 8 * this.frictionGlow;
          c.shadowColor = `rgba(180, 220, 255, ${this.frictionGlow})`;
        }

        c.beginPath();
        c.moveTo(0, -this.size * 2.5);
        c.lineTo(this.size, 0);
        c.lineTo(0, this.size * 2.5);
        c.lineTo(-this.size, 0);
        c.closePath();
        c.fill();

        c.shadowBlur = 0;
        c.restore();
      }
    }

    const init = () => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      width = w;
      height = h;
      canvas.width = w;
      canvas.height = h;
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    const render = () => {
      if (!running) return;
      c.fillStyle = 'rgba(10, 10, 12, 0.18)';
      c.fillRect(0, 0, width, height);
      for (const p of particles) {
        p.update();
        p.draw();
      }
      animationFrameId = requestAnimationFrame(render);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const t = e.touches[0];
      if (t) {
        mouse.x = t.clientX - rect.left;
        mouse.y = t.clientY - rect.top;
      }
    };

    const ro = new ResizeObserver(() => init());
    ro.observe(canvas);
    window.addEventListener('resize', init);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });

    init();
    render();

    return () => {
      running = false;
      cancelAnimationFrame(animationFrameId);
      ro.disconnect();
      window.removeEventListener('resize', init);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, [particleCount]);

  return (
    <div
      className={cn(
        'relative isolate h-full min-h-[100dvh] w-full overflow-hidden bg-[#0a0a0c] cursor-none',
        className,
      )}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" aria-hidden />

      {showOverlay && (
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-4">
          <div className="rounded-sm border border-white/5 bg-white/[0.02] px-8 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm">
            <h2 className="text-center text-sm font-light uppercase tracking-[0.35em] text-white/30 md:text-xl md:tracking-[0.5em]">
              {copy.title}
            </h2>
            <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <p className="text-center text-[10px] uppercase tracking-widest text-white/15">{copy.subtitle}</p>
          </div>
        </div>
      )}

      {showCursorRing && (
        <div
          className="pointer-events-none fixed left-0 top-0 z-50 h-4 w-4 rounded-full border border-white/20 transition-transform duration-75 ease-out"
          style={{
            transform: 'translate(calc(var(--mouse-x, -100px) - 50%), calc(var(--mouse-y, -100px) - 50%))',
          }}
          aria-hidden
        />
      )}
    </div>
  );
}

export default ASMRStaticBackground;
