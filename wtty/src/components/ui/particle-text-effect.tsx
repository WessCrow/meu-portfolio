/**
 * shadcn-style UI primitive — coloque em `src/components/ui/`.
 * Next.js App Router: adicione `"use client"` como primeira linha do arquivo.
 * Vite / SPA: omita `"use client"`.
 */
import { useEffect, useRef } from 'react';

interface Vector2D {
  x: number;
  y: number;
}

class Particle {
  pos: Vector2D = { x: 0, y: 0 };
  vel: Vector2D = { x: 0, y: 0 };
  acc: Vector2D = { x: 0, y: 0 };
  target: Vector2D = { x: 0, y: 0 };

  closeEnoughTarget = 100;
  maxSpeed = 1.0;
  maxForce = 0.1;
  particleSize = 10;
  isKilled = false;

  startColor = { r: 0, g: 0, b: 0 };
  targetColor = { r: 0, g: 0, b: 0 };
  colorWeight = 0;
  colorBlendRate = 0.01;

  move() {
    let proximityMult = 1;
    const distance = Math.sqrt(
      (this.pos.x - this.target.x) ** 2 + (this.pos.y - this.target.y) ** 2,
    );

    if (distance < this.closeEnoughTarget) {
      proximityMult = distance / this.closeEnoughTarget;
    }

    const towardsTarget = {
      x: this.target.x - this.pos.x,
      y: this.target.y - this.pos.y,
    };

    const magnitude = Math.sqrt(towardsTarget.x * towardsTarget.x + towardsTarget.y * towardsTarget.y);
    if (magnitude > 0) {
      towardsTarget.x = (towardsTarget.x / magnitude) * this.maxSpeed * proximityMult;
      towardsTarget.y = (towardsTarget.y / magnitude) * this.maxSpeed * proximityMult;
    }

    const steer = {
      x: towardsTarget.x - this.vel.x,
      y: towardsTarget.y - this.vel.y,
    };

    const steerMagnitude = Math.sqrt(steer.x * steer.x + steer.y * steer.y);
    if (steerMagnitude > 0) {
      steer.x = (steer.x / steerMagnitude) * this.maxForce;
      steer.y = (steer.y / steerMagnitude) * this.maxForce;
    }

    this.acc.x += steer.x;
    this.acc.y += steer.y;

    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.acc.x = 0;
    this.acc.y = 0;
  }

  draw(ctx: CanvasRenderingContext2D, drawAsPoints: boolean) {
    if (this.colorWeight < 1.0) {
      this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1.0);
    }

    const currentColor = {
      r: Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight),
      g: Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight),
      b: Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight),
    };

    if (drawAsPoints) {
      ctx.fillStyle = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`;
      ctx.fillRect(this.pos.x, this.pos.y, 2, 2);
    } else {
      ctx.fillStyle = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`;
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.particleSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  kill(width: number, height: number) {
    if (!this.isKilled) {
      const randomPos = this.generateRandomPos(width / 2, height / 2, (width + height) / 2);
      this.target.x = randomPos.x;
      this.target.y = randomPos.y;

      this.startColor = {
        r: this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight,
        g: this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight,
        b: this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight,
      };
      this.targetColor = { r: 0, g: 0, b: 0 };
      this.colorWeight = 0;

      this.isKilled = true;
    }
  }

  private generateRandomPos(x: number, y: number, mag: number): Vector2D {
    const randomX = Math.random() * 1000;
    const randomY = Math.random() * 500;

    const direction = {
      x: randomX - x,
      y: randomY - y,
    };

    const magnitude = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
    if (magnitude > 0) {
      direction.x = (direction.x / magnitude) * mag;
      direction.y = (direction.y / magnitude) * mag;
    }

    return {
      x: x + direction.x,
      y: y + direction.y,
    };
  }
}

