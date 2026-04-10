import React, { useRef, useEffect, useState } from 'react';
import { Download, Image as ImageIcon, FileText, Gamepad2 } from 'lucide-react';
import { useBlobStore } from '../store/gridStore';
import { GooeyFilter } from './GooeyFilter';
import { WelcomePopup } from './WelcomePopup';
import { Sidebar } from './Sidebar';
import { Notification, NotificationType } from './Notification';
import CustomLogo from '../assets/IMG/W+TYPE.png';

const GridEngine: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [winSize, setWinSize] = useState({ w: 0, h: 0 });
  console.log("WTYPE Builder v1.0.1-cb");
  const [cellSize, setCellSize] = useState(60);
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [activeAction, setActiveAction] = useState<'panning' | 'painting' | 'erasing' | 'zooming-in' | 'zooming-out' | 'none'>('none');
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const lastPanPos = useRef({ x: 0, y: 0 });
  const zoomTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hoveredCellActive, setHoveredCellActive] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: NotificationType} | null>(null);

  const showNotify = (message: string, type: NotificationType = 'success') => {
    setNotification({ message, type });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleCloseWelcome = () => {
    setShowWelcome(false);
  };

  const {
    activeCells,
    startDrawing,
    continueDrawing,
    stopDrawing,
    clearGrid,
    isDrawing,
    radius,
    setRadius,
    fgColor,
    bgColor,
    setFgColor,
    setBgColor
  } = useBlobStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(true);
        if (e.target === document.body) e.preventDefault();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      setWinSize({ w: clientWidth, h: clientHeight });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const centerX = (winSize.w / 2) + panOffset.x;
  const centerY = (winSize.h / 2) + panOffset.y;

  const visualCellSize = cellSize * zoom;
  const visualRadius = radius * zoom;

  const getCoords = (e: React.PointerEvent) => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const x = Math.floor((clientX - centerX) / visualCellSize);
    const y = Math.floor((clientY - centerY) / visualCellSize);
    return { x, y };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);

    if (e.button === 1 || e.button === 4 || (e.button === 0 && isSpacePressed)) {
      setActiveAction('panning');
      lastPanPos.current = { x: e.clientX, y: e.clientY };
      return;
    }

    if (e.button === 2) {
      setActiveAction('erasing');
    } else {
      setActiveAction('painting');
    }

    const coords = getCoords(e);
    if (coords) startDrawing(coords.x, coords.y, e.button === 2 ? 'erase' : 'paint');
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (activeAction === 'panning') {
      const dx = e.clientX - lastPanPos.current.x;
      const dy = e.clientY - lastPanPos.current.y;
      setPanOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      lastPanPos.current = { x: e.clientX, y: e.clientY };
      return;
    }

    const coords = getCoords(e);
    
    if (coords && !isDrawing) {
      const isOverActive = useBlobStore.getState().activeCells.has(`${coords.x},${coords.y}`);
      if (isOverActive !== hoveredCellActive) {
        setHoveredCellActive(isOverActive);
      }
    }

    if (!isDrawing) return;
    if (coords) continueDrawing(coords.x, coords.y);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setActiveAction('none');
    stopDrawing();
    e.currentTarget.releasePointerCapture(e.pointerId);
    
    const coords = getCoords(e);
    if (coords) {
      setHoveredCellActive(useBlobStore.getState().activeCells.has(`${coords.x},${coords.y}`));
    }
  };

  const handlePointerLeave = () => {
    setActiveAction('none');
    stopDrawing();
    setHoveredCellActive(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    const zoomDirection = e.deltaY < 0 ? 1 : -1;
    const zoomStep = 0.1;
    setZoom((prev) => Math.min(Math.max(prev + (zoomDirection * zoomStep), 0.2), 4));

    setActiveAction(zoomDirection > 0 ? 'zooming-in' : 'zooming-out');
    if (zoomTimerRef.current) clearTimeout(zoomTimerRef.current);
    zoomTimerRef.current = setTimeout(() => {
      setActiveAction(prev => (prev === 'zooming-in' || prev === 'zooming-out' ? 'none' : prev));
    }, 250);
  };

  const generateExportSvg = () => {
    if (activeCells.size === 0) return null;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    activeCells.forEach(key => {
      const [x, y] = key.split(',').map(Number);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    });

    const padding = 2; // Keep some negative space
    const vC = cellSize;
    const r = Math.min(radius, vC / 2);

    const viewWidth = (maxX - minX + 1 + padding * 2) * vC;
    const viewHeight = (maxY - minY + 1 + padding * 2) * vC;

    const segments: { lg1: string, lg2: string, p1: { x: number, y: number }, p2: { x: number, y: number } }[] = [];

    activeCells.forEach(key => {
      const [gx, gy] = key.split(',').map(Number);
      const x = (gx - minX + padding) * vC;
      const y = (gy - minY + padding) * vC;

      if (!activeCells.has(`${gx},${gy - 1}`)) segments.push({ lg1: `${gx},${gy}`, lg2: `${gx + 1},${gy}`, p1: { x, y }, p2: { x: x + vC, y } }); // Top
      if (!activeCells.has(`${gx + 1},${gy}`)) segments.push({ lg1: `${gx + 1},${gy}`, lg2: `${gx + 1},${gy + 1}`, p1: { x: x + vC, y }, p2: { x: x + vC, y: y + vC } }); // Right
      if (!activeCells.has(`${gx + 1},${gy + 1}`)) segments.push({ lg1: `${gx + 1},${gy + 1}`, lg2: `${gx},${gy + 1}`, p1: { x: x + vC, y: y + vC }, p2: { x, y: y + vC } }); // Bottom
      if (!activeCells.has(`${gx - 1},${gy}`)) segments.push({ lg1: `${gx},${gy + 1}`, lg2: `${gx},${gy}`, p1: { x, y: y + vC }, p2: { x, y } }); // Left
    });

    const loops: { x: number, y: number }[][] = [];
    while (segments.length > 0) {
      const current = segments.pop()!;
      const loop = [current.p1, current.p2];
      let lastNode = current.lg2;

      while (true) {
        const nextIdx = segments.findIndex(s => s.lg1 === lastNode);
        if (nextIdx === -1) break;

        const nextSeg = segments.splice(nextIdx, 1)[0];
        if (nextSeg.lg2 === current.lg1) break;
        loop.push(nextSeg.p2);
        lastNode = nextSeg.lg2;
      }
      loops.push(loop);
    }

    const pathData = loops.map(loop => {
      const simpleLoop = [];
      for (let i = 0; i < loop.length; i++) {
        const p1 = loop[(i - 1 + loop.length) % loop.length];
        const p2 = loop[i];
        const p3 = loop[(i + 1) % loop.length];
        const cross = (p2.x - p1.x) * (p3.y - p2.y) - (p2.y - p1.y) * (p3.x - p2.x);
        if (cross !== 0) simpleLoop.push(p2);
      }

      let d = "";
      for (let i = 0; i < simpleLoop.length; i++) {
        const prev = simpleLoop[(i - 1 + simpleLoop.length) % simpleLoop.length];
        const corner = simpleLoop[i];
        const next = simpleLoop[(i + 1) % simpleLoop.length];

        const len1 = Math.hypot(prev.x - corner.x, prev.y - corner.y);
        const dir1 = { x: (prev.x - corner.x) / len1, y: (prev.y - corner.y) / len1 };

        const len2 = Math.hypot(next.x - corner.x, next.y - corner.y);
        const dir2 = { x: (next.x - corner.x) / len2, y: (next.y - corner.y) / len2 };

        if (r === 0) {
          d += i === 0 ? `M ${corner.x} ${corner.y} ` : `L ${corner.x} ${corner.y} `;
        } else {
          const A = { x: corner.x + dir1.x * r, y: corner.y + dir1.y * r };
          const B = { x: corner.x + dir2.x * r, y: corner.y + dir2.y * r };

          d += i === 0 ? `M ${A.x} ${A.y} ` : `L ${A.x} ${A.y} `;

          const cross = dir1.x * dir2.y - dir1.y * dir2.x;
          // Outer corners curve right (+), Inner corners curve left (-) 
          const sweepFlag = cross > 0 ? 0 : 1;
          d += `A ${r} ${r} 0 0 ${sweepFlag} ${B.x} ${B.y} `;
        }
      }
      return d + "Z";
    }).join(" ");

    const filterString = `
    <defs>
      <filter id="gooey" color-interpolation-filters="sRGB">
        <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
        <feColorMatrix 
          in="blur" 
          mode="matrix" 
          values="
            1 0 0 0 0  
            0 1 0 0 0  
            0 0 1 0 0  
            0 0 0 20 -8
          " 
          result="gooey" 
        />
        <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
      </filter>
    </defs>`;

    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewWidth} ${viewHeight}" width="${viewWidth}" height="${viewHeight}">
      ${filterString}
      <g filter="url(#gooey)">
        <path d="${pathData}" fill="${fgColor}" fill-rule="nonzero"/>
      </g>
    </svg>`;

    return { svgContent, viewWidth, viewHeight };
  };

  const downloadSvg = () => {
    const exported = generateExportSvg();
    if (!exported) return showNotify('Seu grid está vazio. Desenhe algo primeiro para exportar!', 'error');

    const blob = new Blob([exported.svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `pulse-liquid-${Date.now()}.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadPng = () => {
    const exported = generateExportSvg();
    if (!exported) return showNotify('Seu grid está vazio. Desenhe algo primeiro para exportar!', 'error');

    const blob = new Blob([exported.svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const TARGET_SIZE = 1920;
      const scale = Math.max(1, TARGET_SIZE / Math.max(exported.viewWidth, exported.viewHeight));

      const canvas = document.createElement('canvas');
      canvas.width = exported.viewWidth * scale;
      canvas.height = exported.viewHeight * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((pngBlob) => {
        if (!pngBlob) return;
        const pngUrl = URL.createObjectURL(pngBlob);
        const link = document.createElement('a');
        link.download = `pulse-liquid-${Date.now()}.png`;
        link.href = pngUrl;
        link.click();
        URL.revokeObjectURL(pngUrl);
        URL.revokeObjectURL(url);
      }, 'image/png');
    };
    img.src = url;
  };

  const downloadPdf = () => {
    const exported = generateExportSvg();
    if (!exported) return showNotify('Seu grid está vazio. Desenhe algo primeiro para exportar!', 'error');

    const blob = new Blob([exported.svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = async () => {
      const TARGET_SIZE = 1920;
      const scale = Math.max(1, TARGET_SIZE / Math.max(exported.viewWidth, exported.viewHeight));

      const canvas = document.createElement('canvas');
      canvas.width = exported.viewWidth * scale;
      canvas.height = exported.viewHeight * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);

      try {
        const { default: jsPDF } = await import('jspdf');
        const orientation = exported.viewWidth > exported.viewHeight ? 'l' : 'p';
        const pdf = new jsPDF({
          orientation,
          unit: 'px',
          format: [exported.viewWidth, exported.viewHeight]
        });

        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, exported.viewWidth, exported.viewHeight);
        pdf.save(`pulse-liquid-${Date.now()}.pdf`);
      } catch (err) {
        console.error("Failed to generate PDF", err);
        showNotify("Erro ao gerar PDF. Tente novamente ou use SVG/PNG.", "error");
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const activeCellsList = Array.from(activeCells).map((key) => {
    const [x, y] = key.split(',').map(Number);
    return (
      <div
        key={key}
        className="absolute"
        style={{
          backgroundColor: fgColor,
          width: visualCellSize + 2,
          height: visualCellSize + 2,
          left: centerX + (x * visualCellSize) - 1,
          top: centerY + (y * visualCellSize) - 1,
          borderRadius: `${visualRadius}px`,
          transformOrigin: 'center center',
          animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        }}
      />
    );
  });

  const isDarkBg = ['#000000', '#18181b', '#27272a', '#3f3f46', '#52525b', '#71717a'].includes(bgColor);

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden">
      <GooeyFilter zoom={zoom} />

      {/* 🧭 Top Bar Branding & Primary Actions */}
      <nav className="h-16 border-b border-black flex items-center justify-between px-6 z-50 bg-white/90 backdrop-blur-sm text-black shrink-0">
        <div className="flex items-center gap-4 h-16">
          <div className="flex items-center gap-2 group/logo relative">
            <img src={CustomLogo} alt="Logo" className="h-8 w-auto mix-blend-multiply" />
            <div className="h-4 w-[1px] bg-black/20 mx-1" />
            <a 
              href="https://wesscrow.github.io/meu-portfolio/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 transition-opacity hover:!opacity-100 whitespace-nowrap"
            >
              by wess
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4 h-16">
          {/* Info Tooltip */}
          <div className="relative group flex items-center gap-2 h-16 justify-center cursor-help pr-4">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-50 transition-opacity">Info</span>
            <Gamepad2 className="w-3.5 h-3.5 opacity-50 transition-opacity group-hover:opacity-100 cursor-help" />
            <div className="absolute right-0 top-[64px] mt-[-1px] w-64 bg-black text-white p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50">
              <h3 className="font-bold text-xs uppercase tracking-widest mb-2 border-b border-white/20 pb-1">Controls</h3>
              <ul className="text-[10px] space-y-1 font-mono uppercase tracking-widest opacity-80">
                <li><span className="font-bold">Click + Drag:</span> Draw Shape</li>
                <li><span className="font-bold">Space + Drag:</span> Pan Canvas</li>
                <li><span className="font-bold">Right-Click:</span> Erase Block</li>
                <li><span className="font-bold">Mid-Click:</span> Pan Canvas</li>
                <li><span className="font-bold">Scroll Wheel:</span> Zoom IN/OUT</li>
              </ul>
            </div>
          </div>

          {/* CTA: Download */}
          <div className="relative group flex items-center h-16 justify-center">
            <button className="bg-black text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 transition-all duration-200 flex items-center gap-2 hover:bg-zinc-800 border border-black group">
              Download
              <Download className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" />
            </button>

            <div className="absolute right-0 top-[64px] bg-white border border-t-0 border-black shadow-lg flex flex-col pointer-events-auto opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 mt-[-1px] min-w-[140px] text-black text-left">
              <button onClick={downloadSvg} className="text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white px-4 py-3 transition-colors flex items-center justify-between w-full border-b border-black/10">
                <span>SVG Vector</span>
                <Download className="w-3 h-3 opacity-50" />
              </button>
              <button onClick={downloadPng} className="text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white px-4 py-3 transition-colors flex items-center justify-between w-full border-b border-black/10">
                <span>PNG High Res</span>
                <ImageIcon className="w-3 h-3 opacity-50" />
              </button>
              <button onClick={downloadPdf} className="text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white px-4 py-3 transition-colors flex items-center justify-between w-full">
                <span>PDF Document</span>
                <FileText className="w-3 h-3 opacity-50" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 w-full overflow-hidden">
        {/* 🏗️ Center-Anchored Grid Workspace */}
        <main
          ref={containerRef}
          className={`relative flex-1 h-full overflow-hidden select-none touch-none grid-canvas transition-colors duration-300 ${isSpacePressed ? (activeAction === 'panning' ? 'cursor-grabbing' : 'cursor-grab') : activeAction === 'panning' ? 'cursor-grabbing' : activeAction === 'painting' ? 'cursor-paint' : activeAction === 'erasing' ? 'cursor-erase' : activeAction === 'zooming-in' ? 'cursor-zoom-in' : activeAction === 'zooming-out' ? 'cursor-zoom-out' : hoveredCellActive ? 'cursor-erase' : 'cursor-paint'}`}
          style={{
            backgroundColor: bgColor,
            '--grid-color': isDarkBg ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
            '--dot-color': isDarkBg ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)',
            backgroundSize: `${visualCellSize}px ${visualCellSize}px`,
            backgroundPosition: `${centerX}px ${centerY}px`,
          } as React.CSSProperties}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
          onWheel={handleWheel}
          onContextMenu={(e) => e.preventDefault()}
        >
          <div
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ filter: "url('#gooey')" }}
          >
            {activeCellsList}
          </div>
        </main>

        {/* 🛠️ Right Sidebar Tools */}
        <Sidebar 
          fgColor={fgColor}
          setFgColor={setFgColor}
          bgColor={bgColor}
          setBgColor={setBgColor}
          cellSize={cellSize}
          setCellSize={setCellSize}
          radius={radius}
          setRadius={setRadius}
          zoom={zoom}
          setZoom={setZoom}
          clearGrid={clearGrid}
        />
      </div>

      <style>{`
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .cursor-grab { cursor: grab !important; }
        .cursor-grabbing { cursor: grabbing !important; }
        .cursor-paint { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='white' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z'/%3E%3Cpath d='m5 2 5 5'/%3E%3Cpath d='M2 13h15'/%3E%3Cpath d='M22 20a2 2 0 1 1-4 0c0-1.6 1.7-2.4 2-4 .3 1.6 2 2.4 2 4Z'/%3E%3C/svg%3E") 0 24, crosshair !important; }
        .cursor-erase { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='white' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21'/%3E%3Cpath d='M22 21H7'/%3E%3Cpath d='m5 11 9 9'/%3E%3C/svg%3E") 0 24, crosshair !important; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      {showWelcome && <WelcomePopup onClose={handleCloseWelcome} />}

      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}
    </div>
  );
};

export default GridEngine;

// Cache bust: 2026-04-08T13:55:00Z

