import { useCallback, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { ParticleTextEffect } from '@/components/ui/particle-text-effect';

const DEFAULT_LINES = ['W+SHADERS', 'ASCII', 'ENGINE', 'GENERATIVE', 'W-TTY'].join('\n');

const LABELS = {
  pt: {
    panelTitle: 'Ferramenta de edição',
    words: 'Palavras (uma por linha)',
    wordsHelp: 'Linhas vazias são ignoradas.',
    fontSize: 'Tamanho da fonte (máscara)',
    pixelSteps: 'Passo de amostragem',
    pixelHelp: 'Maior = menos partículas.',
    cycle: 'Intervalo de troca (frames)',
    cycleHelp: 'Ex.: 240 ≈ 4 s a 60 fps.',
    trail: 'Rastro (alpha do fundo)',
    textColor: 'Cor do texto (máscara)',
    canvasW: 'Largura do canvas (px)',
    canvasH: 'Altura do canvas (px)',
    drawPoints: 'Desenhar como pontos',
    apply: 'Aplicar ao canvas',
    reset: 'Restaurar padrão',
    hint: 'Botão direito + arrastar: destruir partículas. Use Aplicar para reconfigurar o motor.',
  },
  en: {
    panelTitle: 'Edit tool',
    words: 'Words (one per line)',
    wordsHelp: 'Empty lines are skipped.',
    fontSize: 'Mask font size',
    pixelSteps: 'Pixel sample step',
    pixelHelp: 'Higher = fewer particles.',
    cycle: 'Word cycle (frames)',
    cycleHelp: 'e.g. 240 ≈ 4 s at 60 fps.',
    trail: 'Trail (background alpha)',
    textColor: 'Text color (mask)',
    canvasW: 'Canvas width (px)',
    canvasH: 'Canvas height (px)',
    drawPoints: 'Draw as points',
    apply: 'Apply to canvas',
    reset: 'Reset defaults',
    hint: 'Right-click drag destroys particles. Apply pushes settings to the engine.',
  },
} as const;

function parseWords(text: string): string[] {
  return text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

function SliderRow({
  label,
  help,
  value,
  min,
  max,
  step,
  onChange,
  display,
  labelClass,
  valueClass,
}: {
  label: string;
  help?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
  display: string;
  labelClass: string;
  valueClass: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between gap-2">
        <span className={labelClass}>{label}</span>
        <span className={valueClass}>{display}</span>
      </div>
      {help ? <p className="text-[11px] leading-snug text-zinc-600 mb-1">{help}</p> : null}
      <input
        type="range"
        className="w-full accent-zinc-300"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
      />
    </div>
  );
}

export interface ParticleTextEditorProps {
  lang: 'pt' | 'en';
}

export function ParticleTextEditor({ lang }: ParticleTextEditorProps) {
  const L = LABELS[lang];

  const [draftText, setDraftText] = useState(DEFAULT_LINES);
  const [fontSizePx, setFontSizePx] = useState(100);
  const [pixelSteps, setPixelSteps] = useState(6);
  const [wordCycleFrames, setWordCycleFrames] = useState(240);
  const [trailAlpha, setTrailAlpha] = useState(0.1);
  const [textFill, setTextFill] = useState('#ffffff');
  const [canvasWidth, setCanvasWidth] = useState(1000);
  const [canvasHeight, setCanvasHeight] = useState(500);
  const [drawAsPoints, setDrawAsPoints] = useState(true);

  const [applied, setApplied] = useState(() => ({
    words: parseWords(DEFAULT_LINES),
    fontSizePx: 100,
    pixelSteps: 6,
    wordCycleFrames: 240,
    trailAlpha: 0.1,
    textFill: '#ffffff',
    canvasWidth: 1000,
    canvasHeight: 500,
    drawAsPoints: true,
  }));

  const apply = useCallback(() => {
    const words = parseWords(draftText);
    if (words.length === 0) return;
    setApplied({
      words,
      fontSizePx,
      pixelSteps,
      wordCycleFrames,
      trailAlpha,
      textFill,
      canvasWidth,
      canvasHeight,
      drawAsPoints,
    });
  }, [
    draftText,
    fontSizePx,
    pixelSteps,
    wordCycleFrames,
    trailAlpha,
    textFill,
    canvasWidth,
    canvasHeight,
    drawAsPoints,
  ]);

  const resetDefaults = useCallback(() => {
    setDraftText(DEFAULT_LINES);
    setFontSizePx(100);
    setPixelSteps(6);
    setWordCycleFrames(240);
    setTrailAlpha(0.1);
    setTextFill('#ffffff');
    setCanvasWidth(1000);
    setCanvasHeight(500);
    setDrawAsPoints(true);
    setApplied({
      words: parseWords(DEFAULT_LINES),
      fontSizePx: 100,
      pixelSteps: 6,
      wordCycleFrames: 240,
      trailAlpha: 0.1,
      textFill: '#ffffff',
      canvasWidth: 1000,
      canvasHeight: 500,
      drawAsPoints: true,
    });
  }, []);

  const fieldClass =
    'w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-[box-shadow,transform] focus:border-zinc-500 focus:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] active:scale-[0.998]';

  const labelClass = 'block text-xs font-medium uppercase tracking-wide text-zinc-400 mb-1';
  const valueClass = 'font-mono text-xs text-zinc-500 tabular-nums';

  return (
    <div className="grid min-h-0 w-full max-w-[1400px] mx-auto grid-cols-1 gap-4 px-4 pb-10 pt-[52px] lg:grid-cols-[1fr_minmax(280px,360px)] lg:gap-6">
      <div className="flex min-h-[min(70dvh,560px)] flex-col items-stretch justify-center lg:min-h-[72dvh]">
        <ParticleTextEffect
          lang={lang}
          words={applied.words}
          fontSizePx={applied.fontSizePx}
          pixelSteps={applied.pixelSteps}
          wordCycleFrames={applied.wordCycleFrames}
          trailAlpha={applied.trailAlpha}
          textFill={applied.textFill}
          canvasWidth={applied.canvasWidth}
          canvasHeight={applied.canvasHeight}
          drawAsPoints={applied.drawAsPoints}
          showFooter={false}
        />
      </div>

      <aside
        className="flex h-fit flex-col gap-4 rounded-md border border-zinc-800 bg-zinc-900/85 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm lg:sticky lg:top-[52px]"
        aria-label={L.panelTitle}
      >
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-zinc-500" strokeWidth={1.75} aria-hidden />
          <h2 className="text-sm font-semibold tracking-tight text-zinc-200">{L.panelTitle}</h2>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="particle-words" className={labelClass}>
            {L.words}
          </label>
          <p className="text-[11px] text-zinc-600">{L.wordsHelp}</p>
          <textarea
            id="particle-words"
            rows={6}
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            className={`${fieldClass} min-h-[120px] resize-y font-mono text-[13px] leading-relaxed`}
            spellCheck={false}
          />
        </div>

        <SliderRow
          label={L.fontSize}
          value={fontSizePx}
          min={32}
          max={200}
          step={2}
          onChange={setFontSizePx}
          display={`${fontSizePx}px`}
          labelClass={labelClass}
          valueClass={valueClass}
        />

        <SliderRow
          label={L.pixelSteps}
          help={L.pixelHelp}
          value={pixelSteps}
          min={2}
          max={14}
          step={1}
          onChange={setPixelSteps}
          display={String(pixelSteps)}
          labelClass={labelClass}
          valueClass={valueClass}
        />

        <SliderRow
          label={L.cycle}
          help={L.cycleHelp}
          value={wordCycleFrames}
          min={60}
          max={600}
          step={10}
          onChange={setWordCycleFrames}
          display={String(wordCycleFrames)}
          labelClass={labelClass}
          valueClass={valueClass}
        />

        <SliderRow
          label={L.trail}
          value={trailAlpha}
          min={0.02}
          max={0.35}
          step={0.01}
          onChange={setTrailAlpha}
          display={trailAlpha.toFixed(2)}
          labelClass={labelClass}
          valueClass={valueClass}
        />

        <div className="flex flex-col gap-1">
          <span className={labelClass}>{L.textColor}</span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={textFill}
              onChange={(e) => setTextFill(e.target.value)}
              className="h-9 w-14 cursor-pointer rounded border border-zinc-700 bg-zinc-950 p-0.5"
              aria-label={L.textColor}
            />
            <span className={`${valueClass} uppercase`}>{textFill}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <span className={labelClass}>{L.canvasW}</span>
            <input
              type="number"
              min={320}
              max={1600}
              step={10}
              value={canvasWidth}
              onChange={(e) => setCanvasWidth(Number(e.target.value))}
              className={fieldClass}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className={labelClass}>{L.canvasH}</span>
            <input
              type="number"
              min={200}
              max={900}
              step={10}
              value={canvasHeight}
              onChange={(e) => setCanvasHeight(Number(e.target.value))}
              className={fieldClass}
            />
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-2 border-t border-zinc-800 pt-3">
          <input
            type="checkbox"
            checked={drawAsPoints}
            onChange={(e) => setDrawAsPoints(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-600 bg-zinc-950 accent-zinc-300"
          />
          <span className="text-sm text-zinc-300">{L.drawPoints}</span>
        </label>

        <div className="mt-1 flex flex-col gap-2 border-t border-zinc-800 pt-3 sm:flex-row">
          <button
            type="button"
            onClick={apply}
            className="flex-1 rounded-md border border-zinc-600 bg-zinc-100 px-3 py-2.5 text-sm font-medium text-zinc-900 transition-[transform,box-shadow] hover:bg-white active:scale-[0.98]"
          >
            {L.apply}
          </button>
          <button
            type="button"
            onClick={resetDefaults}
            className="flex-1 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-300 transition-[transform,border-color] hover:border-zinc-500 active:scale-[0.98]"
          >
            {L.reset}
          </button>
        </div>

        <p className="text-[11px] leading-relaxed text-zinc-600">{L.hint}</p>
      </aside>
    </div>
  );
}
