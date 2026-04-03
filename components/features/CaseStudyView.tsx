"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft, Terminal, Layout, Target, Eye, Fingerprint, Command } from "lucide-react";
import { withPrefix } from "../../app/utils/paths";
import { AnimatedText } from "../ui/AnimatedText";
import { ShuffleText } from "../ui/ShuffleText";
import { GlitchImage } from "../ui/GlitchImage";

export interface CaseStudyData {
   id: string;
   title: string;
   subtitle: string;
   description: string;
   metadata: {
      role: string;
      brand: string;
      typeface: string;
      contractor: string;
      color: string;
   };
   sections: {
      title: string;
      content: string;
      image?: string;
      layout: "text-left" | "text-right" | "full-image";
   }[];
}

const PhotoPlaceholder = ({ title }: { title?: string }) => (
   <div className="w-full h-full min-h-[400px] bg-transparent border border-dashed border-muted/10 flex flex-col items-center justify-center p-12 text-center group font-mono relative overflow-hidden">
      {/* WESS WATERMARK LOGO */}
      <div 
         className="absolute inset-0 z-0 flex items-center justify-center opacity-10 pointer-events-none"
         style={{
            maskImage: `url(${withPrefix("/img/logo_wess.svg")})`,
            maskSize: '40%',
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
            backgroundColor: 'currentColor'
         }}
      />

      <div className="relative z-10 flex flex-col items-center">
         <div className="w-16 h-16 border border-muted/20 flex items-center justify-center mb-6 opacity-20 group-hover:opacity-100 transition-opacity">
            <Layout size={32} className="text-muted" />
         </div>
         <span className="text-[10px] uppercase tracking-[0.5em] opacity-40 group-hover:opacity-100 transition-opacity">
            IMAGE_PENDING_PROTOCOL // {title || "NULL"}
         </span>
         <div className="mt-4 flex gap-2">
            <div className="w-1.5 h-1.5 bg-muted/10" />
            <div className="w-1.5 h-1.5 bg-muted/30 animate-pulse" />
            <div className="w-1.5 h-1.5 bg-muted/10" />
         </div>
      </div>
   </div>
);

export const BIOAI_CASE: CaseStudyData = {
   id: "02",
   title: "BioAIDesign",
   subtitle: "OTIMIZAÇÃO DE USABILIDADE E CENTRALIZAÇÃO METODOLÓGICA.",
   description: "Otimização de Usabilidade e Centralização de Ecossistema Digital. Foco em transformar o uso da plataforma em uma experiência contínua e sem interrupções para os fellows de biodesign.",
   metadata: {
      role: "UX/UI Estrategista",
      brand: "BioAIDesign",
      typeface: "Geist Mono",
      contractor: "Entelgy / Inovação",
      color: "#50bfa0"
   },
   sections: [
      {
         title: "O_PROBLEMA",
         content: "Dificuldades de usabilidade na etapa crítica de Need Statement geravam gargalos operacionais para os fellows de biodesign. A fragmentação do processo em diferentes ferramentas impedia uma visão holística e fluida da metodologia.",
         layout: "text-right"
      },
      {
         title: "A_ANÁLISE",
         content: "Diagnóstico técnico revelou atritos na interface concluída em 2025 pela Entelgy. Identificamos a necessidade de simplificar funcionalidades existentes e criar um roadmap de priorização (backlog) alinhado aos objetivos de negócio dos stakeholders.",
         layout: "text-left"
      },
      {
         title: "ESTRATÉGIA_&_PLANEJAMENTO",
         content: "Aplicação de testes de usabilidade estruturados para mapear pontos de dor reais. Desenvolvimento de um plano de evolução sistêmica focado em automação de processos, transformando o uso da plataforma em uma experiência contínua.",
         layout: "full-image"
      },
      {
         title: "EVOLUÇÃO_&_ARQUITETURA",
         content: "Revisão da arquitetura de informação para suportar a centralização de todas as etapas do Biodesign. Foco em otimização de fluxos existentes e design de interface centrado na eficiência do pesquisador.",
         layout: "text-right"
      },
      {
         title: "RESULTADO_FINAL",
         content: "Centralização Metodológica: Unificação das etapas em uma única interface. Automação de Processos: Redução de tarefas manuais. Backlog Estratégico: Priorização baseada em valor de negócio.",
         layout: "text-left"
      }
   ]
};

