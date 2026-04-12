// ── TextBitmapEngine — converte texto em Uint8Array bitmap para o TronEngine ──────────────
// Suporta múltiplos formatos de texto:
// - 'flat'     : texto normal horizontal centralizado
// - 'wave'     : texto com ondulação senoidal vertical
// - 'circular' : texto ao longo de um círculo
// - 'outline'  : apenas contorno das letras (hollow)
// - 'scatter'  : letras espalhadas em posições aleatórias fixas
// - 'diagonal' : texto em diagonal
// - 'matrix'   : texto em colunas verticais cascading

export type TextFormat =
  | 'flat'
  | 'wave'
  | 'circular'
  | 'outline'
  | 'scatter'
  | 'diagonal'
  | 'matrix';

export interface TextBitmapOptions {
  text:       string;
  format:     TextFormat;
  cols:       number;
  rows:       number;
  fontSize?:  number;   // px de renderização interna no offscreen canvas
  fontFamily?: string;
  bold?:      boolean;
  waveAmp?:   number;   // amplitude da wave (rows fraction, default 0.15)
  waveFreq?:  number;   // frequência da wave (default 0.12)
  radius?:    number;   // raio do círculo (0–1 do menor dimension, default 0.38)
  outlineW?:  number;   // espessura do outline stroke (default 2)
}

/**
 * Renderiza o texto diretamente na resolução do grid (cols x rows)
 * para garantir pixelização bruta e consistência com o carregamento de imagens.
 */
export function renderTextToBitmap(opts: TextBitmapOptions): Uint8Array {
  const {
    text,
    format,
    cols,
    rows,
    fontSize   = 16, // Default menor para o low-res canvas
    fontFamily = '"Bitcount Grid Single", sans-serif',
    bold       = true,
    waveAmp    = 0.15,
    waveFreq   = 0.12,
    radius     = 0.38,
    outlineW   = 1,
  } = opts;

  if (!text.trim()) return new Uint8Array(cols * rows).fill(0);

  // Renderização direta 1:1 (1 pixel = 1 célula ASCII)
  const W = cols;
  const H = rows;

  const oc = document.createElement('canvas');
  oc.width  = W;
  oc.height = H;
  const ctx = oc.getContext('2d')!;

  ctx.clearRect(0, 0, W, H);

  // fundo preto absoluto
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);

  // Desenha o conteúdo (branco/cinza)
  ctx.fillStyle   = '#ffffff';
  ctx.strokeStyle = '#ffffff';

  const weight = bold ? '900' : '400';
  // Ajusta fs para ser proporcional à altura do canvas se for muito grande
  const fs = fontSize > H ? H * 0.8 : fontSize;
  ctx.font         = `${weight} ${fs}px ${fontFamily}`;
  ctx.textBaseline = 'middle';
  ctx.textAlign    = 'center';

  const lines = text.split('\n').filter(l => l.length > 0);

  switch (format) {
    case 'flat':     renderFlat(ctx, lines, W, H, fs); break;
    case 'wave':     renderWave(ctx, lines, W, H, fs, waveAmp, waveFreq); break;
    case 'circular': renderCircular(ctx, text, W, H, radius, fs, fontFamily); break;
    case 'outline':  renderOutline(ctx, lines, W, H, fs, outlineW); break;
    case 'scatter':  renderScatter(ctx, text, W, H, fs, fontFamily); break;
    case 'diagonal': renderDiagonal(ctx, text, W, H, fs); break;
    case 'matrix':   renderMatrix(ctx, text, W, H, fs, fontFamily); break;
    default:         renderFlat(ctx, lines, W, H, fs);
  }

  // Captura o pixel data 1:1 e converte para níveis 0-4
  const imgData = ctx.getImageData(0, 0, W, H).data;
  const bm      = new Uint8Array(W * H);

  for (let i = 0; i < W * H; i++) {
    const r   = imgData[i * 4]!;
    const g   = imgData[i * 4 + 1]!;
    const b   = imgData[i * 4 + 2]!;
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    // Lógica idêntica ao App.tsx (imageDataToBitmap)
    bm[i] = lum < 40 ? 0 : lum > 220 ? 4 : Math.floor((lum / 255) * 4);
  }

  return bm;
}

// ── Renderizadores por formato ────────────────────────────────────────────────

function renderFlat(ctx: CanvasRenderingContext2D, lines: string[], W: number, H: number, fs: number) {
  const totalH  = lines.length * (fs * 1.3);
  const startY  = (H - totalH) / 2 + fs * 0.65;

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i]!, W / 2, startY + i * fs * 1.3, W * 0.92);
  }
}

