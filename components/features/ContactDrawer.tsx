'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Mail, Phone, ChevronRight, Plus } from 'lucide-react';

import { HUDInput } from '../ui/HUDInput';

interface ContactDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ContactData) => void;
  isDark: boolean;
}

export interface ContactData {
  name: string;
  email: string;
  phone: string;
  observations: string;
}

export default function ContactDrawer({ isOpen, onClose, onSubmit, isDark }: ContactDrawerProps) {
  const [formData, setFormData] = useState<ContactData>({
    name: '',
    email: '',
    phone: '',
    observations: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      onSubmit(formData);
      setIsSubmitting(false);
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm cursor-none"
          />

          {/* DRAWER PANEL — WCAG 4.1.3 dialog role */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Formulário de contato"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md z-[101] shadow-2xl border-l border-white/10 flex flex-col cursor-none bg-black text-white"
          >
            {/* GLITCH OVERLAY BACKGROUND */}
            <div className="glitch-overlay opacity-5 pointer-events-none" />

            {/* HEADER */}
            <div className="p-8 border-b border-white/10 flex justify-between items-center relative z-10">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[9px] opacity-40 uppercase tracking-[0.4em] font-black">PROTOCOLO // CONTATO</span>
                <h3 className="text-2xl font-display font-bold tracking-tighter uppercase">SOLICITAÇÃO</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar formulário de contato"
                className="p-2 border border-white/20 hover:border-white transition-colors group cursor-none min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <X size={18} aria-hidden="true" className="opacity-40 group-hover:opacity-100" />
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="flex-1 p-8 flex flex-col gap-8 relative z-10">
              <p className="font-body text-sm opacity-50 leading-relaxed">
                Por favor, preencha os dados abaixo para que eu possa entrar em contato sobre esta proposta.
              </p>

              <div className="flex flex-col gap-6">
                <HUDInput 
                  label="Nome Completo"
                  placeholder="DIGITE SEU NOME"
                  icon={User}
                  value={formData.name}
                  onChange={(val: string) => setFormData(p => ({ ...p, name: val }))}
                  isDark={true}
                  required
                />
                <HUDInput 
                  label="Email Corporativo"
                  placeholder="EXEMPLO@EMPRESA.COM"
                  type="email"
                  icon={Mail}
                  value={formData.email}
                  onChange={(val: string) => setFormData(p => ({ ...p, email: val }))}
                  isDark={true}
                  required
                />
                <HUDInput 
                  label="Telefone / WhatsApp"
                  placeholder="+55 00 00000-0000"
                  type="tel"
                  icon={Phone}
                  value={formData.phone}
                  onChange={(val: string) => setFormData(p => ({ ...p, phone: val }))}
                  isDark={true}
                  required
                />
                <HUDInput 
                  label="Observações"
                  placeholder="EX: PRAZO ESTIMADO, REQUISITOS ESPECÍFICOS..."
                  icon={Plus}
                  value={formData.observations}
                  onChange={(val: string) => setFormData(p => ({ ...p, observations: val }))}
                  isDark={true}
                  multiline
                />
              </div>

              <div className="mt-auto pt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                  aria-label={isSubmitting ? "Processando solicitação" : "Solicitar orçamento"}
                  className="w-full py-5 border border-white/30 hover:bg-white hover:text-black font-mono text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-4 group disabled:opacity-30 relative overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                       <span>PROCESSANDO SOLICITAÇÃO...</span>
                    </div>
                  ) : (
                    <>
                      <span>SOLICITAR ORÇAMENTO</span>
                      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* FOOTER METADATA */}
            <div className="p-8 border-t border-white/10 bg-white/5 font-mono text-[8px] opacity-30 uppercase tracking-widest flex justify-between relative z-10 italic">
               <span>ID_PROTOCOLO: {Math.floor(Math.random() * 999999).toString().padStart(6, '0')}</span>
               <span>DESTINATÁRIO: CONTATEOWESS@GMAIL.COM</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