export const HDLAB_CASE: CaseStudyData = {
   id: "01",
   title: "GC-HDLAB",
   subtitle: "REFATORAÇÃO CAPACITY: PERFORMANCE E INTEGRIDADE DE DADOS NO HDLAB.",
   description: "Refatoração Capacity: Otimização de Performance e Inteligência Operacional. Intervenção técnica focada na reestruturação do core do sistema para restaurar a confiança e garantir a continuidade da gestão de projetos do HDLab.",
   metadata: {
      role: "UX/UI Coordenador",
      brand: "GC-HDLAB",
      typeface: "Geist Mono",
      contractor: "Health Design Lab",
      color: "#3b82f6"
   },
   sections: [
      {
         title: "O_PROBLEMA",
         content: "A ferramenta desenvolvida em 2024 apresentava alta latência e instabilidade, resultando em perda de engajamento da equipe e imprecisão nos dados. O desafio era restaurar a confiança no sistema e garantir a gestão de projetos.",
         layout: "text-right"
      },
      {
         title: "A_ANÁLISE",
         content: "Identificamos gargalos no código-fonte original (Power Apps) que impediam a escalabilidade. A lentidão da interface inviabilizava o uso diário, comprometendo o funil executivo e a visibilidade da capacidade real do time.",
         layout: "text-left"
      },
      {
         title: "ESTRATÉGIA_&_REFATORAÇÃO",
         content: "Foco na 'refatoração invisível': melhorar drasticamente o desempenho interno e a velocidade de processamento sem alterar o comportamento externo e o fluxo já aprendido pelos usuários.",
         layout: "full-image"
      },
      {
         title: "FOCO_EXECUTIVO",
         content: "Desenvolvimento de uma estrutura de dados robusta para facilitar a tomada de decisão da diretoria. O sistema foi desenhado para provar a eficiência operacional através de métricas confiáveis e relatórios de alta performance.",
         layout: "text-right"
      },
      {
         title: "RESULTADO_FINAL",
         content: "Otimização Sistêmica: Eliminação total da latência. Retenção de Engajamento: Recuperação da adesão do time. Suporte à Decisão: Dados precisos e rápidos para o funil executivo e diretoria.",
         layout: "text-left"
      }
   ]
};