function renderWave(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  W: number,
  H: number,
  fs: number,
  amp: number,
  freq: number,
) {
  const amp_px  = H * amp;
  const totalH  = lines.length * (fs * 1.3);
  const startY  = (H - totalH) / 2 + fs * 0.65;

  for (let li = 0; li < lines.length; li++) {
    const line = lines[li]!;
    const lineY = startY + li * fs * 1.3;
    const charW = fs * 0.62;
    const totalW = line.length * charW;
    let sx = (W - totalW) / 2;

    for (let ci = 0; ci < line.length; ci++) {
      const t   = ci / Math.max(line.length - 1, 1);
      const dy  = Math.sin(t * Math.PI * 2 * freq * line.length + li * 1.2) * amp_px;
      ctx.fillText(line[ci]!, sx + charW * 0.5, lineY + dy);
      sx += charW;
    }
  }
}

function renderCircular(
  ctx: CanvasRenderingContext2D,
  text: string,
  W: number,
  H: number,
  radiusFrac: number,
  fs: number,
  fontFamily: string,
) {
  const chars = Array.from(text.replace(/\n/g, ' '));
  const N     = chars.length;
  const r     = Math.min(W, H) * radiusFrac;
  const cx    = W / 2;
  const cy    = H / 2;
  const step  = (Math.PI * 2) / N;

  ctx.font      = `900 ${fs * 0.75}px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let i = 0; i < N; i++) {
    const angle = step * i - Math.PI / 2;
    const x     = cx + Math.cos(angle) * r;
    const y     = cy + Math.sin(angle) * r;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle + Math.PI / 2);
    ctx.fillText(chars[i]!, 0, 0);
    ctx.restore();
  }
}

function renderOutline(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  W: number,
  H: number,
  fs: number,
  strokeW: number,
) {
  const totalH  = lines.length * (fs * 1.3);
  const startY  = (H - totalH) / 2 + fs * 0.65;

  ctx.lineWidth   = strokeW;
  ctx.strokeStyle = '#ffffff';
  // Apaga o fill
  ctx.fillStyle   = '#000000';
  ctx.fillRect(0, 0, W, H);

  for (let i = 0; i < lines.length; i++) {
    ctx.strokeText(lines[i]!, W / 2, startY + i * fs * 1.3, W * 0.92);
  }
}

function renderScatter(
  ctx: CanvasRenderingContext2D,
  text: string,
  W: number,
  H: number,
  fs: number,
  fontFamily: string,
) {
  const chars = Array.from(text.replace(/\n/g, ' ')).filter(c => c.trim());
  const seed  = 42;
  let rng     = seed;
  const rand  = () => { rng = (rng * 1664525 + 1013904223) & 0xffffffff; return (rng >>> 0) / 0xffffffff; };

  const fontSize = fs * 0.8;
  ctx.font = `900 ${fontSize}px ${fontFamily}`;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';

  const padX = fontSize;
  const padY = fontSize;

  for (let i = 0; i < chars.length; i++) {
    const x = padX + rand() * (W - padX * 2);
    const y = padY + rand() * (H - padY * 2);
    ctx.fillText(chars[i]!, x, y);
  }
}

function renderDiagonal(
  ctx: CanvasRenderingContext2D,
  text: string,
  W: number,
  H: number,
  fs: number,
) {
  ctx.save();
  ctx.translate(W / 2, H / 2);
  ctx.rotate(-Math.PI / 6); // 30° diagonal

  const lines = text.split('\n').filter(l => l.length > 0);
  const totalH = lines.length * (fs * 1.3);
  const startY = -totalH / 2 + fs * 0.65;

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i]!, 0, startY + i * fs * 1.3, W * 1.2);
  }
  ctx.restore();
}

function renderMatrix(
  ctx: CanvasRenderingContext2D,
  text: string,
  W: number,
  H: number,
  fs: number,
  fontFamily: string,
) {
  // Distribui cada char em colunas verticais estilo Matrix
  const chars   = Array.from(text.replace(/\n/g, '')).filter(c => c.trim());
  const colW    = fs * 0.68;
  const numCols = Math.max(1, Math.floor(W / colW));
  const rowH    = fs * 1.1;

  ctx.font = `900 ${fs * 0.85}px ${fontFamily}`;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'top';

  const groups: string[][] = Array.from({ length: numCols }, () => []);
  chars.forEach((c, i) => groups[i % numCols]!.push(c));

  for (let col = 0; col < numCols; col++) {
    const grp = groups[col]!;
    const startY = (H - grp.length * rowH) / 2;
    grp.forEach((c, row) => {
      ctx.fillText(c, (col + 0.5) * colW, startY + row * rowH);
    });
  }
}
