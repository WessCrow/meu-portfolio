import React, { useState, useCallback, useRef, useEffect } from 'react';
import { TronEngine, loadFont, type CameraState, type DisturbanceMode } from './components/TronEngine';
import { renderTextToBitmap, type TextFormat } from './components/TextBitmapEngine';
import {
  PRESETS, CHAR_POOLS, FONT_OPTIONS, COLOR_PALETTES,
  type PresetKey, type ShaderConfig, type CharStyle,
} from './presets';
import './index.css';

// ── i18n ──────────────────────────────────────────────────────────────────────
type Lang = 'pt' | 'en';

const T = {
  pt: {
    // Sections
    sText:     'Texto',
    sSource:   'Imagem / Câmera',
    sPhysics:  'Força do cursor',
    sColor:    'Cores',
    sFont:     'Tipografia',
    sRender:   'Estado molecular',
    sPresets:  'Presets',
    sExport:   'Exportar',
    // Text section
    textPlaceholder: 'Digite qualquer coisa...',
    textBoldOn:  'Negrito: sim',
    textBoldOff: 'Negrito: não',
    textSize:    'Tamanho do texto',
    textApply:   'Renderizar',
    // Source section
    btnUpload:  'Carregar imagem',
    btnWebcam:  'Câmera',
    btnStop:    'Parar câmera',
    // Physics
    stiffness:   'Rigidez',
    stiffnessDesc: 'Velocidade de retorno à posição original',
    damping:     'Amortecimento',
    dampingDesc: 'Queda de velocidade a cada frame',
    radius:      'Raio de repulsão',
    radiusDesc:  'Área de influência do cursor',
    // Colors
    colorPrimary:    'Cor principal',
    colorSecondary:  'Cor secundária',
    colorBg:         'Fundo',
    palettes:        'Paletas rápidas',
    // Font
    charSize:    'Tamanho dos caracteres',
    // Render
    invert:      'Inverter',
    invertOn:    'Invertido',
    invertOff:   'Normal',
    persp:       'Perspectiva 3D',
    perspOn:     '3D ativo',
    perspOff:    '3D desativado',
    charStyle:   'Estilo dos caracteres',
    wave:        'Onda',
    waveOn:      'Onda: ligada',
    waveOff:     'Onda: desligada',
    hue:         'Arco-íris',
    hueOn:       'Cores: ligado',
    hueOff:      'Cores: desligado',
    // Export
    snapshot:    'Salvar imagem (PNG)',
    // Mouse / disturbance
    mouseOn:      'Cursor: ativo',
    mouseOff:     'Cursor: desativado',
    disturbLabel: 'Perturbação',
    distNone:     'Nenhuma',
    distChaotic:  'Caótico',
    distWave:     'Ondas',
    distStellar:  'Estelar',
    distBlackhole:'Buraco negro',
    distSupernova:'Supernova',
    // Reset
    resetToLogo:  '← Voltar ao início',
    // Status
    camHintOrbit: 'Arrastar para orbitar',
    camHintPan:   'Espaço + arrastar para mover',
    camHintZoom:  'Scroll para zoom',
    camHintReset: 'R para resetar',
  },
  en: {
    sText:     'Text',
    sSource:   'Image / Camera',
    sPhysics:  'Cursor Strength',
    sColor:    'Colors',
    sFont:     'Typography',
    sRender:   'Molecular State',
    sPresets:  'Presets',
    sExport:   'Export',
    textPlaceholder: 'Type anything...',
    textBoldOn:  'Bold: on',
    textBoldOff: 'Bold: off',
    textSize:    'Text size',
    textApply:   'Render',
    btnUpload:  'Load image',
    btnWebcam:  'Camera',
    btnStop:    'Stop camera',
    stiffness:   'Stiffness',
    stiffnessDesc: 'Speed of return to origin',
    damping:     'Damping',
    dampingDesc: 'Velocity decay per frame',
    radius:      'Repulsion radius',
    radiusDesc:  'Cursor influence area',
    colorPrimary:    'Primary color',
    colorSecondary:  'Secondary color',
    colorBg:         'Background',
    palettes:        'Quick palettes',
    charSize:    'Character size',
    invert:      'Invert',
    invertOn:    'Inverted',
    invertOff:   'Normal',
    persp:       '3D Perspective',
    perspOn:     '3D on',
    perspOff:    '3D off',
    charStyle:   'Character style',
    wave:        'Wave',
    waveOn:      'Wave: on',
    waveOff:     'Wave: off',
    hue:         'Rainbow',
    hueOn:       'Rainbow: on',
    hueOff:      'Rainbow: off',
    snapshot:    'Save image (PNG)',
    mouseOn:      'Cursor: on',
    mouseOff:     'Cursor: off',
    disturbLabel: 'Disturbance',
    distNone:     'None',
    distChaotic:  'Chaotic',
    distWave:     'Wave',
    distStellar:  'Stellar',
    distBlackhole:'Black hole',
    distSupernova:'Supernova',
    resetToLogo:  '← Back to start',
    camHintOrbit: 'Drag to orbit',
    camHintPan:   'Space + drag to pan',
    camHintZoom:  'Scroll to zoom',
    camHintReset: 'R to reset',
  },
} as const;