export const YOUCOM_CASE: CaseStudyData = {
   id: "04",
   title: "Youcom",
   subtitle: "UNIFICAÇÃO DA JORNADA OMNICHANNEL E EXPERIÊNCIA DE MODA MOBILE FIRST.",
   description: "Fragmentação da Experiência: Identificamos uma disparidade entre o 'encantamento' do ponto de venda físico e a percepção puramente funcional do e-commerce.\n\nO desafio consistiu em unificar a jornada digital Youcom para alta performance, transformando o site em um ambiente de descoberta e desejo, focado em conversão e experiência de moda fluida.",
   metadata: {
      role: "UX/UI Strategist",
      brand: "Youcom",
      typeface: "Roboto / Playfair Display",
      contractor: "Compasso UOL",
      color: "#FF007A"
   },
   sections: [
      {
         title: "CONTEXTO_&_HÁBITOS",
         content: "Metodologia & Pesquisa: Imersão com 32 clientes (19 POA / 13 SP) em 4 grupos focais com faixas de 15-35 anos. Através de estudos no Labex PUCRS e em escritórios de e-commerce, mapeamos diferentes níveis de proximidade com a Youcom.\n\nHábito de Consumo: O público utiliza o site como um hobby de descoberta. Muitos salvam peças via prints ou favoritos do browser por desconhecerem a funcionalidade nativa de wishlist.\n\nBarreiras de Conversão: A insegurança com a modelagem e a deficiência no acompanhamento logístico pós-compra foram identificados como os principais detratores da experiência digital.",
         layout: "text-right"
      },
      {
         title: "ANÁLISE_&_DIAGNÓSTICO",
         content: "Predomínio Mobile: A maior parte do tráfego provém de smartphones, tornando a usabilidade e o tempo de carregamento mobile os fatores críticos de sucesso.\n\nNecessidade de Curadoria: Utilizadores relataram dificuldade em entender a 'vestibilidade' do produto através de fotos estáticas. Há uma demanda clara por uma aplicação que ofereça exclusividade e notificações.",
         layout: "text-left"
      },
      {
         title: "BENCHMARK_ESTRATÉGICO",
         content: "Exposição e Estética: Análise da FARM pela excelência visual e da AMARO pela eficiência no fluxo de devolução e troca.\n\nDiversidade e Naturalidade: Referência na marca ZIOVARA para a inclusão de corpos diversos e modelos reais. Estudo do modelo da FastShop para a implementação de cadastros por etapas (Checkout Faseado).",
         layout: "full-image"
      },
      {
         title: "IDENTIDADE_&_DESIGN_SYSTEM",
         content: "Tipografia: Harmonização entre as fontes Roboto (funcionalidade) e Playfair Display (apelo editorial de moda).\n\nDesign System: Desenvolvimento de uma biblioteca de ícones proprietários para garantir consistência visual em todos os pontos de contacto. Paleta de Cores: Implementação de tons vibrantes para reforçar o branding urbano.",
         layout: "text-right"
      },
      {
         title: "RESULTADOS_E_ENTREGAS",
         content: "Redução de Fricção: Implementação de provador virtual com medidas reais e detalhamento técnico de fits.\n\nEficiência de Checkout: Optimização do fluxo com login social e cotação de frete simplificada.\n\nRepresentatividade: Foco em diversidade de modelos e vídeos de vestibilidade nas descrições.",
         layout: "text-left"
      }
   ]
};

export const ANESTESIA_CASE: CaseStudyData = {
   id: "03",
   title: "Anestesia Pediátrica",
   subtitle: "JORNADA DE ANESTESIA PEDIÁTRICA: DESIGN DE SERVIÇO PARA MITIGAÇÃO DE MEDO E ANSIEDADE.",
   description: "Design de Serviço focado na mitigação de medo e ansiedade em jornadas hospitalares pediátricas. O desafio consistiu em unificar a experiência e humanizar o atendimento para reduzir o estresse pré-operatório.",
   metadata: {
      role: "Design Strategist & UX Writer",
      brand: "Albert Einstein",
      typeface: "Geist Mono",
      contractor: "Hospital Israelita Albert Einstein",
      color: "#0072CE"
   },
   sections: [
      {
         title: "O_PROBLEMA",
         content: "Identificamos que a falta de familiaridade com os processos hospitalares e a variação no padrão de atendimento entre unidades geravam medo e insegurança em pacientes pediátricos e seus responsáveis. O desafio era unificar a experiência e humanizar a jornada anestésica para reduzir o estresse pré-operatório.",
         layout: "text-right"
      },
      {
         title: "A_ANÁLISE",
         content: "O mapeamento da jornada atual revelou pontos críticos na recepção, internação e transporte da criança. Observou-se que ruídos hospitalares e ambientes pouco amigáveis atuavam como gatilhos de estresse, enquanto a desinformação dos pais comprometia a colaboração no processo.",
         layout: "text-left"
      },
      {
         title: "ESTRATÉGIA_&_INTERVENÇÃO",
         content: "Desenvolvimento de uma jornada lúdica baseada no conceito de \"encantamento\". A proposta inclui a criação de um jogo interativo pré-hospitalar, customização de ambientes com design biofílico e a personalização de leitos e macas como espaços de conforto e distração.",
         layout: "full-image"
      },
      {
         title: "DESIGN_DE_SERVIÇO",
         content: "Foco na padronização do atendimento entre unidades (Morumbi e Perdizes) e na revisão de protocolos assistenciais, como questionários pré-operatórios e fluxos de preparo. A estratégia visa substituir o medo pela familiaridade através de materiais informativos adaptados por faixa etária.",
         layout: "text-right"
      },
      {
         title: "RESULTADO_FINAL",
         content: "Mitigação de Estresse: Propostas de personalização sensorial (luz, cor e som) para reduzir a frequência cardíaca e ansiedade.\n\nEngajamento Familiar: Implementação de materiais digitais e físicos para alinhamento de expectativas e acolhimento.\n\nPadronização Operacional: Criação de um roteiro sensível e validado para unificar a excelência no atendimento pediátrico.",
         layout: "text-left"
      }
   ]
};

