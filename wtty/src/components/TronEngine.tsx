import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { CHAR_POOLS, type ShaderConfig } from '../presets';

export type DisturbanceMode = 'none' | 'chaotic' | 'wave' | 'stellar' | 'blackhole' | 'supernova';

export interface TronEngineProps {
  bitmap:            Uint8Array;
  cols:              number;
  rows:              number;
  config:            ShaderConfig;
  getLiveBitmap?:    () => Uint8Array | null;
  onFPS?:            (fps: number) => void;
  pixelWidth?:       number;
  pixelHeight?:      number;
  invertBitmap?:     boolean;
  perspective3D?:    boolean;
  onCameraChange?:   (cam: CameraState) => void;
  /** Toggle cursor repulsion on/off */
  mouseEnabled?:     boolean;
  /** Active disturbance physics mode */
  disturbanceMode?:  DisturbanceMode;
}

export interface CameraState {
  rotX: number;   // pitch  (rad)
  rotY: number;   // yaw    (rad)
  panX: number;   // pan offset X (px)
  panY: number;   // pan offset Y (px)
  zoom: number;   // scale multiplier
}

// ── Math helpers ─────────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

function getChar(pool: string[], lv: number): string {
  const p = pool[lv] ?? '';
  return p[Math.floor(Math.random() * p.length)] ?? '';
}

// Isometric-style 3D projection:
// Given a normalised (nx, ny) ∈ [-0.5, 0.5] and a Z depth value,
// apply pitch (rotX) and yaw (rotY) to produce screen offset.
function project3D(
  nx: number, ny: number, nz: number,
  rotX: number, rotY: number,
  W: number, H: number,
  panX: number, panY: number,
  zoom: number,
): [number, number, number] {
  // Simple rotation matrix (Y then X)
  // After yaw (rotY):
  const cosY = Math.cos(rotY);
  const sinY = Math.sin(rotY);
  const rx1 = nx * cosY - nz * sinY;
  const ry1 = ny;
  const rz1 = nx * sinY + nz * cosY;

  // After pitch (rotX):
  const cosX = Math.cos(rotX);
  const sinX = Math.sin(rotX);
  const rx2 = rx1;
  const ry2 = ry1 * cosX - rz1 * sinX;
  const rz2 = ry1 * sinX + rz1 * cosX;

  // Perspective divide (simple)
  const fov  = 2.2;
  const z3d  = rz2 + fov;
  const pers = z3d > 0.01 ? fov / z3d : 1;

  const sx = W / 2 + rx2 * W * pers * zoom + panX;
  const sy = H / 2 + ry2 * H * pers * zoom + panY;

  return [sx, sy, pers];
}

// ── Font loader (dynamic Google Fonts) ──────────────────────────────────────

const loadedFonts = new Set<string>();
export function loadFont(url: string) {
  if (loadedFonts.has(url)) return;
  loadedFonts.add(url);
  const link = document.createElement('link');
  link.rel  = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
}

// ── Component ────────────────────────────────────────────────────────────────