// ── Grid calculation ──────────────────────────────────────────────────────────
function calcGrid(fontSize: number) {
  const CHAR_W = fontSize * 0.60;
  const CHAR_H = fontSize * 1.25;
  return {
    cols: Math.floor(window.innerWidth  / CHAR_W),
    rows: Math.floor(window.innerHeight / CHAR_H),
  };
}

// ── Bitmap utils ──────────────────────────────────────────────────────────────
function imageDataToBitmap(data: Uint8ClampedArray, total: number): Uint8Array {
  const bm = new Uint8Array(total);
  for (let i = 0; i < total; i++) {
    const r   = data[i * 4]!;
    const g   = data[i * 4 + 1]!;
    const b   = data[i * 4 + 2]!;
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    bm[i]     = lum < 30 ? 0 : lum < 80 ? 1 : lum < 140 ? 2 : lum < 200 ? 3 : 4;
  }
  return bm;
}

function processImageToBitmap(img: HTMLImageElement, cols: number, rows: number): Uint8Array {
  const c   = document.createElement('canvas');
  c.width   = cols; c.height = rows;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, cols, rows);
  return imageDataToBitmap(ctx.getImageData(0, 0, cols, rows).data, cols * rows);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ── Types ─────────────────────────────────────────────────────────────────────
type HudSection = 'text' | 'source' | 'physics' | 'color' | 'font' | 'render' | 'presets' | 'export';

const TEXT_FORMATS: { id: TextFormat; label: string }[] = [
  { id: 'flat',     label: 'Linear'   },
  { id: 'wave',     label: 'Wave'     },
  { id: 'circular', label: 'Orbital'  },
  { id: 'outline',  label: 'Outline'  },
  { id: 'scatter',  label: 'Scatter'  },
  { id: 'diagonal', label: 'Diagonal' },
  { id: 'matrix',   label: 'Matrix'   },
];

