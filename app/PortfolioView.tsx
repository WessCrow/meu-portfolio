"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import {
   MoveUpRight, Terminal, Command, Globe, Target,
   Plus, X, ArrowRight, Search, MousePointer2, Eye, Fingerprint, Activity, Pointer
} from "lucide-react";

/**
 * WESS PORTFOLIO — TRADITIONAL_LOG [VERSION_0.7.1]
 * Protocolo: Foco em Fidelidade Técnica e Clareza Estratégica
 * Status: Restaurado para a estrutura original de 0.7.1
 */

const charVariants = {
   hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
   visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { delay: i * 0.03, duration: 0.4 }
   })
};

const CLIENTS = [
   "Einstein Hospital Israelita",
   "Lenovo",
   "GYMPASS",
   "PSA Peugeot",
   "Claro",
   "Hershey's",
   "Hotels.com",
   "YOUCOM",
   "Grupo DPSP",
   "ACSC"
];

export function GlitchImage({ src, isHovered }: { src: string, isHovered: boolean }) {
   return (
      <div className="relative w-full h-full overflow-hidden bg-canvas">
         <img
            src={src}
            alt="Preview"
            className={`w-full h-full object-cover grayscale transition-all duration-700 ease-out ${isHovered ? 'scale-110 brightness-[1.1] grayscale-0' : 'scale-100 grayscale'}`}
         />
      </div>
   );
}

export function HUDCursor({ isHoveringClickable, cursorXSpring, cursorYSpring }: { isHoveringClickable: boolean, cursorXSpring: any, cursorYSpring: any }) {
   return (
      <div className="fixed inset-0 pointer-events-none z-[9999]">
         {/* AXIS LINES */}
         <motion.div style={{ y: cursorYSpring }} className="absolute left-0 w-full h-[1px] bg-muted opacity-50" />
         <motion.div style={{ x: cursorXSpring }} className="absolute top-0 h-full w-[1px] bg-muted opacity-50" />

         {/* TERMINAL SIGHT (+) */}
         <motion.div
            style={{ x: cursorXSpring, y: cursorYSpring }}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none"
         >
            <motion.div
               animate={{
                  scale: isHoveringClickable ? 1.5 : 1,
                  backgroundColor: isHoveringClickable ? "var(--color-text-primary)" : "rgba(0,0,0,0)"
               }}
               transition={{ duration: 0.2 }}
               className="relative w-6 h-6 rounded-full border border-ink flex items-center justify-center mix-blend-difference"
            >
               {/* INTERNAL RETICLE */}
               <div className={`absolute w-[40%] h-[1px] transition-colors duration-200 ${isHoveringClickable ? 'bg-canvas' : 'bg-ink'}`} />
               <div className={`absolute h-[40%] w-[1px] transition-colors duration-200 ${isHoveringClickable ? 'bg-canvas' : 'bg-ink'}`} />
            </motion.div>
         </motion.div>
      </div>
   );
}