export default function CaseStudyView({ isOpen, onClose, isDarkMode, caseId = "bioai", onNext }: { isOpen: boolean, onClose: () => void, isDarkMode: boolean, caseId?: string, onNext?: (id: string) => void }) {

   // Handle ESC key
   useEffect(() => {
      const handleEsc = (e: KeyboardEvent) => {
         if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
   }, [onClose]);

   if (!isOpen) return null;

   const getCaseData = () => {
      switch (caseId) {
         case "youcom": return YOUCOM_CASE;
         case "hdlab": return HDLAB_CASE;
         case "anestesia": return ANESTESIA_CASE;
         default: return BIOAI_CASE;
      }
   };

   const caseData = getCaseData();

   return (
      <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         className={`fixed inset-0 z-[100] overflow-y-auto cursor-none ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}
      >
         {/* TOP PROTOCOL BAR */}
         <div className={`sticky top-0 z-[110] w-full h-[53px] border-b border-muted flex items-center justify-between px-6 md:px-8 backdrop-blur-xl ${isDarkMode ? "bg-black/80" : "bg-white/80"}`}>
            <div className="flex items-center gap-6">
               <button
   onClick={onClose}
   className={`flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] font-bold group ${isDarkMode ? "text-white/80" : "text-black/80"} hover:text-ink transition-colors`}
>
   <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
   VOLTAR_AO_TERMINAL
</button>
               <div className="h-4 w-[1px] bg-muted hidden md:block" />
               <span className={`font-mono text-[9px] ${isDarkMode ? "text-white/60" : "text-black/60"} uppercase tracking-[0.4em] hidden md:block`}>
   PROTOCOLO // CASE_RECON_{caseData.id}
</span>
            </div>

            <button
               onClick={onClose}
               className="w-10 h-10 border border-muted flex items-center justify-center hover:bg-ink hover:text-canvas transition-colors group"
            >
               <X size={18} className="group-hover:rotate-90 transition-transform duration-500" />
            </button>
         </div>

         {/* HERO SECTION */}
         <section className="relative w-full h-[60vh] md:h-[80vh] border-b border-muted overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 z-0 opacity-40 grayscale blur-[2px]">
               {/* Check if image exists, otherwise show WESS logo */}
               {caseData.sections[0]?.image ? (
                  <GlitchImage src={caseData.sections[0].image} isHovered={true} isDark={isDarkMode} />
               ) : (
                  <div 
                     className="absolute inset-0 z-0 flex items-center justify-center opacity-10 pointer-events-none"
                     style={{
                        maskImage: `url(${withPrefix("/img/logo_wess.svg")})`,
                        maskSize: '30%',
                        maskRepeat: 'no-repeat',
                        maskPosition: 'center',
                        backgroundColor: 'currentColor'
                     }}
                  />
               )}
            </div>

            <div className="relative z-10 text-center px-6 max-w-5xl">
               <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-6"
               >
                  <h1 className="text-4xl md:text-8xl lg:text-[100px] font-display font-bold leading-[0.85] tracking-tighter uppercase whitespace-pre-wrap">
                     <ShuffleText text={caseData.title} delay={0.5} />
                  </h1>
                  <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.5em] opacity-60 font-bold max-w-4xl mx-auto">
                     {caseData.subtitle}
                  </p>
               </motion.div>
            </div>

            {/* DECORATIVE GRID */}
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(var(--color-border-default) 1px, transparent 1px), linear-gradient(90deg, var(--color-border-default) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
         </section>

         {/* METADATA MATRIX */}
         <section className={`grid grid-cols-2 md:grid-cols-4 border-b border-muted divide-x divide-muted uppercase font-mono text-[10px] tracking-widest font-bold ${isDarkMode ? "text-white" : "text-black"}`}>
            <div className="p-8 space-y-2">
               <span className="opacity-60">PAPEL_LOG</span>
               <div className="text-[12px] opacity-100">{caseData.metadata.role}</div>
            </div>
            <div className="p-8 space-y-2">
               <span className="opacity-60">MARCA_REF</span>
               <div className="text-[12px] opacity-100" style={{ color: caseData.metadata.color }}>{caseData.metadata.brand}</div>
            </div>
            <div className="p-8 space-y-2">
               <span className="opacity-60">TIPOGRAFIA_SYS</span>
               <div className="text-[12px] opacity-100">{caseData.metadata.typeface}</div>
            </div>
            <div className="p-8 space-y-2 border-r md:border-r-0 border-muted">
               <span className="opacity-60">EMPRESA_EXEC</span>
               <div className="text-[12px] opacity-100">{caseData.metadata.contractor}</div>
            </div>
         </section>

         {/* INTRODUCTION */}
         <section className="grid grid-cols-1 md:grid-cols-12 border-b border-muted">
            <div className="md:col-span-3 p-8 md:p-16 border-r border-muted flex items-start">
               <span className={`font-mono text-[9px] ${isDarkMode ? "text-white/60" : "text-black/60"} tracking-[0.4em] italic font-bold uppercase`}>01 // INTRODUÇÃO</span>
            </div>
            <div className="md:col-span-9 p-8 md:p-16 md:p-32">
               <h2 className="text-3xl md:text-5xl font-display font-bold leading-none tracking-tighter uppercase mb-12">
                  <AnimatedText text="ESTRATÉGIA_PROJETUAL" type="words" stagger={0.08} />
               </h2>
               <p className={`font-body text-[12px] font-normal ${isDarkMode ? "text-white/70" : "text-black/70"} leading-relaxed max-w-4xl whitespace-pre-wrap`}>
                  {caseData.description}
               </p>
            </div>
         </section>

         {/* CONTENT BLOCKS */}
         {caseData.sections.map((section: any, idx: number) => (
            <section key={idx} className={`grid grid-cols-1 md:grid-cols-12 border-b border-muted transition-colors`}>
               {section.layout === "full-image" ? (
                  <div className="col-span-12 p-8 md:p-24 bg-ink text-canvas">
                     <div className="flex justify-between items-end mb-8">
                        <div className="space-y-4">
                           <span className="font-mono text-[9px] opacity-60 tracking-[0.4em] font-bold uppercase">MODULO_{idx + 2} // {section.title}</span>
                           <p className="font-body text-[12px] font-normal opacity-100 max-w-2xl whitespace-pre-wrap">{section.content}</p>
                        </div>
                     </div>
                     <div className="w-full aspect-video border border-muted overflow-hidden relative group">
                        {section.image ? (
                           <img src={section.image} alt={section.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                        ) : (
                           <PhotoPlaceholder title={section.title} />
                        )}
                        <div className="absolute inset-0 bg-ink/5 mix-blend-overlay" />
                     </div>
                  </div>
               ) : (
                  <>
                     <div className={`md:col-span-6 p-8 md:p-16 flex flex-col justify-center gap-12 ${section.layout === "text-right" ? "md:order-2 md:border-l" : "md:border-r"} border-muted`}>
                        <div className="space-y-4">
                           <span className={`font-mono text-[9px] ${isDarkMode ? "text-white/60" : "text-black/60"} tracking-[0.4em] font-bold uppercase`}>MODULO_{idx + 2} // {section.title}</span>
                           <h3 className="text-2xl md:text-4xl font-display font-bold leading-tight tracking-tighter uppercase">{section.title.replace(/_/g, ' ')}</h3>
                        </div>
                        <p className={`font-body text-[12px] font-normal ${isDarkMode ? "text-white" : "text-black"} leading-relaxed whitespace-pre-wrap`}>{section.content}</p>
                     </div>
                     <div className={`md:col-span-6 p-8 md:p-16 bg-surface-sunken/30 flex items-center justify-center ${section.layout === "text-right" ? "md:order-1" : ""}`}>
                        <div className="w-full h-full border border-muted shadow-2xl relative group overflow-hidden">
                           {section.image ? (
                              <img src={section.image} alt={section.title} className="w-full h-full object-cover" />
                           ) : (
                              <PhotoPlaceholder title={section.title} />
                           )}
                        </div>
                     </div>
                  </>
               )}
            </section>
         ))}

         <section className={`h-[50vh] flex flex-col items-center justify-center text-center p-8 bg-surface-sunken/30 border-t border-muted ${isDarkMode ? "text-white" : "text-black"}`}>
            <div className="flex items-center gap-4 mb-10">
               <div className="w-12 h-[1px] bg-muted" />
               <span className={`font-mono text-[10px] ${isDarkMode ? "text-white/60" : "text-black/60"} tracking-[0.6em] font-bold uppercase transition-all group-hover:tracking-[0.8em]`}>INIT_PROTOCOL_NEXT_RECON</span>
               <div className="w-12 h-[1px] bg-muted" />
            </div>

            <button 
               onClick={() => {
                  if (!onNext) return;
                  const nextId = caseId === "hdlab" ? "bioai" : 
                                caseId === "bioai" ? "anestesia" : 
                                caseId === "anestesia" ? "youcom" : 
                                "hdlab";
                  onNext(nextId);
               }}
               type="button"
               className="group flex flex-col items-center gap-6"
            >
               <h2 className="text-4xl md:text-8xl font-display font-bold tracking-tighter uppercase transition-all duration-700 group-hover:scale-[1.02] group-hover:tracking-widest">
                  <ShuffleText 
                     text={caseId === "hdlab" ? "BioAIDesign" : 
                           caseId === "bioai" ? "ANESTESIA PEDIÁTRICA" : 
                           caseId === "anestesia" ? "YOUCOM" : 
                           "GC-HDLAB"} 
                     delay={0}
                  />
               </h2>
               <div className={`flex items-center justify-center gap-8 ${isDarkMode ? "text-white/60" : "text-black/60"} group-hover:opacity-100 transition-all duration-500`}>
                  <span className="font-mono text-[10px] uppercase tracking-[0.4em] font-bold">VER_PRÓXIMO_PROJETO</span>
                  <div className="w-10 h-10 border border-muted flex items-center justify-center group-hover:bg-ink group-hover:text-canvas transition-all rotate-45 group-hover:rotate-0">
                     <ArrowRight size={18} className="-rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                  </div>
               </div>
            </button>
         </section>

         {/* SCANLINE OVERLAY */}
         <div className="fixed inset-0 pointer-events-none z-[120] opacity-[0.03] select-none overflow-hidden h-screen w-screen">
            <div className="absolute inset-0 bg-repeat bg-[length:100%_4px] bg-gradient-to-b from-transparent via-black to-transparent" />
         </div>

      </motion.div>
   );
}
