import React from 'react';
import { Eraser } from 'lucide-react';

interface SidebarProps {
  fgColor: string;
  setFgColor: (color: string) => void;
  bgColor: string;
  setBgColor: (color: string) => void;
  cellSize: number;
  setCellSize: (size: number) => void;
  radius: number;
  setRadius: (radius: number) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  clearGrid: () => void;
}

const NEUTRAL_COLORS = [
  '#ffffff', // White
  '#f4f4f5', '#e4e4e7', '#d4d4d8', '#a1a1aa', // Zinc 100-400
  '#71717a', '#52525b', '#3f3f46', '#27272a', // Zinc 500-800
  '#18181b', '#000000', // Zinc 900, Black
];

const ColorPalette = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
  <div className="flex flex-col gap-2 mb-6">
    <span className="text-[10px] uppercase tracking-widest leading-none opacity-50 font-bold">{label}</span>
    <div className="flex flex-wrap gap-1.5">
      {NEUTRAL_COLORS.map(c => (
        <button 
          key={c} 
          onClick={() => onChange(c)} 
          className={`w-5 h-5 border transition-all duration-200 hover:scale-110 ${value === c ? 'border-black scale-110 shadow-sm' : 'border-black/10'}`} 
          style={{ backgroundColor: c }}
          title={c}
        />
      ))}
    </div>
  </div>
);

export const Sidebar: React.FC<SidebarProps> = ({
  fgColor, setFgColor,
  bgColor, setBgColor,
  cellSize, setCellSize,
  radius, setRadius,
  zoom, setZoom,
  clearGrid
}) => {
  return (
    <aside className="w-64 h-full border-l border-black bg-white/90 backdrop-blur-sm p-6 flex flex-col z-40 pointer-events-auto">
      <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-8 border-b border-black pb-2">Ferramentas</h2>
      
      <div className="flex-1 overflow-y-auto space-y-8 no-scrollbar">
        {/* Color Selectors */}
        <div>
          <ColorPalette label="Cor do Objeto" value={fgColor} onChange={setFgColor} />
          <ColorPalette label="Cor do Fundo" value={bgColor} onChange={setBgColor} />
        </div>

        {/* Zoom Slider */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <label htmlFor="zoom-slider" className="text-[10px] font-bold uppercase tracking-widest opacity-70">Zoom</label>
            <span className="text-[10px] font-mono opacity-50">{(zoom * 100).toFixed(0)}%</span>
          </div>
          <input 
            id="zoom-slider"
            type="range" 
            min="0.2" 
            max="4" 
            step="0.1"
            value={zoom} 
            onChange={(e) => setZoom(Number(e.target.value))} 
            aria-label="Ajustar zoom do canvas"
            className="accent-black w-full h-1 cursor-pointer appearance-none bg-black/10 rounded-full" 
          />
        </div>

        {/* Grid Slider */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <label htmlFor="grid-slider" className="text-[10px] font-bold uppercase tracking-widest opacity-70">Grid</label>
            <span className="text-[10px] font-mono opacity-50">{cellSize}px</span>
          </div>
          <input 
            id="grid-slider"
            type="range" 
            min="20" 
            max="120" 
            value={cellSize} 
            onChange={(e) => setCellSize(Number(e.target.value))} 
            aria-label="Ajustar tamanho da grid"
            className="accent-black w-full h-1 cursor-pointer appearance-none bg-black/10 rounded-full" 
          />
        </div>

        {/* Radius Slider */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <label htmlFor="radius-slider" className="text-[10px] font-bold uppercase tracking-widest opacity-70">Radius</label>
            <span className="text-[10px] font-mono opacity-50">{radius}px</span>
          </div>
          <input 
            id="radius-slider"
            type="range" 
            min="0" 
            max={cellSize / 2} 
            value={radius} 
            onChange={(e) => setRadius(Number(e.target.value))} 
            aria-label="Ajustar arredondamento dos cantos"
            className="accent-black w-full h-1 cursor-pointer appearance-none bg-black/10 rounded-full" 
          />
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 space-y-4">
        <button 
          onClick={clearGrid} 
          className="group flex items-center justify-between w-full border border-black p-3 hover:bg-black hover:text-white transition-all duration-300"
        >
          <span className="text-[10px] font-bold uppercase tracking-widest">Limpar Grid</span>
          <Eraser className="w-3.5 h-3.5 transition-transform group-hover:-rotate-12" />
        </button>

        <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 text-center py-2 italic font-serif">
          Deus no controle
        </p>
      </div>
    </aside>
  );
};