export interface ParticleTextEffectProps {
  words?: string[];
  /** pt | en — copy for footer hints */
  lang?: 'pt' | 'en';
  /** Tamanho da fonte usada no canvas offscreen (máscara do texto). */
  fontSizePx?: number;
  /** Amostragem de pixels (maior = menos partículas, mais performance). */
  pixelSteps?: number;
  /** Frames entre troca automática de palavra (60 ≈ 1s a 60fps). */
  wordCycleFrames?: number;
  /** Desenhar partículas como pontos 2×2 ou círculos. */
  drawAsPoints?: boolean;
  /** Cor do texto na máscara (hex ou css). */
  textFill?: string;
  /** Alpha do fundo por frame (rastro / motion blur). */
  trailAlpha?: number;
  canvasWidth?: number;
  canvasHeight?: number;
  showFooter?: boolean;
}

const DEFAULT_WORDS = ['W+SHADERS', 'ASCII', 'ENGINE', 'GENERATIVE', 'W-TTY'];

const COPY = {
  pt: {
    title: 'Texto com partículas',
    hint: 'Botão direito + arrastar: destruir partículas · Palavras mudam a cada 4 s',
  },
  en: {
    title: 'Particle text',
    hint: 'Right-click and hold while moving mouse to destroy particles · Words change every 4 seconds',
  },
} as const;