export const TronEngine = forwardRef<HTMLCanvasElement, TronEngineProps>(
  function TronEngine(
    {
      bitmap,
      cols,
      rows,
      config,
      getLiveBitmap,
      onFPS,
      pixelWidth,
      pixelHeight,
      invertBitmap     = false,
      perspective3D    = true,
      onCameraChange,
      mouseEnabled     = true,
      disturbanceMode  = 'none',
    },
    ref,
  ) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useImperativeHandle(ref, () => canvasRef.current!, []);

    // Mutable refs to avoid stale closures
    const configRef      = useRef(config);
    const getLiveRef     = useRef(getLiveBitmap);
    const onFPSRef       = useRef(onFPS);
    const bitmapRef      = useRef(bitmap);
    const reinitRef      = useRef<(() => void) | null>(null);
    const invertRef      = useRef(invertBitmap);
    const perspRef       = useRef(perspective3D);
    const onCamRef       = useRef(onCameraChange);
    const mouseEnabledRef    = useRef(mouseEnabled);
    const disturbanceModeRef = useRef(disturbanceMode);

    useEffect(() => { configRef.current  = config; },          [config]);
    useEffect(() => { getLiveRef.current = getLiveBitmap; },   [getLiveBitmap]);
    useEffect(() => { onFPSRef.current   = onFPS; },           [onFPS]);
    useEffect(() => { mouseEnabledRef.current    = mouseEnabled; },   [mouseEnabled]);
    useEffect(() => { disturbanceModeRef.current = disturbanceMode; },[disturbanceMode]);
    useEffect(() => { onCamRef.current   = onCameraChange; },  [onCameraChange]);
    useEffect(() => {
      invertRef.current = invertBitmap;
      reinitRef.current?.();
    }, [invertBitmap]);
    useEffect(() => { perspRef.current = perspective3D; }, [perspective3D]);

    // Re-init particle anchors when static bitmap changes
    useEffect(() => {
      bitmapRef.current = bitmap;
      reinitRef.current?.();
    }, [bitmap]);

    // Main render loop — re-runs only when canvas pixel dimensions change
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      const dpr    = window.devicePixelRatio || 1;
      const FONT   = config.fontSize;
      const CHAR_W = FONT * 0.60;
      const CHAR_H = FONT * 1.25;

      const W = pixelWidth  ?? Math.floor(cols * CHAR_W);
      const H = pixelHeight ?? Math.floor(rows * CHAR_H);

      const ECOLS = pixelWidth  ? Math.floor(W / CHAR_W) : cols;
      const EROWS = pixelHeight ? Math.floor(H / CHAR_H) : rows;
      const N     = ECOLS * EROWS;

      canvas.width        = W * dpr;
      canvas.height       = H * dpr;
      canvas.style.width  = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.scale(dpr, dpr);

      // Particle physics arrays
      const px  = new Float32Array(N);
      const py  = new Float32Array(N);
      const ox  = new Float32Array(N);
      const oy  = new Float32Array(N);
      const vx  = new Float32Array(N);
      const vy  = new Float32Array(N);
      const ch: string[] = new Array(N).fill('');

      // Grid normalised positions (for 3D projection) — computed once
      const gnx = new Float32Array(N);
      const gny = new Float32Array(N);

      for (let i = 0; i < N; i++) {
        gnx[i] = (i % ECOLS) / ECOLS - 0.5;
        gny[i] = Math.floor(i / ECOLS) / EROWS - 0.5;
      }

      const initParticles = () => {
        const bm   = bitmapRef.current;
        const pool = CHAR_POOLS[configRef.current.charStyle] ?? CHAR_POOLS.default;
        const inv  = invertRef.current;

        for (let i = 0; i < N; i++) {
          const ecol = i % ECOLS;
          const erow = Math.floor(i / ECOLS);
          const bcol = Math.floor((ecol / ECOLS) * cols);
          const brow = Math.floor((erow / EROWS) * rows);
          const bi   = brow * cols + bcol;
          const rawLv = bm[bi] ?? 0;
          const lv = inv ? (4 - rawLv) : rawLv;

          ox[i] = ecol * CHAR_W + CHAR_W * 0.5;
          oy[i] = erow * CHAR_H + CHAR_H * 0.5;
          px[i] = W / 2 + (Math.random() - 0.5) * W * 0.8;
          py[i] = H / 2 + (Math.random() - 0.5) * H * 0.8;
          vx[i] = vy[i] = 0;
          ch[i] = lv > 0 ? getChar(pool, lv) : '';
        }
      };

      initParticles();
      reinitRef.current = initParticles;

      // ── Camera state ────────────────────────────────────────────────────────
      const cam: CameraState = { rotX: 0.22, rotY: 0, panX: 0, panY: 0, zoom: 1 };
      // Drag state
      let isDragging   = false;
      let isPanning    = false;     // Espaço pressionado
      let isSpaceDown  = false;
      let lastMX = 0,  lastMY = 0;

      // Cursor trail (in screen space — used when NOT in 3D orbit mode)
      const trail: { x: number; y: number; age: number }[] = [];
      const MAX_AGE = 45;
      let mx = -9999, my = -9999;

      // ── Mouse / Pointer events ──────────────────────────────────────────────
      const onPointerDown = (e: PointerEvent) => {
        isDragging = true;
        isPanning  = isSpaceDown;
        lastMX     = e.clientX;
        lastMY     = e.clientY;
        canvas.setPointerCapture(e.pointerId);
      };

      const onPointerMove = (e: PointerEvent) => {
        const r   = canvas.getBoundingClientRect();
        mx = (e.clientX - r.left) * (W / r.width);
        my = (e.clientY - r.top)  * (H / r.height);

        if (!isDragging) return;

        const dx = e.clientX - lastMX;
        const dy = e.clientY - lastMY;
        lastMX = e.clientX;
        lastMY = e.clientY;

        if (isPanning || isSpaceDown) {
          // Pan — translate the camera
          cam.panX += dx * 1.2;
          cam.panY += dy * 1.2;
        } else if (perspRef.current) {
          // Orbit — rotate around X/Y axes
          cam.rotY += dx * 0.008;
          cam.rotX += dy * 0.008;
          // Clamp pitch so world doesn't flip
          cam.rotX = Math.max(-Math.PI * 0.48, Math.min(Math.PI * 0.48, cam.rotX));
        }
        onCamRef.current?.(cam);
      };

      const onPointerUp = (e: PointerEvent) => {
        isDragging = false;
        canvas.releasePointerCapture(e.pointerId);
      };

      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.95 : 1.05;
        cam.zoom = Math.max(0.3, Math.min(4.0, cam.zoom * delta));
        onCamRef.current?.(cam);
      };

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Space') {
          e.preventDefault();
          isSpaceDown = true;
          canvas.style.cursor = 'grab';
        }
        // WASD / arrows for orbit control via keyboard
        const step = 0.04;
        if (e.code === 'ArrowLeft'  || e.code === 'KeyA') cam.rotY -= step;
        if (e.code === 'ArrowRight' || e.code === 'KeyD') cam.rotY += step;
        if (e.code === 'ArrowUp'    || e.code === 'KeyW') cam.rotX -= step;
        if (e.code === 'ArrowDown'  || e.code === 'KeyS') cam.rotX += step;
        // R — reset camera
        if (e.code === 'KeyR') {
          cam.rotX = 0.22; cam.rotY = 0;
          cam.panX = 0;    cam.panY = 0;
          cam.zoom = 1;
          onCamRef.current?.(cam);
        }
      };

      const onKeyUp = (e: KeyboardEvent) => {
        if (e.code === 'Space') {
          isSpaceDown = false;
          canvas.style.cursor = 'crosshair';
        }
      };

      canvas.addEventListener('pointerdown',  onPointerDown);
      canvas.addEventListener('pointermove',  onPointerMove);
      canvas.addEventListener('pointerup',    onPointerUp);
      canvas.addEventListener('pointerleave', onPointerUp);
      canvas.addEventListener('wheel',        onWheel, { passive: false });
      window.addEventListener('keydown',      onKeyDown);
      window.addEventListener('keyup',        onKeyUp);
      canvas.style.cursor = 'crosshair';

      // ── Color cache ────────────────────────────────────────────────────────
      let primary:   [number, number, number] = hexToRgb(config.primaryColor);
      let secondary: [number, number, number] = hexToRgb(config.secondaryColor);
      let colorKey   = config.primaryColor + config.secondaryColor;

      // FPS
      let fpsFrames = 0, fpsT = performance.now();
      let tick = 0;
      const startT = performance.now();
      let animId: number;

      // ── Main loop ──────────────────────────────────────────────────────────
      const loop = () => {
        animId = requestAnimationFrame(loop);
        const c   = configRef.current;
        const now = performance.now();

        // Color cache refresh
        const ck = c.primaryColor + c.secondaryColor;
        if (ck !== colorKey) {
          primary   = hexToRgb(c.primaryColor);
          secondary = hexToRgb(c.secondaryColor);
          colorKey  = ck;
        }

        // FPS counter
        fpsFrames++;
        if (now - fpsT >= 1000) {
          onFPSRef.current?.(Math.round(fpsFrames * 1000 / (now - fpsT)));
          fpsFrames = 0; fpsT = now;
        }

        const elapsed = (now - startT) * 0.001;
        const pool    = CHAR_POOLS[c.charStyle] ?? CHAR_POOLS.default;

        // Background
        ctx.fillStyle = c.bgColor;
        ctx.fillRect(0, 0, W, H);

        ctx.font         = `bold ${FONT}px ${c.fontFamily}`;
        ctx.textBaseline = 'top';

        // Cursor trail (screen space) — only for repulsion in flat mode
        if (mx > -100) trail.push({ x: mx, y: my, age: 0 });
        for (let i = trail.length - 1; i >= 0; i--) {
          trail[i]!.age++;
          if (trail[i]!.age > MAX_AGE) trail.splice(i, 1);
        }

        // Live bitmap update
        tick++;
        const inv = invertRef.current;
        if (getLiveRef.current && tick % 3 === 0) {
          const live = getLiveRef.current();
          if (live) {
            for (let i = 0; i < N; i++) {
              const ecol  = i % ECOLS;
              const erow  = Math.floor(i / ECOLS);
              const bcol  = Math.floor((ecol / ECOLS) * cols);
              const brow  = Math.floor((erow / EROWS) * rows);
              const bi    = brow * cols + bcol;
              const rawLv = live[bi] ?? 0;
              const lv    = inv ? (4 - rawLv) : rawLv;

              const rawPlv = bitmapRef.current[bi] ?? 0;
              const plv    = inv ? (rawPlv === 0 ? 4 : 0) : rawPlv;
              if (lv !== plv || (lv > 0 && Math.random() < 0.05)) {
                ch[i] = lv > 0 ? getChar(pool, lv) : '';
                bitmapRef.current[bi] = rawLv;
              }
            }
          }
        }

        // Random char mutation (Matrix rain)
        if (!getLiveRef.current && tick % 8 === 0) {
          const mutRate = 0.002;
          for (let i = 0; i < N; i++) {
            const ecol  = i % ECOLS;
            const erow  = Math.floor(i / ECOLS);
            const bcol  = Math.floor((ecol / ECOLS) * cols);
            const brow  = Math.floor((erow / EROWS) * rows);
            const bi    = brow * cols + bcol;
            const rawLv = bitmapRef.current[bi] ?? 0;
            const effLv = inv ? (4 - rawLv) : rawLv;
            if (effLv > 0 && Math.random() < mutRate) ch[i] = getChar(pool, effLv);
          }
        }

        const bm     = bitmapRef.current;
        const use3D  = perspRef.current;
        const radius = c.trailRadius * Math.min(W, H);

        // Breathe for 3D depth pulse
        const BREATHE = Math.sin(elapsed * 0.4) * 0.08 + 1.0;

        for (let i = 0; i < N; i++) {
          const ecol  = i % ECOLS;
          const erow  = Math.floor(i / ECOLS);
          const bcol  = Math.floor((ecol / ECOLS) * cols);
          const brow  = Math.floor((erow / EROWS) * rows);
          const bi    = brow * cols + bcol;
          const rawLv = bm[bi] ?? 0;
          const lv    = inv ? (4 - rawLv) : rawLv;
          if (lv === 0) continue;

          // ── 3D orbital camera projection ─────────────────────────────────
          let drawX: number, drawY: number, scale3D: number;

          if (use3D) {
            // Normalised grid position [-0.5, 0.5]
            const nx  = gnx[i]!;
            const ny  = gny[i]!;
            // Z from particle displacement (makes displaced chars pop out toward viewer)
            const dispZ = ((px[i] - ox[i]) * 0.0004 + (py[i] - oy[i]) * 0.0004) * BREATHE;
            const nz  = dispZ * 0.5;                          // subtle Z

            const [sx, sy, pers] = project3D(nx, ny, nz, cam.rotX, cam.rotY, W, H, cam.panX, cam.panY, cam.zoom);
            drawX   = sx;
            drawY   = sy;
            scale3D = Math.max(0.3, Math.min(2.5, pers * cam.zoom));
          } else {
            drawX   = ox[i];
            drawY   = oy[i];
            scale3D = 1;
          }

          // ── Cursor repulsion ──────────────────────────────────────────────
          if (mouseEnabledRef.current) {
            for (let t = 0; t < trail.length; t++) {
              const tr     = trail[t]!;
              const factor = 1 - tr.age / MAX_AGE;
              const r      = radius * factor;
              const tx     = use3D ? drawX : px[i];
              const ty     = use3D ? drawY : py[i];
              const dx     = tx - tr.x;
              const dy     = ty - tr.y;
              const dSq    = dx * dx + dy * dy;
              if (dSq < r * r && dSq > 0.01) {
                const d   = Math.sqrt(dSq);
                const pen = (r - d) / r;
                vx[i] += (dx / d) * pen * 2.5;
                vy[i] += (dy / d) * pen * 2.5;
              }
            }
          }

          // ── Disturbance modes (Destructive / Cursor-like) ──────────────────
          const dmode = disturbanceModeRef.current;

          if (dmode === 'chaotic') {
            // High-intensity random turbulence + entropy kicks
            if (Math.random() < 0.08) {
              const pwr = 12;
              vx[i] += (Math.random() - 0.5) * pwr;
              vy[i] += (Math.random() - 0.5) * pwr;
            }
          } else if (dmode === 'wave') {
            // Compound destructive waves
            const freq = 0.04;
            const amp = 0.45;
            vx[i] += Math.cos(elapsed * 2.2 + oy[i] * freq + ox[i] * 0.02) * amp;
            vy[i] += Math.sin(elapsed * 1.8 + ox[i] * freq + oy[i] * 0.03) * amp;
          } else if (dmode === 'stellar') {
            // Explosive orbital disruption
            const dx  = px[i] - W * 0.5;
            const dy  = py[i] - H * 0.5;
            const dist = Math.sqrt(dx * dx + dy * dy) + 1;
            const ang = elapsed * 0.6 + dist * 0.005;
            vx[i] += (-dy * Math.cos(ang) - dx * Math.sin(ang)) * 0.005;
            vy[i] += ( dx * Math.cos(ang) - dy * Math.sin(ang)) * 0.005;
            // Add repulsion from moving 'stellar' points
            if (Math.sin(elapsed + i) > 0.99) {
              vx[i] += (dx / dist) * 15;
              vy[i] += (dy / dist) * 15;
            }
          } else if (dmode === 'blackhole') {
            // Gravity well + event horizon distortion
            const dx  = W * 0.5 - px[i];
            const dy  = H * 0.5 - py[i];
            const dSq = dx * dx + dy * dy + 400;
            const d   = Math.sqrt(dSq);
            const force = Math.min(6, 45000 / dSq);
            vx[i] += (dx / d) * force;
            vy[i] += (dy / d) * force;
            // Spaghettification (destructive stretch)
            if (d < 150) {
              vx[i] += (Math.random() - 0.5) * 8;
              vy[i] += (Math.random() - 0.5) * 8;
            }
          } else if (dmode === 'supernova') {
            // Pulsing destructive blast from center
            const dx  = px[i] - W * 0.5;
            const dy  = py[i] - H * 0.5;
            const d   = Math.sqrt(dx * dx + dy * dy) + 1;
            const wave = Math.sin(d * 0.01 - elapsed * 5.0);
            const pwr = (wave > 0.8 ? 14 : 0.2) * (1 - Math.min(1, d / (W * 0.6)));
            vx[i] += (dx / d) * pwr;
            vy[i] += (dy / d) * pwr;
          }

          // Idle wave (config-level, independent of disturbance)
          if (c.waveEnabled && dmode === 'none') {
            vx[i] += Math.cos(elapsed * 0.5 + oy[i] * 0.018) * c.waveStrength * 0.04;
            vy[i] += Math.sin(elapsed * 0.4 + ox[i] * 0.018) * c.waveStrength * 0.04;
          }

          // Spring return + damping
          vx[i] += (ox[i] - px[i]) * c.stiffness;
          vy[i] += (oy[i] - py[i]) * c.stiffness;
          vx[i] *= c.damping;
          vy[i] *= c.damping;
          px[i] += vx[i];
          py[i] += vy[i];

          // ── Color ──────────────────────────────────────────────────────────
          const tColor = (lv - 1) / 3;
          let cr: number, cg: number, cb: number;

          if (c.hueShift) {
            const hue = (elapsed * c.hueSpeed * 40 + tColor * 60 + lv * 20) % 360;
            const h   = hue / 60;
            const x   = 1 - Math.abs(h % 2 - 1);
            const [rr, gg, bb] = h < 1 ? [1, x, 0] : h < 2 ? [x, 1, 0] :
                                  h < 3 ? [0, 1, x] : h < 4 ? [0, x, 1] :
                                  h < 5 ? [x, 0, 1] : [1, 0, x];
            cr = Math.round((rr ?? 0) * 255);
            cg = Math.round((gg ?? 0) * 255);
            cb = Math.round((bb ?? 0) * 255);
          } else {
            cr = Math.round(secondary[0] + (primary[0] - secondary[0]) * tColor);
            cg = Math.round(secondary[1] + (primary[1] - secondary[1]) * tColor);
            cb = Math.round(secondary[2] + (primary[2] - secondary[2]) * tColor);
          }

          // Glow on displacement
          const disp      = Math.sqrt((px[i] - ox[i]) ** 2 + (py[i] - oy[i]) ** 2);
          const dispAlpha = disp < 1 ? 1.0 : Math.max(0.05, 1 - disp / (70 / c.glowStrength));

          // CRT scanline
          const scanAlpha = 0.55 + 0.45 * Math.sin(elapsed * c.scanFrequency * 200 + oy[i] * 0.12);

          // Depth alpha — perspective-based
          const depthBase  = use3D
            ? Math.max(0.2, Math.min(1.0, scale3D * 0.8))
            : (0.25 + (lv / 4) * 0.75);
          const depthAlpha = c.depthIntensity * depthBase + (1 - c.depthIntensity) * 0.7;

          const alpha = Math.min(0.95, Math.max(0.04, dispAlpha * scanAlpha * depthAlpha));

          // ── Draw ──────────────────────────────────────────────────────────
          const drawSize = Math.round(FONT * scale3D);
          const charStr  = ch[i];
          if (!charStr) continue;

          ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha.toFixed(3)})`;

          if (use3D && drawSize !== FONT) {
            ctx.font = `bold ${drawSize}px ${c.fontFamily}`;
            ctx.fillText(charStr, drawX, drawY);
            ctx.font = `bold ${FONT}px ${c.fontFamily}`;
          } else {
            ctx.fillText(charStr, use3D ? drawX : px[i], use3D ? drawY : py[i]);
          }
        }
      };

      loop();

      return () => {
        cancelAnimationFrame(animId);
        canvas.removeEventListener('pointerdown',  onPointerDown);
        canvas.removeEventListener('pointermove',  onPointerMove);
        canvas.removeEventListener('pointerup',    onPointerUp);
        canvas.removeEventListener('pointerleave', onPointerUp);
        canvas.removeEventListener('wheel',        onWheel);
        window.removeEventListener('keydown',      onKeyDown);
        window.removeEventListener('keyup',        onKeyUp);
        reinitRef.current = null;
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cols, rows, config.fontSize, pixelWidth, pixelHeight]);

    return (
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width:   pixelWidth  ? `${pixelWidth}px`  : undefined,
          height:  pixelHeight ? `${pixelHeight}px` : undefined,
          touchAction: 'none',
        }}
      />
    );
  },
);
