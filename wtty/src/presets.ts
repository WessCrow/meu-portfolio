// ── ShaderConfig — single source of truth for all shader params ──────────────
export interface ShaderConfig {
  // Physics
  stiffness:     number;   // 0.001–0.5  spring return force
  damping:       number;   // 0.5–0.99   velocity decay
  trailRadius:   number;   // 0–1        fraction of canvas width
  scanFrequency: number;   // 0–0.05     CRT scan speed
  depthIntensity: number;  // 0–1        density-based opacity

  // Colors
  primaryColor:   string;  // hex — high density chars
  secondaryColor: string;  // hex — low density chars
  bgColor:        string;  // hex — canvas background

  // Typography
  fontFamily: string;
  fontSize:   number;      // px (affects canvas grid size)

  // Characters
  charStyle: CharStyle;

  // Visual FX
  glowStrength: number;    // 0–2   displacement glow multiplier
  waveEnabled:  boolean;   // idle wave animation
  waveStrength: number;    // 0–1   wave force
  hueShift:     boolean;   // rainbow hue cycling
  hueSpeed:     number;    // 0–2   hue rotation speed
}

export type CharStyle = 'default' | 'matrix' | 'binary' | 'blocks' | 'minimal' | 'code';

// ── Character pools by style (5 density levels: 0=empty, 4=dense) ─────────────
export const CHAR_POOLS: Record<CharStyle, string[]> = {
  default: ['', '.,-', ':;~+', 'xX=*%', '#@W8&'],
  matrix:  ['', '.-+', '@#$%', '&*!?=', 'TRON>'],
  binary:  ['', '0', '01', '010', '0101'],
  blocks:  ['', '░', '░▒', '▒▓', '▓█'],
  minimal: ['', '.', ':', 'x', '#'],
  code:    ['', '.,;', '(){}', '<>!=?', '@$%&#'],
};

// ── Google Fonts options ───────────────────────────────────────────────────────
export interface FontOption {
  label:  string;
  family: string;   // CSS font-family value
  url:    string;   // Google Fonts URL to load
}

export const FONT_OPTIONS: FontOption[] = [
  {
    label:  'Geist Mono',
    family: '"Geist Mono", monospace',
    url:    'https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;700&display=swap',
  },
  {
    label:  'JetBrains',
    family: '"JetBrains Mono", monospace',
    url:    'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap',
  },
  {
    label:  'Fira Code',
    family: '"Fira Code", monospace',
    url:    'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&display=swap',
  },
  {
    label:  'VT323',
    family: '"VT323", monospace',
    url:    'https://fonts.googleapis.com/css2?family=VT323&display=swap',
  },
  {
    label:  'Space Mono',
    family: '"Space Mono", monospace',
    url:    'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap',
  },
  {
    label:  'Press Start',
    family: '"Press Start 2P", monospace',
    url:    'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap',
  },
  {
    label:  'Bitcount',
    family: '"Bitcount Grid Single", sans-serif',
    url:    'https://fonts.googleapis.com/css2?family=Bitcount+Grid+Single&display=swap',
  },
];

// ── Quick color palettes ───────────────────────────────────────────────────────
export interface ColorPalette {
  label:         string;
  primaryColor:  string;
  secondaryColor: string;
  bgColor:       string;
}

export const COLOR_PALETTES: ColorPalette[] = [
  { label: 'Tron',      primaryColor: '#00ffcc', secondaryColor: '#004466', bgColor: '#050505' },
  { label: 'Matrix',    primaryColor: '#00ff41', secondaryColor: '#005500', bgColor: '#020a02' },
  { label: 'Amber',     primaryColor: '#ffb000', secondaryColor: '#662200', bgColor: '#050300' },
  { label: 'Cyber',     primaryColor: '#ff00ff', secondaryColor: '#001133', bgColor: '#050005' },
  { label: 'Ice',       primaryColor: '#88ddff', secondaryColor: '#003366', bgColor: '#010508' },
  { label: 'Blood',     primaryColor: '#ff3333', secondaryColor: '#550000', bgColor: '#080000' },
  { label: 'Gold',      primaryColor: '#ffd700', secondaryColor: '#3d2b00', bgColor: '#050400' },
  { label: 'Ghost',     primaryColor: '#e0e0e0', secondaryColor: '#404040', bgColor: '#050505' },
];

// ── Preset definitions (preset = named ShaderConfig) ─────────────────────────
export type PresetKey = 'tron' | 'matrix' | 'retro' | 'cyber' | 'mono';

export interface Preset extends ShaderConfig {
  label: string;
}

export const PRESETS: Record<PresetKey, Preset> = {
  tron: {
    label:         'Tron',
    stiffness:     0.15,
    damping:       0.82,
    trailRadius:   0.28,
    scanFrequency: 0.01,
    depthIntensity: 0.8,
    primaryColor:  '#00ffcc',
    secondaryColor: '#004466',
    bgColor:       '#050505',
    fontFamily:    '"Geist Mono", monospace',
    fontSize:      9,
    charStyle:     'default',
    glowStrength:  1.0,
    waveEnabled:   false,
    waveStrength:  0.2,
    hueShift:      false,
    hueSpeed:      0.5,
  },
  matrix: {
    label:         'Matrix',
    stiffness:     0.08,
    damping:       0.88,
    trailRadius:   0.36,
    scanFrequency: 0.02,
    depthIntensity: 0.6,
    primaryColor:  '#00ff41',
    secondaryColor: '#005500',
    bgColor:       '#020a02',
    fontFamily:    '"Geist Mono", monospace',
    fontSize:      9,
    charStyle:     'matrix',
    glowStrength:  1.2,
    waveEnabled:   true,
    waveStrength:  0.15,
    hueShift:      false,
    hueSpeed:      0.5,
  },
  retro: {
    label:         'Terminal',
    stiffness:     0.25,
    damping:       0.75,
    trailRadius:   0.15,
    scanFrequency: 0.03,
    depthIntensity: 0.5,
    primaryColor:  '#ffb000',
    secondaryColor: '#662200',
    bgColor:       '#050300',
    fontFamily:    '"VT323", monospace',
    fontSize:      11,
    charStyle:     'minimal',
    glowStrength:  0.8,
    waveEnabled:   false,
    waveStrength:  0.1,
    hueShift:      false,
    hueSpeed:      0.5,
  },
  cyber: {
    label:         'Cyberpunk',
    stiffness:     0.12,
    damping:       0.80,
    trailRadius:   0.33,
    scanFrequency: 0.015,
    depthIntensity: 0.9,
    primaryColor:  '#ff00ff',
    secondaryColor: '#001133',
    bgColor:       '#050005',
    fontFamily:    '"Space Mono", monospace',
    fontSize:      9,
    charStyle:     'code',
    glowStrength:  1.5,
    waveEnabled:   true,
    waveStrength:  0.3,
    hueShift:      true,
    hueSpeed:      0.3,
  },
  mono: {
    label:         'Tech Monochrome',
    stiffness:     0.05,
    damping:       0.92,
    trailRadius:   0.4,
    scanFrequency: 0.005,
    depthIntensity: 1.0,
    primaryColor:  '#FFFFFF',
    secondaryColor: '#333333',
    bgColor:       '#000000',
    fontFamily:    '"Geist Mono", monospace',
    fontSize:      8,
    charStyle:     'default',
    glowStrength:  2.0,
    waveEnabled:   true,
    waveStrength:  0.08,
    hueShift:      false,
    hueSpeed:      0,
  },
};