export function ParticleTextEffect({
  words = DEFAULT_WORDS,
  lang = 'en',
  fontSizePx = 100,
  pixelSteps = 6,
  wordCycleFrames = 240,
  drawAsPoints: drawPointsProp = true,
  textFill = '#ffffff',
  trailAlpha = 0.1,
  canvasWidth = 1000,
  canvasHeight = 500,
  showFooter = true,
}: ParticleTextEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const particlesRef = useRef<Particle[]>([]);
  const frameCountRef = useRef(0);
  const wordIndexRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0, isPressed: false, isRightClick: false });
  const runningRef = useRef(false);
  const wordsRef = useRef(words);

  wordsRef.current = words;

  const wordsKey = words.join('\0');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!canvas.getContext('2d')) return;

    const drawAsPoints = drawPointsProp;
    const steps = Math.max(2, Math.round(pixelSteps));
    const cycle = Math.max(30, Math.round(wordCycleFrames));
    const fontPx = Math.max(24, Math.min(220, Math.round(fontSizePx)));
    const trail = Math.min(0.5, Math.max(0.02, trailAlpha));
    const cw = Math.max(320, Math.min(1600, Math.round(canvasWidth)));
    const ch = Math.max(200, Math.min(900, Math.round(canvasHeight)));

    const generateRandomPos = (x: number, y: number, mag: number): Vector2D => {
      const randomX = Math.random() * cw;
      const randomY = Math.random() * ch;
      const direction = { x: randomX - x, y: randomY - y };
      const magnitude = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
      if (magnitude > 0) {
        direction.x = (direction.x / magnitude) * mag;
        direction.y = (direction.y / magnitude) * mag;
      }
      return { x: x + direction.x, y: y + direction.y };
    };

    const nextWord = (word: string) => {
      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = canvas.width;
      offscreenCanvas.height = canvas.height;
      const offscreenCtx = offscreenCanvas.getContext('2d');
      if (!offscreenCtx) return;

      offscreenCtx.fillStyle = textFill;
      offscreenCtx.font = `bold ${fontPx}px Arial`;
      offscreenCtx.textAlign = 'center';
      offscreenCtx.textBaseline = 'middle';
      offscreenCtx.fillText(word, canvas.width / 2, canvas.height / 2);

      const imageData = offscreenCtx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      const newColor = {
        r: Math.random() * 255,
        g: Math.random() * 255,
        b: Math.random() * 255,
      };

      const particles = particlesRef.current;
      let particleIndex = 0;

      const coordsIndexes: number[] = [];
      for (let i = 0; i < pixels.length; i += steps * 4) {
        coordsIndexes.push(i);
      }

      for (let i = coordsIndexes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [coordsIndexes[i], coordsIndexes[j]] = [coordsIndexes[j]!, coordsIndexes[i]!];
      }

      for (const coordIndex of coordsIndexes) {
        const pixelIndex = coordIndex;
        const alpha = pixels[pixelIndex + 3];

        if (alpha! > 0) {
          const x = (pixelIndex / 4) % canvas.width;
          const y = Math.floor(pixelIndex / 4 / canvas.width);

          let particle: Particle;

          if (particleIndex < particles.length) {
            particle = particles[particleIndex]!;
            particle.isKilled = false;
            particleIndex++;
          } else {
            particle = new Particle();
            const randomPos = generateRandomPos(canvas.width / 2, canvas.height / 2, (canvas.width + canvas.height) / 2);
            particle.pos.x = randomPos.x;
            particle.pos.y = randomPos.y;
            particle.maxSpeed = Math.random() * 6 + 4;
            particle.maxForce = particle.maxSpeed * 0.05;
            particle.particleSize = Math.random() * 6 + 6;
            particle.colorBlendRate = Math.random() * 0.0275 + 0.0025;
            particles.push(particle);
          }

          particle.startColor = {
            r: particle.startColor.r + (particle.targetColor.r - particle.startColor.r) * particle.colorWeight,
            g: particle.startColor.g + (particle.targetColor.g - particle.startColor.g) * particle.colorWeight,
            b: particle.startColor.b + (particle.targetColor.b - particle.startColor.b) * particle.colorWeight,
          };
          particle.targetColor = newColor;
          particle.colorWeight = 0;
          particle.target.x = x;
          particle.target.y = y;
        }
      }

      for (let i = particleIndex; i < particles.length; i++) {
        particles[i]!.kill(canvas.width, canvas.height);
      }
    };

    canvas.width = cw;
    canvas.height = ch;
    runningRef.current = true;

    const list = wordsRef.current;
    nextWord(list[0] ?? 'W+SHADERS');

    const animate = () => {
      if (!runningRef.current) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const particles = particlesRef.current;

      ctx.fillStyle = `rgba(0, 0, 0, ${trail})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i]!;
        particle.move();
        particle.draw(ctx, drawAsPoints);

        if (particle.isKilled) {
          if (
            particle.pos.x < 0 ||
            particle.pos.x > canvas.width ||
            particle.pos.y < 0 ||
            particle.pos.y > canvas.height
          ) {
            particles.splice(i, 1);
          }
        }
      }

      if (mouseRef.current.isPressed && mouseRef.current.isRightClick) {
        particles.forEach((particle) => {
          const distance = Math.sqrt(
            (particle.pos.x - mouseRef.current.x) ** 2 + (particle.pos.y - mouseRef.current.y) ** 2,
          );
          if (distance < 50) {
            particle.kill(canvas.width, canvas.height);
          }
        });
      }

      frameCountRef.current++;
      const w = wordsRef.current;
      if (w.length > 0 && frameCountRef.current % cycle === 0) {
        wordIndexRef.current = (wordIndexRef.current + 1) % w.length;
        nextWord(w[wordIndexRef.current] ?? w[0]!);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseDown = (e: MouseEvent) => {
      mouseRef.current.isPressed = true;
      mouseRef.current.isRightClick = e.button === 2;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseUp = () => {
      mouseRef.current.isPressed = false;
      mouseRef.current.isRightClick = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('contextmenu', handleContextMenu);

    return () => {
      runningRef.current = false;
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('contextmenu', handleContextMenu);
      particlesRef.current = [];
      frameCountRef.current = 0;
      wordIndexRef.current = 0;
    };
  }, [
    wordsKey,
    fontSizePx,
    pixelSteps,
    wordCycleFrames,
    drawPointsProp,
    textFill,
    trailAlpha,
    canvasWidth,
    canvasHeight,
  ]);

  const c = COPY[lang];

  return (
    <div className="flex flex-col items-center justify-center min-h-0 flex-1 bg-black p-4 particle-text-root">
      <canvas
        ref={canvasRef}
        className="border border-zinc-700 rounded-md shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      {showFooter && (
        <div className="mt-4 text-zinc-200 text-sm text-center max-w-md">
          <p className="mb-2 font-medium tracking-tight">{c.title}</p>
          <p className="text-zinc-500 text-xs leading-relaxed">{c.hint}</p>
        </div>
      )}
    </div>
  );
}
