"use client";

import React, { useEffect, useState, useRef } from "react";
import { useMotionValue, useSpring, AnimatePresence, motion } from "framer-motion";
import {
  Target,
  Activity,
  Terminal,
  Search,
  Pointer,
  Eye,
  Fingerprint,
  Plus
} from 'lucide-react';

// UI Primitives
import { AnimatedText } from "../components/ui/AnimatedText";
import { ShuffleText } from "../components/ui/ShuffleText";
import { ScrollReveal } from "../components/ui/ScrollReveal";
import { HUDCursor } from "../components/ui/HUDCursor";
import { LiquidLoader } from "../components/ui/LiquidLoader";
import { ExpCell } from "../components/ui/ExpCell";
import { ProjectRow } from "../components/ui/ProjectRow";
import {
  FrameworkCard,
  IconDescoberta,
  IconDefinicao,
  IconDesenvolvimento,
  IconEntrega
} from "../components/ui/FrameworkCard";

// Features
import { TronHero } from "../components/features/TronHero";
import CaseStudyView from "../components/features/CaseStudyView";
import ProposalBuilder from "../components/features/ProposalBuilder";

// Utils
import { withPrefix } from "./utils/paths";

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

export default function WessPortfolio() {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCase, setActiveCase] = useState<string | null>(null);
  const [isCursorOnDark, setIsCursorOnDark] = useState(true);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // FORCE DARK MODE BY DEFAULT - CLEAR PREVIOUS SESSION STATE
    setIsDarkMode(true);
    document.documentElement.classList.add("dark");
    localStorage.setItem("wess-theme", "dark");
  }, []);

  // Handle Case Study Theme Isolation
  useEffect(() => {
    if (activeCase) {
      // Force light mode on document level ONLY for Case Studies
      document.documentElement.classList.remove("dark");
    } else {
      // Landing page is ALWAYS dark by standard
      document.documentElement.classList.add("dark");
    }
  }, [activeCase]);

  const springConfig = { damping: 30, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    setIsMounted(true);
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      // Detect background luminance under cursor to auto-switch color
      const els = document.elementsFromPoint(e.clientX, e.clientY);
      for (const el of els) {
        if ((el as HTMLElement).id === 'hud-cursor') continue;
        const bg = window.getComputedStyle(el as HTMLElement).backgroundColor;
        if (!bg || bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') continue;
        const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (m) {
          const lum = (0.299 * +m[1] + 0.587 * +m[2] + 0.114 * +m[3]) / 255;
          setIsCursorOnDark(lum < 0.5);
        }
        break;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isClickable = target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.closest('.cursor-pointer');

      setIsHoveringClickable(!!isClickable);
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [cursorX, cursorY]);

  if (!isMounted) return null;

  return (
    <div 
      suppressHydrationWarning 
      className={`relative min-h-screen overflow-x-hidden selection:bg-ink selection:text-canvas cursor-none transition-colors duration-1000 ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}
    >
      <AnimatePresence>
        {isLoading && <LiquidLoader onComplete={() => setIsLoading(false)} isDarkMode={isDarkMode} />}
      </AnimatePresence>
      <HUDCursor isHoveringClickable={isHoveringClickable} cursorXSpring={cursorXSpring} cursorYSpring={cursorYSpring} isDarkBackground={isCursorOnDark} />

      {/* HEADER PROTOCOL */}
      <header className={`fixed top-0 left-0 w-full z-[80] border-b border-muted transition-colors px-6 md:px-8 h-[53px] flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] font-normal ${isDarkMode ? "bg-black/90 text-white backdrop-blur-md" : "bg-white text-black"}`}>
        {/* BRANDING */}
        <div className="flex items-center gap-6">
          <div className={`transition-all duration-500 overflow-hidden flex items-center ${!isScrolled ? 'w-0 opacity-0 -ml-6' : 'w-[28px] opacity-100'}`}>
            <div className={`w-[28px] h-[28px] bg-ink grayscale shrink-0 ${isDarkMode ? "opacity-100" : "opacity-60"}`} style={{ maskImage: `url(${withPrefix("/logo_black.svg")})`, maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }} />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className={`hidden md:inline opacity-50 tracking-widest uppercase drop-shadow-md ${isDarkMode ? "text-white" : "text-black"}`}>Wess // Designer Estratégico</span>
              <span className={`md:hidden opacity-50 tracking-widest uppercase drop-shadow-md ${isDarkMode ? "text-white" : "text-black"}`}>Wess // Designer</span>
            </div>

          </div>
        </div>

        {/* DESKTOP NAV — WCAG 2.4.1 */}
        <nav aria-label="Navegação principal" className={`hidden md:flex items-center gap-10 transition-all duration-500 absolute left-1/2 -translate-x-1/2 ${!isScrolled ? 'opacity-0 translate-y-[-10px] pointer-events-none' : 'opacity-100 translate-y-0'}`}>
          {(
            [["cases", "PROJETOS"], ["experience", "EXPERIÊNCIA"], ["connect", "CONTATO"]] as const
          ).map(([anchor, label]) => (
            <a key={anchor} href={`#${anchor}`} className={`hover:line-through transition-all opacity-90 hover:opacity-100 drop-shadow-md ${isDarkMode ? "text-white" : "text-black"}`}>{label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          {/* MOBILE HAMBURGER — WCAG 4.1.2 */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex flex-col gap-[5px] cursor-none p-3 min-w-[44px] min-h-[44px] items-center justify-center"
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              type="button"
            >
              <motion.span aria-hidden="true" animate={{ rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? 7 : 0 }} className="block w-5 h-[1.5px] bg-ink origin-center transition-all" />
              <motion.span aria-hidden="true" animate={{ opacity: isMenuOpen ? 0 : 1 }} className="block w-5 h-[1.5px] bg-ink" />
              <motion.span aria-hidden="true" animate={{ rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? -7 : 0 }} className="block w-5 h-[1.5px] bg-ink origin-center transition-all" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            id="mobile-menu"
            role="navigation"
            aria-label="Menu mobile"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className={`fixed top-[53px] left-0 w-full z-[79] ${isDarkMode ? "bg-black" : "bg-white"} border-b border-muted flex flex-col font-mono text-[11px] uppercase tracking-[0.3em] md:hidden`}
          >
            {([["cases", "PROJETOS"], ["experience", "EXPERIÊNCIA"], ["connect", "CONTATO"]] as const).map(([anchor, label]) => (
              <a
                key={anchor}
                href={`#${anchor}`}
                onClick={() => setIsMenuOpen(false)}
                className="px-6 py-5 border-b border-muted opacity-60 hover:opacity-100 hover:bg-surface-sunken transition-all min-h-[44px] flex items-center"
              >{label}</a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>

      <main id="main-content" className="pt-[53px] px-0 max-w-[1920px] m-0 min-h-[calc(100vh-53px)]">
        {/* TRON HERO */}
        <section className={`col-span-12 h-[100dvh] min-h-[600px] -mt-[53px] pt-[53px] w-full flex items-center justify-center border-b border-muted overflow-hidden relative transition-colors duration-1000 ${isDarkMode ? 'bg-[#060606]' : 'bg-white'}`}>
          <TronHero isDarkMode={isDarkMode} heroRef={heroRef} cursorXSpring={cursorXSpring} cursorYSpring={cursorYSpring} />
        </section>

        {/* TELEMETRY MATRIX */}
        <section className={`grid grid-cols-1 md:grid-cols-12 border-b border-muted transition-colors divide-x divide-muted ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}>
          <div className="md:col-span-3 p-[var(--spacing-section)] flex items-center justify-center font-mono text-[10px] uppercase opacity-50 tracking-widest text-ink font-bold gap-3">
            <Activity size={12} aria-hidden="true" />
            TEMPO_DE_OPERAÇÃO // DESDE_2008
          </div>
          <div className="md:col-span-3 p-[var(--spacing-section)] flex flex-col gap-2 group hover:bg-surface-sunken transition-colors">
            <div className="flex justify-between items-start">
              <span className="font-mono text-[8px] opacity-30 uppercase tracking-[0.4em] font-bold">STATUS_WORKFLOW_IA</span>
              <Terminal size={12} className="opacity-10 group-hover:opacity-40" />
            </div>
            <span className="font-mono text-[11px] font-bold uppercase tracking-tighter">HABILITADO</span>
          </div>
          <div className="md:col-span-3 p-[var(--spacing-section)] flex flex-col gap-2 group hover:bg-surface-sunken transition-colors">
            <div className="flex justify-between items-start">
              <span className="font-mono text-[8px] opacity-30 uppercase tracking-[0.4em] font-bold">FUNÇÃO_ATUAL</span>
              <Eye size={12} className="opacity-10 group-hover:opacity-40" />
            </div>
            <span className="font-mono text-[11px] font-bold uppercase tracking-tighter">SÊNIOR_ESTRATÉGICO</span>
          </div>
          <div className="md:col-span-3 p-[var(--spacing-section)] flex flex-col gap-2 group hover:bg-surface-sunken transition-colors">
            <div className="flex justify-between items-start">
              <span className="font-mono text-[8px] opacity-30 uppercase tracking-[0.4em] font-bold">ESPECIALIDADE_CORE</span>
              <Fingerprint size={12} className="opacity-10 group-hover:opacity-40" />
            </div>
            <span className="font-mono text-[11px] font-bold uppercase tracking-tighter">SISTEMAS_DIGITAIS</span>
          </div>
        </section>

        {/* CASES SECTION — section-light: WCAG AA/AAA enforced */}
        <section id="cases" className="section-light col-span-12 flex flex-col transition-colors relative bg-white text-black">
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-muted bg-white text-black">
            <div className="md:col-span-3 px-[var(--spacing-section)] py-[var(--spacing-section-y)] border-r border-muted flex items-center">
              <ScrollReveal>
                <span className="wcag-label font-mono text-[9px] uppercase tracking-[0.4em] italic font-bold">002 // LOGS_CASES</span>
              </ScrollReveal>
            </div>
            <div className="md:col-span-9 px-[var(--spacing-section)] py-[var(--spacing-section-y)]">
              <ScrollReveal delay={0.1}>
                <h2 className="text-4xl font-display leading-[0.8] tracking-tighter uppercase font-bold">
                  <ShuffleText text="LOG_DE_ENTREGAS" delay={0.15} speed={25} />
                </h2>
              </ScrollReveal>
            </div>
          </div>
          <div className="flex flex-col">
            <ProjectRow
              step="01"
              title="GC-HDLAB"
              desc="[REFAC] Refatoração estratégica: migração de Power Apps para plataforma independente com UX de alta performance."
              img={withPrefix("/img/mockup_hdlab.png")}
              icon={Target}
              onClick={() => setActiveCase("hdlab")}
              hoverColor="#CBB9ED"
            />
            <ProjectRow
              step="02"
              title="BioAIDesign"
              desc="[DATA] Framework de inovação: avaliação objetiva baseada em IA, dados e viabilidade real."
              img={withPrefix("/img/mockup_bioai.png")}
              icon={Fingerprint}
              onClick={() => setActiveCase("bioai")}
              hoverColor="#B9C0D0"
            />
            <ProjectRow
              step="03"
              title="Anestesia Pediátrica"
              desc="[RISK] Design estratégico: mitigação de risco clínico em ambientes de alta complexidade."
              img={withPrefix("/img/mockup_anestesia.png")}
              icon={Eye}
              onClick={() => setActiveCase("anestesia")}
              hoverColor="#FEE4DB"
            />
            <ProjectRow
              step="04"
              title="Youcom"
              desc="[BEHAVIOR] Estratégia digital: comportamento do usuário e interfaces de alta conversão para varejo."
              img={withPrefix("/img/thumb_yc.png")}
              icon={Plus}
              onClick={() => setActiveCase("youcom")}
              hoverColor="#C5E3E4"
            />
          </div>
        </section>

        {/* CLIENTS MARQUEE */}
        <section className="section-light col-span-12 border-b border-muted py-12 overflow-hidden whitespace-nowrap group bg-white text-black">
          {/* WCAG 1.3.1 — list semantics; opacity-20→50 for minimum contrast */}
          <ul aria-label="Clientes atendidos" className="flex gap-24 animate-marquee items-center translate-z-0 list-none">
            {[...CLIENTS, ...CLIENTS, ...CLIENTS].map((client, i) => (
              <li key={i}>
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="font-display text-lg md:text-2xl opacity-50 hover:opacity-100 transition-all tracking-tighter uppercase font-bold hover:line-through"
                >
                  {client}
                </motion.span>
              </li>
            ))}
          </ul>
        </section>

        {/* IDENTITY BLOCK */}
        <section id="experience" className="section-light col-span-12 flex flex-col transition-colors relative bg-white text-black">
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-muted bg-white text-black">
            <div className="md:col-span-3 px-[var(--spacing-section)] py-[var(--spacing-section-y)] border-r border-muted flex items-center">
              <ScrollReveal>
                <span className="wcag-label font-mono text-[9px] uppercase tracking-[0.4em] italic font-bold">003 // LOGS_EXPERIÊNCIAS</span>
              </ScrollReveal>
            </div>
            <div className="md:col-span-9 px-[var(--spacing-section)] py-[var(--spacing-section-y)]">
              <ScrollReveal delay={0.1}>
                <h2 className="text-4xl font-display leading-[0.8] tracking-tighter uppercase font-bold text-black">
                  <ShuffleText text="ÚLTIMOS_LOGS" delay={0.15} speed={25} />
                </h2>
              </ScrollReveal>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12">
            <div className="col-span-12 px-[var(--spacing-section)] py-[var(--spacing-section-y)] md:p-32 flex flex-col items-start justify-center relative overflow-hidden group min-h-[60vh] transition-colors bg-white text-black">
              <ScrollReveal>
                <h2 className="text-3xl md:text-[50px] font-display font-bold leading-[1.1] tracking-tighter uppercase text-black max-w-none md:max-w-none text-left relative z-10 transition-transform duration-1000 group-hover:translate-x-4">
                  <AnimatedText text="Transformo complexidade" type="words" stagger={0.1} delay={0.2} /> <br />
                  <AnimatedText text="em produtos claros, escaláveis" type="words" stagger={0.1} delay={0.4} /> <br />
                  <AnimatedText text="e orientados a resultado." type="words" stagger={0.1} delay={0.6} />
                </h2>
              </ScrollReveal>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/[0.01] to-transparent h-[100%] w-full animate-scan pointer-events-none opacity-50" />
            </div>
          </div>
        </section>

        {/* EXPERIENCE TILES */}
        <section className="section-light col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-b border-muted min-h-[400px] divide-y md:divide-y-0 md:divide-x divide-muted transition-colors bg-white text-black">
          <ScrollReveal delay={0.1}><ExpCell isDark={false} id="01" entity="EINSTEIN" role="Gestor de Inovação" desc="[HEALTH_TECH] Estratégia de design aplicada à alta complexidade do setor de saúde. [DEPLOY] Interfaces críticas e sistemas de suporte à decisão com foco em eficiência operacional." icon={Terminal} /></ScrollReveal>
          <ScrollReveal delay={0.2}><ExpCell isDark={false} id="02" entity="COMPASSO UOL" role="Líder de Produto" desc="[RETAIL_STRATEGY] Direcionamento estratégico para operações globais de varejo. [SCALE] Interfaces escaláveis, performance contínua e crescimento guiado por métricas." icon={Search} /></ScrollReveal>
          <ScrollReveal delay={0.3}><ExpCell isDark={false} id="03" entity="BRADESCO / SABION" role="UX/UI Estrategista" desc="[FINTECH_LOG] Soluções digitais para plataformas bancárias de larga escala. [CONVERSION] Fluxos transacionais otimizados com foco em experiência, segurança e conversão." icon={Activity} /></ScrollReveal>
          <ScrollReveal delay={0.4}><ExpCell isDark={false} id="04" entity="TITANS GROUP" role="UX/UI" desc="[LATAM_MARKET] Arquitetura de produtos digitais escaláveis para mercado LatAm. [PRODUCT_CORE] Estruturação de MVPs e evolução de ecossistemas B2B e B2C." icon={Pointer} /></ScrollReveal>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="section-light col-span-12 border-b border-muted flex flex-col transition-colors bg-white text-black">
          {/* Header — same pattern as 002 and 003 */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-muted bg-white text-black">
            <div className="md:col-span-3 px-[var(--spacing-section)] py-[var(--spacing-section-y)] border-r border-muted flex items-center">
              <ScrollReveal>
                <span className="wcag-label font-mono text-[9px] uppercase tracking-[0.4em] italic font-bold">004 // LOG_SOBRE</span>
              </ScrollReveal>
            </div>
            <div className="md:col-span-9 px-[var(--spacing-section)] py-[var(--spacing-section-y)]">
              <ScrollReveal delay={0.1}>
                <h2 className="text-4xl font-display leading-[0.8] tracking-tighter uppercase font-bold text-black">
                  <ShuffleText text="MÉTODO" delay={0.15} speed={25} />
                </h2>
              </ScrollReveal>
            </div>
          </div>

          {/* Content with background image */}
          <div className="relative min-h-[800px] overflow-hidden flex flex-col justify-end">
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 z-10 bg-gradient-to-r from-white via-white/80 to-transparent" />
              <img
                src={withPrefix("/wess.png")}
                alt="Wesley Alves (Wess) — Estrategista de Design"
                loading="lazy"
                className="w-full h-full object-cover object-right grayscale transition-all duration-1000 group-hover:grayscale-0 opacity-40 md:opacity-50"
              />
            </div>

            <div className="relative z-20 px-[var(--spacing-section)] py-[var(--spacing-section-y)] flex flex-col gap-16 max-w-[1400px]">
              <ScrollReveal delay={0.1}>
                <h2 className="text-[50px] font-display font-bold tracking-tighter uppercase leading-[0.9] max-w-[1200px] text-ink">
                  A CONVERGÊNCIA <br /> ENTRE DESIGN,   <br /> NEGÓCIO E EXECUÇÃO.
                </h2>
              </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 relative">
                <ScrollReveal delay={0.2}>
                  <div className="flex flex-col gap-6">
                    <span className="font-mono text-[9px] opacity-40 uppercase tracking-[0.4em] italic font-black">// SOBRE_O_WESS</span>
                    <p className="font-body text-sm md:text-base opacity-60 leading-loose max-w-[480px]">
                      Minha jornada iniciada em 2008 consolidou uma visão estratégica entre design, tecnologia e crescimento. Como UX/UI sênior, não entrego apenas interfaces; projeto sistemas que reduzem fricção, aceleram decisões e transformam objetivos de negócio em experiências claras e escaláveis.
                    </p>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={0.3}>
                  <div className="flex flex-col gap-6 lg:pl-12">
                    <span className="font-mono text-[9px] opacity-40 uppercase tracking-[0.4em] italic font-black">// METODOLOGIA: O DIAMANTE ACELERADO POR IA</span>
                    <p className="font-body text-sm md:text-base opacity-60 leading-loose max-w-[480px]">
                      Minha abordagem evolui o Double Diamond tradicional com IA aplicada em cada etapa do processo. Isso acelera discovery, reduz ciclos de validação e aumenta precisão nas decisões. O resultado são protótipos de alta fidelidade, menos retrabalho e ROI mais rápido após o deploy.
                    </p>
                  </div>
                </ScrollReveal>
              </div>
            </div>

            <div className="relative z-20 w-full mt-24">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-b border-muted divide-y md:divide-y-0 md:divide-x divide-muted">
                <FrameworkCard
                  index="01"
                  subtitle="Discovery / Research"
                  title="DESCOBERTA"
                  description="IA sintetiza dados, padrões e oportunidades, reduzindo semanas de análise manual."
                  icon={<IconDescoberta />}
                  isDark={false}
                />
                <FrameworkCard
                  index="02"
                  subtitle="Strategy / definition"
                  title="DEFINIÇÃO"
                  description="Priorização veloz de gargalos críticos com clareza de impacto e viabilidade."
                  icon={<IconDefinicao />}
                  isDark={false}
                />
                <FrameworkCard
                  index="03"
                  subtitle="Prototype / High-Res"
                  title="DESENVOLVIMENTO"
                  description="Protótipos e sistemas escaláveis criados com velocidade para testes imediatos."
                  icon={<IconDesenvolvimento />}
                  isDark={false}
                />
                <FrameworkCard
                  index="04"
                  subtitle="Technical / Validation"
                  title="ENTREGA"
                  description="Validação contínua e refinamento técnico para garantir crescimento sustentável."
                  icon={<IconEntrega />}
                  isDark={false}
                />
              </div>
            </div>
          </div>
        </section>

        {/* PROPOSAL BUILDER */}
        <ProposalBuilder isDark={false} isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />

        {/* FOOTER */}
        <footer id="connect" className="section-light col-span-12 border-t border-muted transition-colors pt-24 pb-12 bg-white text-black">
          <div className="px-6 md:px-12 lg:px-24 grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
            <div className="flex flex-col gap-2">
              <a href="mailto:contateowess@gmail.com" className="text-xl md:text-2xl font-display font-bold tracking-tighter hover:line-through transition-all lowercase">contateowess@gmail.com</a>
              <div className="flex flex-col font-mono text-[11px] opacity-40 tracking-widest uppercase gap-1">
                <span>localização_Brasil</span>
                <div className="flex items-center gap-2">
                  <span>terminal_disponível</span>
                  <div className="w-2 h-2 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] rounded-sm" />
                </div>
              </div>
            </div>

            <div className="flex flex-col md:items-center">
              <a href="https://www.behance.net/wesleyalves" target="_blank" rel="noopener noreferrer" className="text-xl md:text-2xl font-display font-bold tracking-tighter hover:line-through transition-all">Behance</a>
            </div>

            <div className="flex flex-col md:items-end">
              <a href="https://www.linkedin.com/in/wessalves/" target="_blank" rel="noopener noreferrer" className="text-xl md:text-2xl font-display font-bold tracking-tighter hover:line-through transition-all">LinkedIn</a>
            </div>
          </div>

          <div className="px-6 md:px-12 lg:px-24 flex flex-col md:flex-row justify-between items-center gap-8 mb-16 font-mono text-[10px] tracking-[0.2em] opacity-40 uppercase">
            <span>©2026 Design & Codificação feitos com propósito.</span>
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="hover:line-through transition-all uppercase cursor-none"
            >
              Iniciar conversa →
            </button>
            <span>DEUS_NO_CONTROLE</span>
          </div>

          <div className="px-4 md:px-8 pointer-events-none select-none overflow-hidden">
            <div className="flex justify-center items-center py-8">
              <div
                className="w-full h-[150px] md:h-[250px] lg:h-[400px] transition-all duration-1000 bg-black"
                style={{
                  maskImage: `url(${withPrefix("/img/logo_wess.svg")})`,
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'bottom center'
                }}
              />
            </div>
          </div>
        </footer>
      </main>

      <AnimatePresence>
        {activeCase && (
          <CaseStudyView
            key={activeCase}
            isOpen={!!activeCase}
            onClose={() => setActiveCase(null)}
            isDarkMode={false}
            caseId={activeCase}
            onNext={(id) => setActiveCase(id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
