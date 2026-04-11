"use client";
import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { GlitchImage } from "../../components/ui/GlitchImage";
import { ProjectRow } from "../../components/ui/ProjectRow";
import { ExpCell } from "../../components/ui/ExpCell";
import { withPrefix } from "../utils/paths";

export default function ProtocolPage() {
   const [isHovered, setIsHovered] = useState(false);

   return (
      <div className="min-h-screen bg-[#F8F8F8] p-8 md:p-24 selection:bg-black selection:text-white" style={{ cursor: 'auto' }}>
         <style jsx global>{`
            body { cursor: auto !important; }
            button, a, [role="button"] { cursor: pointer !important; }
         `}</style>
         <header className="mb-24 border-b border-black/10 pb-12 flex justify-between items-end">
            <div>
               <span className="font-mono text-[10px] uppercase tracking-[0.4em] opacity-30 italic">v26.2 // DESIGN_PROTOCOLS</span>
               <h1 className="text-6xl font-display font-bold tracking-tighter uppercase mt-4">Wess Storybook</h1>
            </div>
            <a href={withPrefix("/")} className="font-mono text-[10px] hover:line-through opacity-50">Voltar ao Portfólio ↑</a>
         </header>

         <main className="space-y-32">
            {/* SECTION 01: ATOMS - COLORS */}
            <section>
               <div className="flex items-center gap-4 mb-12">
                  <span className="w-12 h-[1px] bg-black opacity-20" />
                  <h2 className="font-mono text-[11px] uppercase tracking-[0.4em] font-bold">01 // ATOMS_COLORS</h2>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                  <ColorAtom name="Canvas" hex="#F8F8F8" token="--color-canvas" />
                  <ColorAtom name="Ink" hex="#000000" token="--color-ink" />
                  <ColorAtom name="Muted" hex="#666666" token="--color-ink-muted" />
                  <ColorAtom name="Grid" hex="rgba(0,0,0,0.08)" token="--color-grid" />
                  <ColorAtom name="Glitch_R" hex="Red-Left" token="hue(340deg)" isGlitch />
                  <ColorAtom name="Glitch_B" hex="Blue-Right" token="hue(200deg)" isGlitch />
               </div>
            </section>

            {/* SECTION 02: ATOMS - TYPOGRAPHY */}
            <section>
               <div className="flex items-center gap-4 mb-12">
                  <span className="w-12 h-[1px] bg-black opacity-20" />
                  <h2 className="font-mono text-[11px] uppercase tracking-[0.4em] font-bold">02 // ATOMS_TYPO</h2>
               </div>
               <div className="space-y-12">
                  <div className="border-b border-black/5 pb-8">
                     <p className="font-mono text-[9px] opacity-30 mb-4 uppercase font-bold">Display Scale (Clash Display)</p>
                     <h1 className="text-5xl font-display font-bold uppercase tracking-tighter">DISPLAY_TITULAR_55PX</h1>
                  </div>
                  <div className="border-b border-black/5 pb-8">
                     <p className="font-mono text-[9px] opacity-30 mb-4 uppercase font-bold">Sub-Display Scale (2XL)</p>
                     <h2 className="text-2xl font-display font-bold uppercase tracking-tight">SECUNDÁRIO_SUBTÍTULOS.v1</h2>
                  </div>
                  <div className="border-b border-black/5 pb-8">
                     <p className="font-mono text-[9px] opacity-30 mb-4 uppercase font-bold">Body Scale (Satoshi)</p>
                     <p className="font-body text-sm font-medium">Interfaces Inteligentes e Intuitivas. Substituindo a incerteza pelos fluxos desenhados para guiar o usuário em blocos de texto estrategicamente posicionados.</p>
                  </div>
                  <div className="border-b border-black/5 pb-8">
                     <p className="font-mono text-[9px] opacity-30 mb-4 uppercase font-bold">Mono Scale (Geist Mono)</p>
                     <span className="font-mono text-[10px] uppercase tracking-[0.4em] font-bold">MÉTRICAS_DE_SISTEMA_2026</span>
                  </div>
               </div>
            </section>

            {/* SECTION 03: MOLECULES - GLITCH */}
            <section>
               <div className="flex items-center gap-4 mb-12">
                  <span className="w-12 h-[1px] bg-black opacity-20" />
                  <h2 className="font-mono text-[11px] uppercase tracking-[0.4em] font-bold">03 // MOLECULES_GLITCH</h2>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                     <div 
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        className="w-full aspect-video border border-black/10 relative overflow-hidden bg-white"
                     >
                        <GlitchImage src="https://picsum.photos/seed/protocol/1200/800" isHovered={isHovered} />
                     </div>
                     <p className="font-mono text-[9px] opacity-50 uppercase font-bold text-center italic">Hover para disparar intervenção cromática (Red/Blue)</p>
                  </div>
                  <div className="space-y-6">
                     <h3 className="text-xl font-display font-bold uppercase tracking-tight">Glitch Logic Trace:</h3>
                     <ul className="space-y-4 font-mono text-[10px] opacity-60 leading-relaxed uppercase font-bold">
                        <li className="flex gap-4"><span>[0.4s]</span> <span>Red_Channel_Shift: Left (min: -8, max: -2)</span></li>
                        <li className="flex gap-4"><span>[0.5s]</span> <span>Blue_Channel_Shift: Right (min: 2, max: 10)</span></li>
                        <li className="flex gap-4"><span>[VAR]</span> <span>Displacement_Slices: 0.1s steps, linear clipping</span></li>
                        <li className="flex gap-4"><span>[100%]</span> <span>Noise_Mix: 15% Overlay SVGTurbulence</span></li>
                     </ul>
                  </div>
               </div>
            </section>

            {/* SECTION 04: ORGANISMS */}
            <section className="pb-32">
               <div className="flex items-center gap-4 mb-12">
                  <span className="w-12 h-[1px] bg-black opacity-20" />
                  <h2 className="font-mono text-[11px] uppercase tracking-[0.4em] font-bold">04 // ORGANISMS_SYSTEM</h2>
               </div>
               <div className="space-y-12">
                  <div className="border border-black/10 bg-white">
                     <ProjectRow 
                        step="01" 
                        title="Atomic Protocol" 
                        desc="Demonstração do organismo de linha de projeto com preview flutuante e zoom limpo." 
                        img="https://picsum.photos/seed/atomic/800/600"
                     />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-r border-black/5 bg-white">
                     <ExpCell id="PROT" entity="DESIGN_OPS" role="Atomic Dev" desc="Sistema de prototipagem funcional documentado em tempo real." />
                     <div className="col-span-2 p-12 flex items-center justify-center bg-black/5 opacity-30 italic font-mono text-[10px] font-bold">
                        EXP_CELL RESERVED AREA
                     </div>
                  </div>
               </div>
            </section>
         </main>

         <footer className="border-t border-black/10 py-12 flex flex-col md:flex-row justify-between items-center font-mono text-[9px] opacity-30 uppercase font-bold tracking-widest gap-4">
            <div>©2026 Protocolo de Estilo Digital</div>
            <div className="flex gap-8">
               <span>Status: Verificado</span>
               <span>Conformidade: Alta</span>
               <span>v26.2.STORYBOOK</span>
            </div>
         </footer>
      </div>
   );
}

function ColorAtom({ name, hex, token, isGlitch = false }: { name: string, hex: string, token: string, isGlitch?: boolean }) {
   return (
      <div className="space-y-4">
         <div 
            className={`w-full h-24 border border-black/10 ${isGlitch ? 'bg-gradient-to-r from-red-500/20 to-blue-500/20' : ''}`}
            style={{ backgroundColor: !isGlitch ? hex : undefined }}
         />
         <div className="space-y-1">
            <p className="font-display text-[12px] font-bold uppercase">{name}</p>
            <p className="font-mono text-[9px] opacity-40 uppercase font-bold">{hex}</p>
            <p className="font-mono text-[8px] opacity-30 font-bold">{token}</p>
         </div>
      </div>
   );
}