export function ProjectRow({ step, title, desc, img, icon: Icon }: { step: string, title: string, desc: string, img: string, icon?: React.ElementType }) {
   const [isHovered, setIsHovered] = useState(false);

   return (
      <motion.div
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}
         whileHover={{ zIndex: 50, transition: { duration: 0 } }}
         className="grid grid-cols-1 md:grid-cols-12 border-b border-muted p-[var(--spacing-section)] items-center group cursor-pointer hover:bg-surface-sunken transition-colors relative"
      >
         <div className="col-span-12 md:col-span-3 flex items-center gap-[var(--spacing-4)]">
            <div className="flex items-center gap-2">
               {Icon && <Icon size={12} className="text-ink opacity-40 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />}
               <span className="font-mono text-[10px] opacity-40 uppercase tracking-[0.3em] font-bold">Case {step}</span>
            </div>
            <div className="w-8 h-[1px] bg-muted group-hover:w-[var(--spacing-12)] transition-all" />
         </div>
         <div className="col-span-12 md:col-span-5 relative">
            <h3 className="text-2xl font-display font-bold leading-none tracking-tighter uppercase transition-transform group-hover:translate-x-[var(--spacing-2)] duration-700 text-ink">
               {title}.
            </h3>

            <AnimatePresence>
               {isHovered && (
                  <motion.div
                     initial={{ opacity: 0, scale: 0.9, x: -20 }}
                     animate={{ opacity: 1, scale: 1, x: 0 }}
                     exit={{ opacity: 0, scale: 0.9, x: -20 }}
                     className="absolute right-32 top-1/2 -translate-y-1/2 w-48 h-64 z-50 pointer-events-none hidden lg:block"
                  >
                     <div className="w-full h-full border border-muted shadow-[0_30px_60px_rgba(0,0,0,0.1)] overflow-hidden bg-surface p-[var(--spacing-2)]">
                        <GlitchImage src={img} isHovered={isHovered} />
                     </div>
                     <div className="absolute -bottom-6 left-0">
                        <span className="font-mono text-[8px] opacity-40 uppercase tracking-widest bg-muted text-on-dark px-1 font-bold">Case_V26_ID_{step}</span>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
         <div className="col-span-12 md:col-span-4 flex flex-col gap-[var(--spacing-2)] relative z-10">
            <p className="font-body text-sm leading-relaxed text-ink-muted group-hover:text-ink transition-opacity font-medium">
               {desc}
            </p>
            <span className="font-mono text-[8px] opacity-40 group-hover:opacity-100 transition-opacity uppercase font-bold tracking-widest">Recon_Ativo</span>
         </div>
      </motion.div>
   );
}


export default function WessPortfolio() {
   const [isMounted, setIsMounted] = useState(false);
   const [isDarkMode, setIsDarkMode] = useState(false);
   const [isHoveringClickable, setIsHoveringClickable] = useState(false);
   const cursorX = useMotionValue(-100);
   const cursorY = useMotionValue(-100);

   useEffect(() => {
      // Theme initialization
      const savedTheme = localStorage.getItem("wess-theme");
      if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
         setIsDarkMode(true);
         document.documentElement.classList.add("dark");
      }
   }, []);

   const toggleTheme = () => {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      if (newTheme) {
         document.documentElement.classList.add("dark");
         localStorage.setItem("wess-theme", "dark");
      } else {
         document.documentElement.classList.remove("dark");
         localStorage.setItem("wess-theme", "light");
      }
   };

   const springConfig = { damping: 30, stiffness: 400 };
   const cursorXSpring = useSpring(cursorX, springConfig);
   const cursorYSpring = useSpring(cursorY, springConfig);

   useEffect(() => {
      setIsMounted(true);
      const moveCursor = (e: MouseEvent) => {
         cursorX.set(e.clientX);
         cursorY.set(e.clientY);
      };

      const handleMouseOver = (e: MouseEvent) => {
         const target = e.target as HTMLElement;
         if (!target) return;

         const isClickable = target.closest('button') ||
            target.closest('a') ||
            target.closest('[role="button"]') ||
            target.closest('.cursor-pointer') ||
            target.closest('.cursor-crosshair');

         setIsHoveringClickable(!!isClickable);
      };

      window.addEventListener("mousemove", moveCursor);
      window.addEventListener("mouseover", handleMouseOver);
      return () => {
         window.removeEventListener("mousemove", moveCursor);
         window.removeEventListener("mouseover", handleMouseOver);
      };
   }, []);



   if (!isMounted) return null;

   return (
      <div className="relative min-h-screen overflow-x-hidden selection:bg-black selection:text-white cursor-none transition-colors duration-1000">
         <HUDCursor isHoveringClickable={isHoveringClickable} cursorXSpring={cursorXSpring} cursorYSpring={cursorYSpring} />

         {/* HEADER PROTOCOL (0.7.1) */}
         <header className="fixed top-0 left-0 w-full z-[80] border-b border-muted bg-canvas/80 backdrop-blur-sm px-8 h-[53px] flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.2em] font-medium">
            <div className="flex items-center gap-6">
               <div className="w-[28px] h-[28px] bg-ink grayscale opacity-60 dark:opacity-100" style={{ maskImage: 'url(/logo_black.svg)', maskSize: 'contain' }} />
               <div className="flex items-center gap-2">
                  <span className="opacity-30 tracking-widest uppercase">Wess // PROJETANDO DESDE 2008</span>

               </div>
            </div>

            <div className="flex items-center gap-10">
               {(
                  [["cases", "PROJETOS"], ["experience", "EXPERIÊNCIA"], ["connect", "CONTATO"]] as const
               ).map(([anchor, label]) => (
                  <a key={anchor} href={`#${anchor}`} className="hover:line-through transition-all opacity-40 hover:opacity-100">{label}</a>
               ))}

               <div className="flex items-center gap-3 border-l border-muted pl-10">
                  <span className="opacity-20 uppercase text-[8px] font-medium">Modo_Escuro</span>
                  <button
                     onClick={toggleTheme}
                     className="w-8 h-4 bg-ink/10 relative rounded-full p-[2px] cursor-none hover:bg-ink/20 transition-colors"
                  >
                     <motion.div
                        animate={{ x: isDarkMode ? 16 : 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="w-3 h-3 bg-ink rounded-full"
                     />
                  </button>
               </div>
            </div>
         </header>

         <main className="pt-[53px] max-w-[1920px] mx-auto min-h-[calc(100vh-53px)]">

            {/* HERO BLOCK (EDITORIAL PORTRAIT ARCHITECTURE) — v0.9.0.GLITCH */}
            <section 
               className="grid grid-cols-1 md:grid-cols-12 min-h-[75vh] border-b border-muted overflow-hidden relative"
               style={{ backgroundColor: isDarkMode ? '#222222' : 'var(--color-canvas)' }}
            >

               {/* LEFT SIDEBAR: VERTICAL IDENTITY & METADATA */}
               <div 
                  className="md:col-span-3 flex flex-col justify-between p-[var(--spacing-section)] relative z-20"
                  style={{ backgroundColor: isDarkMode ? '#222222' : 'var(--color-canvas)' }}
               >
                  <div className="space-y-12">
                     <div className="flex items-center gap-4">
                        <span className="w-8 h-[1px] bg-muted" />
                        <span className="font-mono text-[9px] uppercase tracking-[0.4em] opacity-30 italic"> 2026 // 27 </span>
                     </div>
                     <ScrollReveal delay={0.1} className="rotate-0 md:rotate-0 flex flex-col gap-1 translate-x-0">
                        <h1 className="text-5xl font-display leading-[1.1] tracking-tighter uppercase font-bold text-ink [writing-mode:vertical-rl] md:[writing-mode:vertical-rl] rotate-180 self-start">
                           PROJETANDO <br /> EXPERIÊNCIAS
                        </h1>
                     </ScrollReveal>
                  </div>
                  <ScrollReveal delay={0.3} className="space-y-4">
                     <p className="font-mono text-[10px] uppercase tracking-[0.4em] opacity-40 leading-relaxed max-w-[20ch] font-bold">
                        ESTRATÉGIA POTENCIALIZADA POR IA PARA SIMPLIFICAR O COMPLEXO.
                     </p>
                  </ScrollReveal>
               </div>

               {/* MAIN FOCAL AREA: IMAGE & HUD OVERLAYS (v2.0 - CLEAN MINIMALISM) */}
               <div 
                  className="md:col-span-9 relative overflow-hidden group"
                  style={{ backgroundColor: isDarkMode ? '#222222' : '#EEEEEE' }}
               >
                  <motion.div
                     initial={{ opacity: 0, scale: 1.1 }}
                     animate={{ opacity: 1, scale: 1.05 }}
                     whileHover={{ scale: 1.08 }}
                     transition={{ duration: 1.5, ease: "easeOut" }}
                     className="w-full h-full relative"
                  >
                     <img
                        src="/wess.png"
                        alt="Wess"
                        className="w-full h-full object-cover grayscale object-[center_5%] brightness-[1.1] contrast-110 opacity-100 group-hover:grayscale-0 transition-all duration-1000"
                     />
                  </motion.div>

                  {/* STATIC UI GRID */}
                  <div className="absolute inset-0 z-50 pointer-events-none opacity-5 bg-[radial-gradient(circle,rgba(0,0,0,0.2)_1px,transparent_1px)] bg-[size:24px_24px]" />

                  {/* HUD OVERLAYS (CLEAN VERSION) */}
                  <div className="absolute inset-0 z-10 p-[var(--spacing-section)] flex flex-col justify-between pointer-events-none">
                     <div className="flex justify-end items-start">
                        <div className="flex items-center gap-4 p-4 border border-muted bg-canvas/40 backdrop-blur-md pointer-events-auto cursor-pointer hover:bg-canvas transition-all">
                           <Target size={12} className="text-ink opacity-60" />
                           <span className="font-mono text-[9px] uppercase tracking-widest font-bold">Protocolo_Ativo</span>
                           <div className="w-2 h-2 bg-[#00FF41] shadow-[0_0_8px_#00FF41] animate-pulse" />
                        </div>
                     </div>

                     <div className="flex justify-between items-end">
                        <div className="space-y-6 pointer-events-auto">
                           <div className="flex flex-col items-start gap-1">
                              <span className="bg-black text-white text-[clamp(1.5rem,4vw,2.5rem)] font-display italic font-black uppercase px-4 py-2 leading-[1.1] inline-block">
                                 TRANSFORMO PROCESSOS
                              </span>
                              <span className="bg-black text-white text-[clamp(1.5rem,4vw,2.5rem)] font-display italic font-black uppercase px-4 py-2 leading-[1.1] inline-block">
                                 COMPLEXOS EM INTERFACES
                              </span>
                              <span className="bg-black text-white text-[clamp(1.5rem,4vw,2.5rem)] font-display italic font-black uppercase px-4 py-2 leading-[1.1] inline-block">
                                 FLUIDAS E FÁCEIS DE USAR.
                              </span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* SCANLINE EFFECT */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/[0.02] to-transparent h-[20%] w-full animate-scan pointer-events-none z-20" />
               </div>

               <style jsx>{`
                  @keyframes scan { 0% { top: -20%; } 100% { top: 100%; } }
                  .animate-scan { animation: scan 8s linear infinite; }
               `}</style>
            </section>

            {/* TELEMETRY MATRIX (002) */}
            <section className="grid grid-cols-1 md:grid-cols-12 border-b border-muted bg-canvas divide-x divide-muted">
               <div className="md:col-span-3 p-[var(--spacing-section)] flex items-center justify-center font-mono text-[10px] uppercase opacity-20 tracking-widest text-ink font-bold gap-3">
                  <Activity size={12} />
                  Protocolos_Ativos.v26
               </div>
               <div className="md:col-span-3 p-[var(--spacing-section)] flex flex-col gap-2 group hover:bg-surface-sunken transition-colors">
                  <div className="flex justify-between items-start">
                     <span className="font-mono text-[8px] opacity-30 uppercase tracking-[0.4em] font-bold">IAUX_LOG</span>
                     <Terminal size={12} className="opacity-10 group-hover:opacity-40" />
                  </div>
                  <span className="font-mono text-[11px] font-bold uppercase tracking-tighter ">SÊNIOR_ESTRATÉGICO</span>
               </div>
               <div className="md:col-span-3 p-[var(--spacing-section)] flex flex-col gap-2 group hover:bg-surface-sunken transition-colors">
                  <div className="flex justify-between items-start">
                     <span className="font-mono text-[8px] opacity-30 uppercase tracking-[0.4em] font-bold">VISUAL_LOG</span>
                     <Eye size={12} className="opacity-10 group-hover:opacity-40" />
                  </div>
                  <span className="font-mono text-[11px] font-bold uppercase tracking-tighter">ESPECIALISTA</span>
               </div>
               <div className="md:col-span-3 p-[var(--spacing-section)] flex flex-col gap-2 group hover:bg-surface-sunken transition-colors">
                  <div className="flex justify-between items-start">
                     <span className="font-mono text-[8px] opacity-30 uppercase tracking-[0.4em] font-bold">GESTÃO_LOG</span>
                     <Fingerprint size={12} className="opacity-10 group-hover:opacity-40" />
                  </div>
                  <span className="font-mono text-[11px] font-bold uppercase tracking-tighter">LED_NATURAL</span>
               </div>
            </section>

            {/* AREA_CASES: VERTICAL STRATEGIC SEQUENCE — TYPOGRAPHIC ALIGNMENT v1.5.0 */}
            <section id="cases" className="col-span-12 flex flex-col text-ink bg-canvas relative">
               <div className="grid grid-cols-1 md:grid-cols-12 border-b border-muted bg-secondary/30">
                  <div className="md:col-span-3 p-[var(--spacing-section)] border-r border-muted flex items-center">
                     <ScrollReveal>
                        <span className="font-mono text-[9px] opacity-30 uppercase tracking-[0.4em] italic font-bold">002 // AREA_CASES</span>
                     </ScrollReveal>
                  </div>
                  <div className="md:col-span-9 p-[var(--spacing-section)]">
                     <ScrollReveal delay={0.1}>
                        <h2 className="text-4xl font-display leading-[0.8] tracking-tighter uppercase font-bold">LOG_DE_ENTREGAS</h2>
                     </ScrollReveal>
                  </div>
               </div>
               <div className="flex flex-col">
                  <ProjectRow
                     step="01"
                     title="Neon Core"
                     desc="Sistema de orquestração autônoma para infraestruturas críticas operando com latência zero e clareza radical."
                     img="https://picsum.photos/seed/neon/800/600"
                     icon={Plus}
                  />
                  <ProjectRow
                     step="02"
                     title="Quantum UI"
                     desc="Design System orientado a intenção e acessibilidade cognitiva em escala corporativa."
                     img="https://picsum.photos/seed/quantum/800/600"
                     icon={Target}
                  />
                  <ProjectRow
                     step="03"
                     title="Agent Flow"
                     desc="Mapeamento de jornada para assistentes inteligentes contextuais focados em confiança agêntica."
                     img="https://picsum.photos/seed/agent/800/600"
                     icon={Fingerprint}
                  />
                  <ProjectRow
                     step="04"
                     title="Einstein"
                     desc="Consultoria de inovação para interfaces críticas onde a precisão diagnóstica é requisito funcional."
                     img="https://picsum.photos/seed/hosp/800/600"
                     icon={Eye}
                  />
               </div>
            </section>

            {/* STRATEGIC PARTNERS (MARQUEE) — v0.9.12 */}
            <section className="col-span-12 border-b border-muted py-12 bg-canvas overflow-hidden whitespace-nowrap group">
               <div className="flex gap-24 animate-marquee items-center translate-z-0">
                  {[...CLIENTS, ...CLIENTS, ...CLIENTS].map((client, i) => (
                     <motion.span
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        className="font-display text-lg md:text-2xl opacity-20 hover:opacity-100 transition-all tracking-tighter uppercase font-bold hover:line-through"
                     >
                        {client}
                     </motion.span>
                  ))}
               </div>
            </section>

            {/* IDENTITY BLOCK (003 // SOLICITE) — UNIFIED PATTERN v1.7.0 */}
            <section id="experience" className="col-span-12 flex flex-col text-ink bg-canvas relative">
               {/* SECTION HEADER — MATCHING 002 PATTERN */}
               <div className="grid grid-cols-1 md:grid-cols-12 border-b border-muted bg-secondary/30">
                  <div className="md:col-span-3 p-[var(--spacing-section)] border-r border-muted flex items-center">
                     <ScrollReveal>
                        <span className="font-mono text-[9px] opacity-20 uppercase tracking-[0.4em] italic font-bold text-ink">003 // AREA_EXPERIENCIA</span>
                     </ScrollReveal>
                  </div>
                  <div className="md:col-span-9 p-[var(--spacing-section)]">
                     <ScrollReveal delay={0.1}>
                        <h2 className="text-4xl font-display leading-[0.8] tracking-tighter uppercase font-bold text-ink">LOG_DE_SOLUÇÕES</h2>
                     </ScrollReveal>
                  </div>
               </div>

               {/* SECTION CONTENT — EXPANDED TO FULL WIDTH */}
               <div className="grid grid-cols-1 md:grid-cols-12">
                  <div className="col-span-12 p-[var(--spacing-section)] md:p-32 flex flex-col items-start justify-center bg-secondary relative overflow-hidden group min-h-[60vh]">
                     <ScrollReveal>
                        <h2 className="text-[50px] font-display font-bold leading-[1.1] tracking-tighter uppercase text-ink max-w-[20ch] md:max-w-none text-left relative z-10 transition-transform duration-1000 group-hover:translate-x-4">
                           Interfaces <br />
                           Inteligentes e Intuitivas. <br />
                           Substituindo a incerteza <br />
                           por fluxos desenhados <br />
                           para guiar o usuário <br />
                           com total clareza
                        </h2>
                     </ScrollReveal>
                     {/* Subtle Scanline for consistency */}
                     <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/[0.01] to-transparent h-[100%] w-full animate-scan pointer-events-none opacity-50" />
                  </div>
               </div>
            </section>


            {/* EXPERIENCE_LOG — TYPOGRAPHIC ALIGNMENT v1.5.0 */}
            <section className="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-b border-muted min-h-[400px] text-ink divide-y md:divide-y-0 md:divide-x divide-muted">
               <ScrollReveal delay={0.1}><ExpCell id="01" entity="COMPASSO UOL" role="Líder de Produto" desc="Liderança estratégica para Frigelar e DPSP. Protocolos analíticos." icon={Terminal} /></ScrollReveal>
               <ScrollReveal delay={0.2}><ExpCell id="02" entity="EINSTEIN" role="Inovação" desc="Consultoria de Inovação em saúde. Interfaces de alta resolução." icon={Search} /></ScrollReveal>
               <ScrollReveal delay={0.3}><ExpCell id="03" entity="BRADESCO" role="Estrategista UX" desc="Escalabilidade em ecossistemas bancários de alta volumetria." icon={Activity} /></ScrollReveal>
               <ScrollReveal delay={0.4}><ExpCell id="04" entity="LENOVO" role="Estratégia UX" desc="Design de experiência e inovação para hardware e serviços globais." icon={Pointer} /></ScrollReveal>
            </section>


            {/* CONNECT_FOOTER: DIRECT CTA ARCHITECTURE — v1.3.0 */}
            <footer id="connect" className="col-span-12 border-t border-muted bg-secondary text-ink">
               {/* MIDDLE SECTION: CALL TO ACTION — v1.2.2 */}
               <div className="p-[var(--spacing-section)] md:p-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
                  <div className="flex flex-col gap-8 flex-1">
                     <ScrollReveal>
                        <h2 className="text-cta-footer font-display font-bold leading-[1.1] tracking-tighter uppercase max-w-[40ch]">
                           Vamos conversar <br />
                           sobre um projeto, <br />
                           colaboração ou uma <br />
                           ideia que você tenha?
                        </h2>
                     </ScrollReveal>
                  </div>
                  <ScrollReveal delay={0.2}>
                     <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex gap-4 p-6 border border-muted bg-canvas/60 backdrop-blur-md cursor-pointer hover:bg-canvas transition-all shadow-sm group"
                     >
                        <span className="font-mono text-[11px] uppercase tracking-[0.4em] font-bold">Enviar_Mensagem</span>
                        <div className="w-3 h-3 bg-muted group-hover:bg-ink transition-colors" />
                     </motion.button>
                  </ScrollReveal>
               </div>

               {/* BOTTOM SUB-FOOTER: METADATA & LINKS */}
               <div className="grid grid-cols-1 md:grid-cols-12 p-8 md:p-12 border-t border-muted text-[10px] font-mono tracking-widest opacity-40 uppercase">
                  <div className="md:col-span-4">
                     ©2026 Todos os Direitos Reservados. Design & Codificação feito com emoção.
                  </div>
                  <div className="md:col-span-6 flex gap-8 justify-center">
                     {[
                        { label: "LinkedIn", href: "#" },
                        { label: "Email", href: "mailto:contato@wess.design" },
                        { label: "O que faço quando não trabalho", href: "#" },
                        { label: "DS_SYSTEM.V2", href: "/design-system" }
                     ].map(link => (
                        <a key={link.label} href={link.href} className="hover:text-ink hover:line-through transition-all cursor-none">{link.label}</a>
                     ))}
                  </div>
                  <div className="md:col-span-2 text-right">
                     <a href="#" className="hover:text-ink hover:translate-y-[-2px] inline-block transition-all">Voltar ao topo ↑</a>
                  </div>
               </div>
            </footer>
         </main>
      </div>
   );
}

function TypewriterText({ text, className }: { text: string, className?: string }) {
   return (
      <h1 className={className}>
         {text.split("").map((char, i) => (
            <motion.span key={i} custom={i} variants={charVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="inline-block text-ink">
               {char === " " ? "\u00A0" : char}
            </motion.span>
         ))}
      </h1>
   );
}

function StatusItem({ label, value }: { label: string, value: string }) {
   return (
      <div className="flex justify-between items-center border-b border-muted pb-2">
         <span className="font-mono text-[9px] opacity-30 tracking-widest uppercase">{label}</span>
         <span className="font-mono text-[9px] font-bold tracking-tighter uppercase">{value}</span>
      </div>
   );
}

export function ExpCell({ id, entity, role, desc, icon: Icon }: { id: string, entity: string, role: string, desc: string, icon?: React.ElementType }) {
   return (
      <div className="p-[var(--spacing-section)] border-t border-muted group hover:bg-canvas transition-colors flex flex-col h-full bg-surface-sunken/50 dark:bg-transparent">
         <div className="flex justify-between items-start mb-8">
            <span className="font-mono text-[9px] opacity-20 tracking-[0.4em] uppercase font-bold">{id} // LOG_EXP</span>
            {Icon && <Icon size={14} className="text-ink opacity-20 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />}
         </div>
         <div className="mt-auto space-y-4">
            <h4 className="font-mono text-[10px] uppercase opacity-40 tracking-[0.3em] group-hover:opacity-100 transition-opacity uppercase font-bold">{entity}</h4>
            <h3 className="text-2xl font-display group-hover:translate-x-1 transition-transform tracking-tight uppercase font-bold text-ink">
               {role}
            </h3>
            <p className="font-body text-xs text-ink-muted leading-relaxed transition-colors tracking-tight font-medium">
               "{desc}"
            </p>
         </div>
      </div>
   )
}

export function ScrollReveal({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) {
   return (
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true, margin: "-100px" }}
         transition={{ duration: 0.8, delay, ease: [0.215, 0.61, 0.355, 1] }}
         className={className}
      >
         {children}
      </motion.div>
   );
}

export function ProjectTile({ id, tag, title, img, details }: { id: string, tag: string, title: string, img: string, details: string }) {
   const [isHovered, setIsHovered] = useState(false);

   return (
      <motion.div
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}
         className="border-b border-muted group cursor-none relative overflow-hidden h-[500px] flex flex-col hover:bg-surface-sunken transition-all duration-500"
      >
         <div className="p-[var(--spacing-section)] flex justify-between items-start font-mono text-[9px] relative z-10 transition-opacity duration-500" style={{ opacity: isHovered ? 0.2 : 0.8 }}>
            <span className="opacity-40 tracking-widest uppercase font-bold">{id} // SCAN_DE_PROJETO</span>
            <span className="opacity-40 tracking-[0.2em] uppercase font-bold">{tag}</span>
         </div>
         <div className="flex-1 flex flex-col justify-end p-[var(--spacing-section)] relative z-10" style={{ opacity: isHovered ? 0.2 : 1 }}>
            <h3 className="text-5xl font-display leading-[0.8] mb-4 group-hover:translate-x-2 transition-transform duration-700 tracking-tighter uppercase font-bold text-ink">{title}</h3>
            <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} className="h-[1px] bg-muted origin-left" />
         </div>
         <div className="absolute inset-0 z-0 opacity-5 group-hover:opacity-15 transition-all duration-1000">
            <motion.img animate={{ scale: isHovered ? 1.05 : 1 }} src={img} className="w-full h-full object-cover grayscale blur-[1px] group-hover:blur-none" />
         </div>
         <AnimatePresence>
            {isHovered && (
               <motion.div
                  initial={{ opacity: 0, scale: 0.98, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.02, y: -5 }}
                  className="absolute inset-x-8 top-12 bottom-12 z-40 bg-surface/95 backdrop-blur-xl border border-muted p-[var(--spacing-section)] shadow-[0_45px_120px_rgba(0,0,0,0.15)] flex flex-col"
               >
                  <div className="flex justify-between items-start mb-8 text-ink">
                     <div className="space-y-1">
                        <h4 className="text-4xl font-display leading-[0.9] tracking-tighter uppercase font-bold">{title}</h4>
                        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-muted italic uppercase">{tag} // PROTOCOLO</p>
                     </div>
                     <div className="w-12 h-12 border border-muted flex items-center justify-center group-hover:border-ink transition-colors">
                        <MoveUpRight strokeWidth={1} size={20} className="text-ink" />
                     </div>
                  </div>
                  <div className="flex-1 mb-[var(--spacing-8)] overflow-hidden border border-muted bg-canvas">
                     <GlitchImage src={img} isHovered={true} />
                  </div>
                  <p className="font-body text-sm leading-relaxed text-ink/70 font-medium">"{details}"</p>
                  <div className="grid grid-cols-2 gap-[var(--spacing-4)] pb-[var(--spacing-4)] border-t border-muted pt-[var(--spacing-8)] text-[9px] font-mono tracking-widest uppercase opacity-40 mt-auto font-bold">
                     <div className="flex flex-col gap-[var(--spacing-2)]"><span>ID_SISTEMA: {id}</span><span>CAMADA_SCAN: ALTA</span></div>
                     <div className="text-right flex flex-col gap-[var(--spacing-2)]"><span>LINHA_012</span><span>STATUS: VERIFICADO</span></div>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </motion.div>
   );
}
