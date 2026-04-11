'use client';

import React, { useState, useMemo } from 'react';
import emailjs from '@emailjs/browser';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Clock, 
  TrendingUp, 
  Maximize, 
  CheckCircle2, 
  Calculator,
  ChevronRight
} from 'lucide-react';
import type { Service } from './constants';
import { SERVICES, HOURLY_RATE } from './constants';
import type { ProposalResults } from './utils';
import { calculateProposal } from './utils';
import { ScrollReveal } from '../ui/ScrollReveal';
import { ShuffleText } from '../ui/ShuffleText';
import ContactDrawer from './ContactDrawer';
import type { ContactData } from './ContactDrawer';

export default function ProposalBuilder({ 
  isDark, 
  isDrawerOpen, 
  setIsDrawerOpen 
}: { 
  isDark: boolean, 
  isDrawerOpen: boolean, 
  setIsDrawerOpen: (val: boolean) => void 
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deadline, setDeadline] = useState(50);
  const [investment, setInvestment] = useState(50);
  const [scale, setScale] = useState(50);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Derive selected services from IDs
  const selectedServices = useMemo(() => 
    selectedIds.map(id => SERVICES.find(s => s.id === id)!).filter(Boolean) as Service[],
    [selectedIds]
  );

  const results = useMemo(() => 
    calculateProposal(selectedServices, deadline, investment, scale),
    [selectedServices, deadline, investment, scale]
  );

  const toggleService = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(i => i !== id));
    } else {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  const removeService = (id: string) => {
    setSelectedIds(prev => prev.filter(i => i !== id));
  };

  const handleConfirm = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerSubmit = async (data: ContactData) => {
    setIsSubmitting(true);

    const templateParams = {
      from_name: data.name,
      from_email: data.email,
      phone: data.phone || 'Não informado',
      observations: data.observations || 'Nenhuma',
      services: selectedServices.map(s => s.title).join(', '),
      prazo: deadline === 0 ? 'Acelerado' : deadline > 50 ? 'Flexível' : 'Padrão',
      investimento: investment === 100 ? 'Premium' : investment > 50 ? 'Padrão' : 'MVP',
      escala: scale === 100 ? 'Robusto' : scale > 50 ? 'Médio' : 'Simples',
      total_horas: results.totalHours,
      total_semanas: results.deliveryWeeks,
      total_preco: `R$ ${results.totalPrice.toLocaleString('pt-BR')}`,
    };

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
      );
      setSuccess(true);
      setTimeout(() => setSuccess(false), 8000);
    } catch (err: any) {
      console.error('EmailJS Error:', err);
      alert(`Erro ao enviar proposta. Por favor, entre em contato por contateowess@gmail.com`);
    } finally {


      setIsSubmitting(false);
    }
  };


  return (
    <section id="proposal-builder" className={`section-light col-span-12 border-b border-muted flex flex-col transition-colors ${isDark ? 'bg-[#0F0F0F] text-white' : 'bg-white text-black'}`}>

      {/* HEADER — same pattern as 002, 003, 004 */}
      <div className={`grid grid-cols-1 md:grid-cols-12 border-b border-muted ${isDark ? 'bg-[#0F0F0F] text-white' : 'bg-white text-black'}`}>
        <div className="md:col-span-3 px-[var(--spacing-section)] py-[var(--spacing-section-y)] border-r border-muted flex items-center">
          <ScrollReveal>
            <span className="wcag-label font-mono text-[9px] uppercase tracking-[0.4em] italic font-bold">005 // LOG_PROPOSTAS</span>
          </ScrollReveal>
        </div>
        <div className="md:col-span-9 px-[var(--spacing-section)] py-[var(--spacing-section-y)]">
          <ScrollReveal delay={0.1}>
            <h2 className={`text-4xl font-display leading-[0.8] tracking-tighter uppercase font-bold ${isDark ? 'text-white' : 'text-black'}`}>
              <ShuffleText text="SOLICITE_UMA_PROPOSTA" delay={0.15} speed={25} />
            </h2>
          </ScrollReveal>
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-[var(--spacing-section)] py-[var(--spacing-section-y)]">
        <ScrollReveal delay={0.2}>
          <p className="font-body text-sm md:text-base opacity-60 leading-loose max-w-[600px] mb-12">
            Personalize serviços e parâmetros técnicos para gerar um orçamento estimado. Selecione os módulos desejados, ajuste os parâmetros de execução e visualize instantaneamente o escopo técnico e financeiro.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: SERVICE SELECTION */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="flex items-center gap-3 border-b border-muted pb-4">
              <Plus size={14} className="opacity-40" />
              <h3 className="font-mono text-[11px] uppercase tracking-[0.3em] font-bold">Catálogo de Serviços</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {SERVICES.map((service, i) => {
                const isSelected = selectedIds.includes(service.id);
                const Icon = service.icon;
                return (
                  <motion.button
                    key={service.id}
                    onClick={() => toggleService(service.id)}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    viewport={{ once: true }}
                    className={`flex items-start gap-4 p-5 text-left border transition-all duration-300 relative group cursor-none
                      ${isSelected
                        ? 'border-black bg-black/5'
                        : 'border-muted hover:border-ink/40 bg-surface-sunken/20'
                      }`}
                  >
                    <div className={`p-2 border ${isSelected ? 'border-black text-black' : 'border-muted text-ink/40'} transition-colors`}>
                      <Icon size={18} strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-display font-bold text-sm uppercase tracking-tight">{service.title}</span>
                      <span className="font-body text-[11px] opacity-50 leading-relaxed">{service.description}</span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 size={12} className="text-black" />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* CENTER: BACKLOG & CONTROLS */}
          <div className="lg:col-span-5 flex flex-col gap-12">
            
            {/* BACKLOG REORDERABLE LIST */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-muted pb-4">
                <div className="flex items-center gap-3">
                  <GripVertical size={14} className="opacity-40" />
                  <h3 className="font-mono text-[11px] uppercase tracking-[0.3em] font-bold">Backlog do Projeto</h3>
                </div>
                <span className="font-mono text-[9px] opacity-40 uppercase">{selectedIds.length} Itens</span>
              </div>

              <div className="min-h-[200px] border border-dashed border-muted p-4 flex flex-col gap-2 relative">
                <AnimatePresence>
                  {selectedIds.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                      <span className="font-mono text-[10px] opacity-30 uppercase tracking-widest">[ AGUARDANDO_SELEÇÃO ]</span>
                    </motion.div>
                  ) : (
                    <Reorder.Group axis="y" values={selectedIds} onReorder={setSelectedIds} className="flex flex-col gap-2">
                       {selectedIds.map(id => {
                         const service = SERVICES.find(s => s.id === id)!;
                         return (
                           <Reorder.Item 
                             key={id} 
                             value={id}
                             initial={{ opacity: 0, scale: 0.95 }}
                             animate={{ opacity: 1, scale: 1 }}
                             exit={{ opacity: 0, scale: 0.95 }}
                             className={`flex items-center justify-between p-4 border border-muted transition-colors group cursor-none ${isDark ? 'bg-neutral-900' : 'bg-neutral-50'}`}
                           >
                             <div className="flex items-center gap-3">
                               <GripVertical size={14} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                               <span className="font-display font-medium text-xs uppercase tracking-tight">{service.title}</span>
                             </div>
                             <button 
                               onClick={(e) => { e.stopPropagation(); removeService(id); }}
                               className="p-1 hover:text-accent-hazard transition-colors opacity-20 group-hover:opacity-100"
                             >
                               <Trash2 size={14} />
                             </button>
                           </Reorder.Item>
                         )
                       })}
                    </Reorder.Group>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* DYNAMIC CONTROLS — WCAG 1.3.1 fieldset groups related controls */}
            <fieldset className="flex flex-col gap-8 border-none p-0 m-0">
              <legend className="flex items-center gap-3 border-b border-muted pb-4 w-full">
                <TrendingUp size={14} aria-hidden="true" className="opacity-40" />
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] font-bold">Variáveis de Escopo</span>
              </legend>

              <div className="flex flex-col gap-10">
                <HUDSlider
                  label="Prazo"
                  value={deadline}
                  onChange={setDeadline}
                  minLabel="Acelerado"
                  maxLabel="Flexível"
                  icon={Clock}
                  isDark={isDark}
                />
                <HUDSlider
                  label="Investimento"
                  value={investment}
                  onChange={setInvestment}
                  minLabel="MVP"
                  maxLabel="Premium"
                  icon={Calculator}
                  isDark={isDark}
                />
                <HUDSlider
                  label="Escala"
                  value={scale}
                  onChange={setScale}
                  minLabel="Simples"
                  maxLabel="Robusto"
                  icon={Maximize}
                  isDark={isDark}
                />
              </div>
            </fieldset>
          </div>

          {/* RIGHT: LIVE PROPOSAL OUTPUT */}
          <div className="lg:col-span-3">
             <div className="sticky top-24 flex flex-col gap-6">
                <div className={`p-8 border border-muted relative overflow-hidden transition-colors ${isDark ? 'bg-neutral-900/50' : 'bg-neutral-50/80'}`}>
                  <div className="flex flex-col gap-8 relative z-10">
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-[9px] opacity-40 uppercase tracking-[0.3em] font-black">RESUMO_DA_PROPOSTA</span>
                      <div className="h-[1px] w-12 bg-black" />
                    </div>

                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col">
                        <span className="font-mono text-[10px] opacity-40 uppercase mb-1">Carga Horária</span>
                        <div className="flex items-baseline gap-2">
                           <span className="text-4xl font-display font-bold tracking-tighter text-ink">{results.totalHours}</span>
                           <span className="font-mono text-[11px] opacity-40">H</span>
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <span className="font-mono text-[10px] opacity-40 uppercase mb-1">Tempo de Entrega</span>
                        <div className="flex items-baseline gap-2">
                           <span className="text-4xl font-display font-bold tracking-tighter text-ink">{results.deliveryWeeks}</span>
                           <span className="font-mono text-[11px] opacity-40">SEMANAS</span>
                        </div>
                      </div>
                    </div>


                    {/* STAGES BREAKDOWN */}
                    <div className="flex flex-col gap-4 pt-6 border-t border-muted/30">
                      <span className="font-mono text-[9px] opacity-40 uppercase tracking-widest font-black">Cronograma Estrutural</span>
                      <div className="flex flex-col gap-2">
                        {results.stages.map(stage => (
                          <div key={stage.name} className="flex justify-between items-center bg-surface-sunken/40 px-3 py-2 border border-muted/20">
                            <span className="font-mono text-[9px] uppercase font-bold">{stage.name}</span>
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-[9px] opacity-40">{stage.hours}H</span>
                              <div className={`w-1 h-3 ${stage.complexity === 'Alta' ? 'bg-accent-hazard' : stage.complexity === 'Média' ? 'bg-black' : 'bg-muted'}`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <motion.button
                      type="button"
                      disabled={selectedIds.length === 0 || isSubmitting}
                      onClick={handleConfirm}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      aria-busy={isSubmitting}
                      aria-label={isSubmitting ? "Processando proposta" : selectedIds.length === 0 ? "Selecione serviços para confirmar proposta" : "Confirmar Proposta"}
                      className={`btn-matrix w-full py-5 flex items-center justify-center gap-4 group disabled:opacity-30 disabled:pointer-events-none relative overflow-hidden border-2 border-black text-black font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black bg-white`}
                    >
                      <AnimatePresence mode="wait">
                        {isSubmitting ? (
                          <motion.div 
                            key="loading"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                          >
                            <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            <span>PROCESSANDO...</span>
                          </motion.div>
                        ) : success ? (
                          <motion.div 
                            key="success"
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-2 text-green-500"
                          >
                            <CheckCircle2 size={16} />
                            <span>ENVIADO COM SUCESSO</span>
                          </motion.div>
                        ) : (
                          <motion.div 
                            key="idle"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                          >
                            <span>CONFIRMAR PROPOSTA</span>
                            <ChevronRight size={18} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform text-black" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </div>
                </div>

                <div className={`px-4 py-3 border border-muted font-mono text-[8px] opacity-60 leading-relaxed uppercase tracking-tighter italic transition-colors ${isDark ? 'bg-neutral-900/50' : 'bg-neutral-50/80'}`}>
                  *Os valores de investimento serão calculados com base no escopo e enviados exclusivamente por e-mail após a confirmação.
                </div>

             </div>
          </div>

        </div>
      </div>{/* end content */}

      <ContactDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        onSubmit={handleDrawerSubmit}
        isDark={isDark}
      />
    </section>
  );
}

interface HUDSliderProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  minLabel: string;
  maxLabel: string;
  icon: React.ElementType;
  isDark: boolean;
}

function HUDSlider({ label, value, onChange, minLabel, maxLabel, icon: Icon, isDark }: HUDSliderProps) {
  const sliderId = `slider-${label.toLowerCase()}`;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Icon size={12} aria-hidden="true" className="opacity-40" />
          {/* WCAG 1.3.1 — label id used by aria-labelledby */}
          <span id={`${sliderId}-label`} className="font-mono text-[9px] uppercase tracking-widest font-black">{label}</span>
        </div>
        <span aria-live="polite" aria-atomic="true" className="font-mono text-[10px] font-bold text-black">{value}%</span>
      </div>

      <div className="relative h-6 flex items-center group">
        <input
          id={sliderId}
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          aria-labelledby={`${sliderId}-label`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={value}
          aria-valuetext={`${label}: ${value}% — ${value < 33 ? minLabel : value < 66 ? 'Padrão' : maxLabel}`}
          className="w-full h-1 bg-muted rounded-none appearance-none cursor-none outline-none focus:ring-0 opacity-100 group-hover:bg-ink/20 transition-colors focus-visible:ring-1 focus-visible:ring-black focus-visible:ring-offset-2"
          style={{
            background: `linear-gradient(to right, #000 ${value}%, ${isDark ? '#1A1A1A' : '#E0E0E0'} ${value}%)`
          }}
        />
        <div aria-hidden="true" className="absolute top-1/2 left-0 w-1 h-3 bg-muted -translate-y-1/2 pointer-events-none" />
        <div aria-hidden="true" className="absolute top-1/2 right-0 w-1 h-3 bg-muted -translate-y-1/2 pointer-events-none" />
        <div aria-hidden="true" className="absolute top-1/2 left-1/2 w-[1px] h-2 bg-muted -translate-y-1/2 pointer-events-none opacity-20" />
      </div>

      <div aria-hidden="true" className="flex justify-between font-mono text-[8px] uppercase tracking-widest" style={{ color: 'var(--color-text-label)' }}>
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}