const CHAR_STYLE_LABELS: Record<CharStyle, string> = {
  default: 'Default',
  matrix:  'Matrix',
  binary:  'Binary',
  blocks:  'Blocks',
  minimal: 'Minimal',
  code:    'Code',
};

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [lang,   setLang]   = useState<Lang>('pt');
  const t = T[lang];

  const [config, setConfig] = useState<ShaderConfig>({ ...PRESETS.mono });
  const [{ cols, rows }, setGrid] = useState(() => calcGrid(PRESETS.mono.fontSize));

  const [bitmap,        setBitmap]        = useState<Uint8Array>(() => new Uint8Array(cols * rows).fill(0));
  const [statusMsg,     setStatusMsg]     = useState('MONO_CORE_ACTIVE :: STRUCTURAL_EMERGENCE');
  const [fps,           setFps]           = useState(0);
  const [sourceMode,    setSourceMode]    = useState<'logo' | 'image' | 'text' | 'webcam'>('logo');
  const [webcamActive,  setWebcamActive]  = useState(false);
  const [hudVisible]                  = useState(true);
  const [invertBitmap,     setInvertBitmap]     = useState(true);
  const [perspective3D,    setPerspective3D]    = useState(true);
  const [mouseEnabled,     setMouseEnabled]     = useState(true);
  const [disturbanceMode,  setDisturbanceMode]  = useState<DisturbanceMode>('none');
  const [camState,      setCamState]      = useState<CameraState>({ rotX: 0.22, rotY: 0, panX: 0, panY: 0, zoom: 1 });
  const [openSection,   setOpenSection]   = useState<HudSection>('text');

  // Text generator state
  const [textInput,    setTextInput]    = useState('WSHADERS');
  const [textFormat,   setTextFormat]   = useState<TextFormat>('flat');
  const [textBold,     setTextBold]     = useState(true);
  const [textFontSize, setTextFontSize] = useState(96);

  const fileInputRef  = useRef<HTMLInputElement>(null);
  const videoRef      = useRef<HTMLVideoElement>(null);
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const offscreenRef  = useRef<HTMLCanvasElement | null>(null);
  const streamRef     = useRef<MediaStream | null>(null);
  const currentImgRef = useRef<HTMLImageElement | null>(null);
  const logoImgRef    = useRef<HTMLImageElement | null>(null);

  // Rebuild grid when fontSize changes
  useEffect(() => {
    const grid = calcGrid(config.fontSize);
    setGrid(grid);
    if (currentImgRef.current) {
      setBitmap(processImageToBitmap(currentImgRef.current, grid.cols, grid.rows));
    } else {
      setBitmap(new Uint8Array(grid.cols * grid.rows).fill(0));
    }
  }, [config.fontSize]);

  // Resize handler
  useEffect(() => {
    const onResize = () => {
      const grid = calcGrid(config.fontSize);
      setGrid(grid);
      if (currentImgRef.current) {
        setBitmap(processImageToBitmap(currentImgRef.current, grid.cols, grid.rows));
      } else {
        setBitmap(new Uint8Array(grid.cols * grid.rows).fill(0));
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [config.fontSize]);

  useEffect(() => {
    const c = document.createElement('canvas');
    c.width = cols; c.height = rows;
    offscreenRef.current = c;
  }, [cols, rows]);

  // Logo load on mount
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      logoImgRef.current  = img;
      currentImgRef.current = img;
      setBitmap(processImageToBitmap(img, cols, rows));
      setStatusMsg('STATION_READY :: LOAD_OK');
      setSourceMode('logo');
    };
    img.onerror = () => {
      applyTextBitmap('WSHADERS', 'flat', cols, rows, 96, true);
      setStatusMsg('TERMINAL_READY');
      setSourceMode('text');
    };
    img.src = './logo.png';
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Config setter ──────────────────────────────────────────────────────────
  const cfg = <K extends keyof ShaderConfig>(key: K, val: ShaderConfig[K]) =>
    setConfig(prev => ({ ...prev, [key]: val }));

  // ── Reset to logo ──────────────────────────────────────────────────────────
  const resetToLogo = () => {
    if (webcamActive) stopWebcam();
    const logo = logoImgRef.current;
    if (logo) {
      currentImgRef.current = logo;
      setBitmap(processImageToBitmap(logo, cols, rows));
      setSourceMode('logo');
      setStatusMsg('STATION_READY :: LOAD_OK');
    }
  };

  // ── Text bitmap generator ──────────────────────────────────────────────────
  const applyTextBitmap = useCallback((
    text: string, format: TextFormat,
    c: number, r: number, fontSize: number, bold: boolean,
  ) => {
    if (!text.trim()) return;
    setBitmap(renderTextToBitmap({ text, format, cols: c, rows: r, fontSize, bold }));
    currentImgRef.current = null;
    setSourceMode('text');
    setStatusMsg(`TEXT_RENDER :: ${format.toUpperCase()}`);
  }, []);

  // ── Live bitmap (webcam) ───────────────────────────────────────────────────
  const getLiveBitmap = useCallback((): Uint8Array | null => {
    const video  = videoRef.current;
    const canvas = offscreenRef.current;
    if (!video || !canvas || video.readyState < 2) return null;
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    ctx.drawImage(video, 0, 0, cols, rows);
    return imageDataToBitmap(ctx.getImageData(0, 0, cols, rows).data, cols * rows);
  }, [cols, rows]);

  // ── File upload ────────────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        currentImgRef.current = img;
        setBitmap(processImageToBitmap(img, cols, rows));
        setStatusMsg(`IMAGE :: ${file.name.toUpperCase()}`);
        setSourceMode('image');
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // ── Webcam ────────────────────────────────────────────────────────────────
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setWebcamActive(true);
      setSourceMode('webcam');
      setStatusMsg('CAMERA_ACTIVE');
    } catch { setStatusMsg('ERR :: CAMERA_DENIED'); }
  };

  const stopWebcam = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    if (videoRef.current) { videoRef.current.srcObject = null; }
    setWebcamActive(false);
    setStatusMsg('CAMERA_OFF');
  };

  const toggleWebcam = () => webcamActive ? stopWebcam() : startWebcam();

  // ── Export ────────────────────────────────────────────────────────────────
  const takeSnapshot = () => {
    canvasRef.current?.toBlob(blob => {
      if (blob) downloadBlob(blob, `wshaders_${Date.now()}.png`);
    }, 'image/png');
    setStatusMsg('SNAPSHOT_SAVED');
  };

  // ── Section toggle ─────────────────────────────────────────────────────────
  const toggleSection = (s: HudSection) =>
    setOpenSection(prev => prev === s ? 'text' : s);

  return (
    <div className="fullscreen-root" style={{ background: config.bgColor }}>
      <video ref={videoRef} className="hidden" aria-hidden="true" muted playsInline />

      {/* CANVAS */}
      <div className="canvas-fullscreen">
        <TronEngine
          ref={canvasRef}
          bitmap={bitmap}
          cols={cols}
          rows={rows}
          config={config}
          getLiveBitmap={webcamActive ? getLiveBitmap : undefined}
          onFPS={setFps}
          pixelWidth={window.innerWidth}
          pixelHeight={window.innerHeight}
          invertBitmap={invertBitmap}
          perspective3D={perspective3D}
          onCameraChange={setCamState}
          mouseEnabled={mouseEnabled}
          disturbanceMode={disturbanceMode}
        />
      </div>

      {/* HEADER */}
      <header className="site-header">
        <span className="site-logo">W-TTY</span>
        <div className="header-right">
          <button
            className={`lang-btn ${lang === 'pt' ? 'active' : ''}`}
            onClick={() => setLang('pt')}
            aria-label="Português"
          >PT</button>
          <span className="lang-sep">|</span>
          <button
            className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
            onClick={() => setLang('en')}
            aria-label="English"
          >EN</button>
        </div>
      </header>

      {/* RESET TO LOGO CTA — visible when user loaded image/text/webcam */}
      {sourceMode !== 'logo' && (
        <button
          className="reset-cta"
          onClick={resetToLogo}
          aria-label={t.resetToLogo}
        >
          {t.resetToLogo}
        </button>
      )}

      {/* CAMERA HINT */}
      {perspective3D && !hudVisible && (
        <div className="cam-hint" aria-live="polite">
          <span>{t.camHintOrbit}</span>
          <span>{t.camHintPan}</span>
          <span>{t.camHintZoom}</span>
          <span>{t.camHintReset}</span>
        </div>
      )}

      {/* STATUS BAR */}
      <div className="status-bar">
        <span className="status-dot" />
        <span className="status-text">{statusMsg}</span>
        <span className="status-text">FPS·{fps}</span>
        <span className="status-text">GRID·{cols}×{rows}</span>
        {perspective3D && (
          <>
            <span className="status-text">RX·{(camState.rotX * 57.3).toFixed(1)}°</span>
            <span className="status-text">RY·{(camState.rotY * 57.3).toFixed(1)}°</span>
            <span className="status-text">Z·{camState.zoom.toFixed(2)}×</span>
          </>
        )}
      </div>

      {/* EDITOR PANEL — always visible, floats below header */}
      <aside className="editor-panel" role="complementary" aria-label="Shader controls">

          {/* TEXT */}
          <HudSection
            label={t.sText}
            id="text"
            open={openSection}
            onToggle={toggleSection}
            tooltip={lang === 'pt' ? 'Renderize textos personalizados em diferentes padrões geométricos.' : 'Render custom texts in different geometric patterns.'}
          >
            <textarea
              className="hud-textarea"
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
              placeholder={t.textPlaceholder}
              rows={3}
              aria-label={t.sText}
            />
            <div className="format-grid mt-2">
              {TEXT_FORMATS.map(f => (
                <button
                  key={f.id}
                  className={`hud-btn ${textFormat === f.id ? 'active' : ''}`}
                  onClick={() => setTextFormat(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <button
                className={`hud-btn flex-1 ${textBold ? 'active' : ''}`}
                onClick={() => setTextBold(v => !v)}
              >
                {textBold ? t.textBoldOn : t.textBoldOff}
              </button>
            </div>
            <HudSlider
              label={t.textSize}
              value={textFontSize} min={24} max={256} step={8}
              onChange={v => setTextFontSize(v)}
            />
            <button
              className="hud-btn hud-btn--primary w-full mt-3"
              onClick={() => applyTextBitmap(textInput, textFormat, cols, rows, textFontSize, textBold)}
            >
              {t.textApply}
            </button>
          </HudSection>

          {/* SOURCE */}
          <HudSection
            label={t.sSource}
            id="source"
            open={openSection}
            onToggle={toggleSection}
            tooltip={lang === 'pt' ? 'Use imagens locais ou sua webcam como matriz de partículas.' : 'Use local images or your webcam as a particle matrix.'}
          >
            <div className="flex gap-2">
              <button
                className="hud-btn flex-1"
                onClick={() => fileInputRef.current?.click()}
              >
                {t.btnUpload}
              </button>
              <button
                className={`hud-btn flex-1 ${webcamActive ? 'active' : ''}`}
                onClick={toggleWebcam}
              >
                {webcamActive ? t.btnStop : t.btnWebcam}
              </button>
            </div>
            <input
              ref={fileInputRef} type="file" className="hidden"
              accept="image/*" onChange={handleFileChange}
            />
          </HudSection>

          {/* FORÇA DO CURSOR / PHYSICS */}
          <HudSection
            label={t.sPhysics}
            id="physics"
            open={openSection}
            onToggle={toggleSection}
            tooltip={lang === 'pt' ? 'Controle a intensidade e o comportamento de repulsão do cursor.' : 'Control the intensity and repulsion behavior of the cursor.'}
          >
            <div className="mb-3">
              <ToggleBtn
                label={mouseEnabled ? t.mouseOn : t.mouseOff}
                active={mouseEnabled}
                onClick={() => setMouseEnabled(v => !v)}
              />
            </div>
            <HudSlider
              label={t.stiffness} desc={t.stiffnessDesc}
              value={config.stiffness} min={0.001} max={0.5} step={0.001}
              onChange={v => cfg('stiffness', v)}
            />
            <HudSlider
              label={t.damping} desc={t.dampingDesc}
              value={config.damping} min={0.5} max={0.99} step={0.01}
              onChange={v => cfg('damping', v)}
            />
            <HudSlider
              label={t.radius} desc={t.radiusDesc}
              value={config.trailRadius} min={0.05} max={0.8} step={0.01}
              onChange={v => cfg('trailRadius', v)}
            />
          </HudSection>

          {/* COLORS */}
          <HudSection
            label={t.sColor}
            id="color"
            open={openSection}
            onToggle={toggleSection}
            tooltip={lang === 'pt' ? 'Defina a paleta cromática e o fundo da estação.' : 'Define the chromatic palette and station background.'}
          >
            <ColorRow label={t.colorPrimary}   value={config.primaryColor}   onChange={v => cfg('primaryColor', v)}   />
            <ColorRow label={t.colorSecondary} value={config.secondaryColor} onChange={v => cfg('secondaryColor', v)} />
            <ColorRow label={t.colorBg}        value={config.bgColor}        onChange={v => cfg('bgColor', v)}        />
            <p className="hud-label-sm mt-3 mb-1">{t.palettes}</p>
            <div className="palette-grid">
              {COLOR_PALETTES.map(p => (
                <button
                  key={p.label}
                  title={p.label}
                  className="palette-swatch"
                  style={{ background: p.primaryColor }}
                  onClick={() => setConfig(prev => ({
                    ...prev,
                    primaryColor: p.primaryColor,
                    secondaryColor: p.secondaryColor,
                    bgColor: p.bgColor,
                  }))}
                />
              ))}
            </div>
          </HudSection>

          {/* TYPOGRAPHY */}
          <HudSection
            label={t.sFont}
            id="font"
            open={openSection}
            onToggle={toggleSection}
            tooltip={lang === 'pt' ? 'Altere a fonte e o tamanho dos glifos ASCII.' : 'Change the font and size of the ASCII glyphs.'}
          >
            <HudSlider
              label={t.charSize}
              value={config.fontSize} min={6} max={16} step={1}
              onChange={v => cfg('fontSize', v)}
            />
            <div className="grid grid-cols-2 gap-1 mt-2">
              {FONT_OPTIONS.slice(0, 6).map(f => (
                <button
                  key={f.family}
                  className={`hud-btn ${config.fontFamily === f.family ? 'active' : ''}`}
                  onClick={() => { loadFont(f.url); cfg('fontFamily', f.family); }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </HudSection>

          {/* ESTADO MOLECULAR / RENDERING */}
          <HudSection
            label={t.sRender}
            id="render"
            open={openSection}
            onToggle={toggleSection}
            tooltip={lang === 'pt' ? 'Ajuste a visibilidade e o comportamento das partículas.' : 'Adjust visibility and particle behavior.'}
          >
            {/* Toggles */}
            <div className="grid grid-cols-2 gap-2">
              <ToggleBtn
                label={invertBitmap ? t.invertOn : t.invertOff}
                active={invertBitmap}
                onClick={() => setInvertBitmap(v => !v)}
              />
              <ToggleBtn
                label={perspective3D ? t.perspOn : t.perspOff}
                active={perspective3D}
                onClick={() => setPerspective3D(v => !v)}
              />
              <ToggleBtn
                label={config.waveEnabled ? t.waveOn : t.waveOff}
                active={config.waveEnabled}
                onClick={() => cfg('waveEnabled', !config.waveEnabled)}
              />
              <ToggleBtn
                label={config.hueShift ? t.hueOn : t.hueOff}
                active={config.hueShift}
                onClick={() => cfg('hueShift', !config.hueShift)}
              />
            </div>

            {/* Disturbance modes */}
            <p className="hud-label-sm mt-3 mb-1">{t.disturbLabel}</p>
            <div className="grid grid-cols-2 gap-1">
              {([
                ['none',      t.distNone],
                ['chaotic',   t.distChaotic],
                ['wave',      t.distWave],
                ['stellar',   t.distStellar],
                ['blackhole', t.distBlackhole],
                ['supernova', t.distSupernova],
              ] as [DisturbanceMode, string][]).map(([mode, label]) => (
                <button
                  key={mode}
                  className={`hud-btn ${disturbanceMode === mode ? 'active' : ''}`}
                  onClick={() => setDisturbanceMode(mode)}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Char style */}
            <p className="hud-label-sm mt-3 mb-1">{t.charStyle}</p>
            <div className="grid grid-cols-3 gap-1">
              {(Object.keys(CHAR_POOLS) as CharStyle[]).map(s => (
                <button
                  key={s}
                  className={`hud-btn ${config.charStyle === s ? 'active' : ''}`}
                  onClick={() => cfg('charStyle', s)}
                >
                  {CHAR_STYLE_LABELS[s]}
                </button>
              ))}
            </div>
          </HudSection>

          {/* PRESETS */}
          <HudSection
            label={t.sPresets}
            id="presets"
            open={openSection}
            onToggle={toggleSection}
            tooltip={lang === 'pt' ? 'Carregue configurações pré-definidas instantaneamente.' : 'Load pre-defined configurations instantly.'}
          >
            <div className="grid grid-cols-2 gap-1">
              {(Object.keys(PRESETS) as PresetKey[]).map(k => (
                <button
                  key={k}
                  className="hud-btn"
                  onClick={() => setConfig(prev => ({ ...PRESETS[k], fontSize: prev.fontSize }))}
                >
                  {PRESETS[k].label}
                </button>
              ))}
            </div>
          </HudSection>

          {/* EXPORT */}
          <HudSection
            label={t.sExport}
            id="export"
            open={openSection}
            onToggle={toggleSection}
            tooltip={lang === 'pt' ? 'Exporte a visualização atual como arquivo de imagem.' : 'Export the current visualization as an image file.'}
          >
            <button className="hud-btn hud-btn--primary w-full" onClick={takeSnapshot}>
              {t.snapshot}
            </button>
          </HudSection>

      </aside>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function HudSection({
  label, id, open, onToggle, tooltip, children,
}: {
  label: string;
  id: HudSection;
  open: HudSection;
  onToggle: (s: HudSection) => void;
  tooltip?: string;
  children: React.ReactNode;
}) {
  const isOpen = open === id;
  return (
    <section className="hud-section" title={tooltip}>
      <button className="hud-section-toggle" onClick={() => onToggle(id)}>
        <span className="hud-label-inline">{label}</span>
        <span className="hud-chevron">{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && <div className="hud-section-body">{children}</div>}
    </section>
  );
}

function ToggleBtn({ label, active, onClick }: {
  label: string; active: boolean; onClick: () => void;
}) {
  return (
    <button className={`hud-btn ${active ? 'active' : ''}`} onClick={onClick}>
      {label}
    </button>
  );
}

function HudSlider({ label, desc, value, min, max, step, onChange }: {
  label: string; desc?: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1 mt-3">
      <div className="flex justify-between">
        <span className="hud-label-sm">{label}</span>
        <span className="hud-value">{value.toFixed(step < 0.01 ? 3 : step < 1 ? 2 : 0)}</span>
      </div>
      {desc && <span className="hud-desc">{desc}</span>}
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full steampunk-slider"
        aria-label={label}
      />
    </div>
  );
}

function ColorRow({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between mt-2">
      <span className="hud-label-sm">{label}</span>
      <input
        type="color" value={value}
        onChange={e => onChange(e.target.value)}
        className="color-swatch"
        aria-label={label}
      />
    </div>
  );
}
