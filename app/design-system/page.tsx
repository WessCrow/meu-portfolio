"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { 
   MoveUpRight, Laptop, Moon, Sun, Layout, Type, Box, Grid3X3, 
   Plus, X, ArrowRight, Search, Terminal, Command, 
   MousePointer2, Eye, Target, Fingerprint, Activity, Pointer
} from "lucide-react";
import { ProjectRow } from "../../components/ui/ProjectRow";
import { ExpCell } from "../../components/ui/ExpCell";
import { ProjectTile } from "../../components/ui/ProjectTile";
import { HUDCursor } from "../../components/ui/HUDCursor";
import { withPrefix } from "../utils/paths";

export default function DesignSystemPage() {
   const [mounted, setMounted] = useState(false);
   const [theme, setTheme] = useState<"light" | "dark">("light");
   const [isHoveringClickable, setIsHoveringClickable] = useState(false);

   const cursorX = useMotionValue(-100);
   const cursorY = useMotionValue(-100);
   const springConfig = { damping: 30, stiffness: 400 };
   const cursorXSpring = useSpring(cursorX, springConfig);
   const cursorYSpring = useSpring(cursorY, springConfig);

   useEffect(() => {
      setMounted(true);
      const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
      if (savedTheme) {
         setTheme(savedTheme);
         document.documentElement.classList.toggle("dark", savedTheme === "dark");
      }

      const moveCursor = (e: MouseEvent) => {
         cursorX.set(e.clientX);
         cursorY.set(e.clientY);
      };

      const handleMouseOver = (e: MouseEvent) => {
         const target = e.target as HTMLElement;
         if (!target) return;
         const isClickable = target.closest("button") ||
            target.closest("a") ||
            target.closest("[role=\"button\"]") ||
            target.closest(".cursor-pointer") ||
            target.closest(".cursor-none");

         setIsHoveringClickable(!!isClickable);
      };

      window.addEventListener("mousemove", moveCursor);
      window.addEventListener("mouseover", handleMouseOver);
      return () => {
         window.removeEventListener("mousemove", moveCursor);
         window.removeEventListener("mouseover", handleMouseOver);
      };
   }, []);

   const toggleTheme = () => {
      const newTheme = theme === "light" ? "dark" : "light";
      setTheme(newTheme);
      localStorage.setItem("theme", newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
   };

   if (!mounted) return null;

   return (
      <div className="min-h-screen bg-canvas text-ink transition-colors duration-500 font-body cursor-none selection:bg-ink selection:text-canvas overflow-x-hidden">
         <HUDCursor isHoveringClickable={isHoveringClickable} cursorXSpring={cursorXSpring} cursorYSpring={cursorYSpring} isDarkBackground={true} />

         {/* DS HEADER */}
         <header className="fixed top-0 inset-x-0 h-16 border-b border-muted bg-surface/80 backdrop-blur-md z-[100] px-8 flex justify-between items-center">
            <div className="flex items-center gap-4">
               <div className="w-8 h-8 bg-ink text-canvas flex items-center justify-center font-bold text-xl">W</div>
               <div className="h-4 w-[1px] bg-muted" />
               <span className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold">DS_SYSTEM // V2.0.7</span>
            </div>
            
            <nav className="flex items-center gap-8">
               <button onClick={toggleTheme} className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest hover:opacity-100 opacity-60 transition-opacity">
                  {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
                  MODO_{theme === "light" ? "ESCURO" : "CLARO"}
               </button>
               <a href={withPrefix("/")} className="font-mono text-[10px] uppercase tracking-widest hover:line-through transition-all">VOLTAR_AO_PORTFOLIO</a>
            </nav>
         </header>

         <main className="pt-32 pb-64 max-w-7xl mx-auto px-8 space-y-32">
            {/* HERO */}
            <section className="space-y-6">
               <h1 className="text-[120px] font-display font-bold leading-[0.8] tracking-tighter uppercase text-ink">
                  Protocolo<br />Visual.
               </h1>
               <p className="max-w-xl text-lg text-ink-muted leading-relaxed font-medium">
                  Documentação viva da arquitetura de design do Wess Portfolio. Baseada em tokens semânticos de 3 camadas e grade de precisão 8pt.
               </p>
            </section>

            {/* 1. TOKENS */}
            <section id="tokens" className="space-y-12">
               <div className="flex items-center gap-4 border-b border-muted pb-4">
                  <Grid3X3 size={20} className="text-ink" strokeWidth={1.5} />
                  <h2 className="font-mono text-[12px] uppercase tracking-[0.4em] font-bold">01 // ARQUITETURA.DE.TOKENS</h2>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <TokenGroup title="Surface & Backgrounds">
                     <TokenSwatch label="Canvas" variable="--color-canvas" hex="Page Background" />
                     <TokenSwatch label="Surface" variable="--color-surface" hex="Component Core" />
                     <TokenSwatch label="Sunken" variable="--color-surface-sunken" hex="Nested Contexts" />
                  </TokenGroup>

                  <TokenGroup title="Typography Roles">
                     <TokenSwatch label="Primary" variable="--color-text-primary" hex="Main Content" isText />
                     <TokenSwatch label="Secondary" variable="--color-text-secondary" hex="Supporting Data" isText />
                     <TokenSwatch label="Muted" variable="--color-text-muted" hex="Telemetry" isText />
                  </TokenGroup>

                  <TokenGroup title="Borders & Accents">
                     <TokenSwatch label="Border Default" variable="--color-border-default" hex="Grid & Strokes" />
                     <TokenSwatch label="Border Accent" variable="--color-border-accent" hex="Active Indicators" />
                     <TokenSwatch label="Innovation" variable="--accent-innovation" hex="#000000" />
                  </TokenGroup>
               </div>
            </section>

            {/* 2. SPACING */}
            <section id="spacing" className="space-y-12">
               <div className="flex items-center gap-4 border-b border-muted pb-4">
                  <Layout size={20} className="text-ink" strokeWidth={1.5} />
                  <h2 className="font-mono text-[12px] uppercase tracking-[0.4em] font-bold">02 // GRADE.DE.PRECISAO</h2>
               </div>

               <div className="grid grid-cols-1 gap-4 bg-surface-sunken/40 p-8 border border-muted">
                  {[1, 2, 4, 6, 8, 12].map(s => (
                     <div key={s} className="flex items-center gap-8">
                        <div className="w-16 font-mono text-[10px] opacity-40">STEP_{s}</div>
                        <div className={`h-8 bg-ink`} style={{ width: `var(--spacing-${s})` }} />
                        <span className="font-mono text-[10px] opacity-40">({s * 4}px)</span>
                     </div>
                  ))}
               </div>
            </section>

            {/* 4. ICONS */}
            <section id="icons" className="space-y-12">
               <div className="flex items-center gap-4 border-b border-muted pb-4">
                  <Target size={20} className="text-ink" strokeWidth={1.5} />
                  <h2 className="font-mono text-[12px] uppercase tracking-[0.4em] font-bold">04 // SISTEMA.DE.ICONES</h2>
               </div>

               <div className="space-y-16">
                  <div className="space-y-8">
                     <h3 className="font-mono text-[10px] uppercase opacity-40 tracking-widest pl-4 border-l border-muted">AÇÕES_E_COMANDOS</h3>
                     <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-px bg-muted border border-muted">
                        <IconBox icon={<Plus size={18} />} label="ADICIONAR" tag="plus" />
                        <IconBox icon={<X size={18} />} label="FECHAR" tag="x" />
                        <IconBox icon={<ArrowRight size={18} />} label="SEGUIR" tag="arrow-right" />
                        <IconBox icon={<Search size={18} />} label="PESQUISAR" tag="search" />
                        <IconBox icon={<Terminal size={18} />} label="CONSOLE" tag="terminal" />
                        <IconBox icon={<Command size={18} />} label="METODO" tag="command" />
                     </div>
                  </div>

                  <div className="space-y-8">
                     <h3 className="font-mono text-[10px] uppercase opacity-40 tracking-widest pl-4 border-l border-muted">INTERAÇÃO_E_ESTADO</h3>
                     <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-px bg-muted border border-muted">
                        <IconBox icon={<MousePointer2 size={18} />} label="CURSOR" tag="mouse-pointer" />
                        <IconBox icon={<Eye size={18} />} label="VISÃO" tag="eye" />
                        <IconBox icon={<Target size={18} />} label="ALVO" tag="target" />
                        <IconBox icon={<Fingerprint size={18} />} label="IDENTITY" tag="fingerprint" />
                        <IconBox icon={<Activity size={18} />} label="PULSO" tag="activity" />
                        <IconBox icon={<Pointer size={18} />} label="INDICAR" tag="pointer" />
                     </div>
                  </div>
               </div>
            </section>

            {/* 5. COMPONENTS */}
            <section id="components" className="space-y-12">
               <div className="flex items-center gap-4 border-b border-muted pb-4">
                  <Box size={20} className="text-ink" strokeWidth={1.5} />
                  <h2 className="font-mono text-[12px] uppercase tracking-[0.4em] font-bold">05 // BIBLIOTECA.DE.COMPONENTES</h2>
               </div>

               <div className="space-y-24">
                  {/* PROJECT ROW */}
                  <div className="space-y-8">
                     <h4 className="font-mono text-[10px] uppercase opacity-40 tracking-widest pl-4 border-l border-muted">PROJETO_LINHA // ATIVO</h4>
                     <ProjectRow step="01" title="Protocolo Design" desc="Visualização de rastro de dados e hierarquia sistêmica. Otimizado para alta performance cognitiva." img="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80" />
                  </div>

                  {/* PROJECT TILE */}
                  <div className="space-y-8">
                     <h4 className="font-mono text-[10px] uppercase opacity-40 tracking-widest pl-4 border-l border-muted">PROJETO_CARD // ATIVO</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 border border-muted">
                        <ProjectTile id="001" tag="UX_STRE_01" title="Quantum Unit" details="Arquitetura de interfaces agênticas e modelos de confiança." img="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80" />
                        <ProjectTile id="002" tag="RECON_02" title="Nexus Core" details="Sistemas distribuídos e visualização de entropia de rede." img="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80" />
                     </div>
                  </div>

                  {/* EXP CELL */}
                  <div className="space-y-8">
                     <h4 className="font-mono text-[10px] uppercase opacity-40 tracking-widest pl-4 border-l border-muted">CELULA_EXPERIENCIA // ATIVO</h4>
                     <div className="grid grid-cols-1 md:grid-cols-3 border-x border-muted">
                        <ExpCell id="01" entity="Apple Inc" role="Senior Designer" desc="Liderança criativa em sistemas operacionais." />
                        <ExpCell id="02" entity="Google" role="UI Consultant" desc="Otimização de fluxos de IA generativa." />
                        <ExpCell id="03" entity="SpaceX" role="HUD Strategist" desc="Design de interfaces de telemetria orbital." />
                     </div>
                  </div>
               </div>
            </section>
         </main>

         {/* DS FOOTER */}
         <footer className="h-64 border-t border-muted bg-surface/40 flex items-center justify-center">
            <div className="text-center space-y-4">
               <div className="w-12 h-12 bg-ink text-canvas flex items-center justify-center font-bold text-2xl mx-auto mb-8">W</div>
               <p className="font-mono text-xs opacity-40 uppercase tracking-widest">Wess Prototype System v2.0.7</p>
               <p className="font-mono text-[10px] opacity-40 uppercase tracking-[0.3em]">End of Transmission</p>
            </div>
         </footer>
      </div>
   );
}

function TokenGroup({ title, children }: { title: string, children: React.ReactNode }) {
   return (
      <div className="border border-muted p-8 space-y-8 bg-surface">
         <h3 className="font-mono text-[10px] uppercase opacity-40 tracking-widest pb-4 border-b border-muted">{title}</h3>
         <div className="space-y-4">
            {children}
         </div>
      </div>
   )
}

function TokenSwatch({ label, variable, hex, isText = false }: { label: string, variable: string, hex: string, isText?: boolean }) {
   return (
      <div className="flex items-center gap-4">
         <div 
            className={`w-12 h-12 border border-muted shadow-inner ${isText ? 'flex items-center justify-center font-bold text-xl' : ''}`} 
            style={{ 
               backgroundColor: isText ? 'transparent' : `var(${variable})`,
               color: isText ? `var(${variable})` : 'transparent'
            }}
         >
            {isText ? 'Aa' : ''}
         </div>
         <div>
            <div className="font-mono text-[10px] uppercase font-bold tracking-tight">{label}</div>
            <div className="font-mono text-[8px] opacity-40 uppercase tracking-widest">{variable}</div>
            <div className="font-mono text-[8px] opacity-40 italic">{hex}</div>
         </div>
      </div>
   )
}

function IconBox({ icon, label, tag }: { icon: React.ReactNode, label: string, tag: string }) {
   return (
      <div className="group bg-surface hover:bg-surface-sunken p-8 flex flex-col items-center justify-center gap-6 transition-all relative overflow-hidden">
         {/* BACKGROUND DECOR */}
         <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-muted opacity-20 pointer-events-none" />
         
         <div className="text-ink-muted group-hover:text-ink transition-colors group-hover:scale-110 duration-500">
            {icon}
         </div>
         
         <div className="text-center space-y-1">
            <div className="font-mono text-[10px] uppercase font-bold tracking-tight opacity-40 group-hover:opacity-100 transition-opacity">{label}</div>
            <div className="font-mono text-[7px] opacity-20 uppercase tracking-widest">{tag}</div>
         </div>
      </div>
   )
}
