import { 
  Target, 
  Search, 
  Layout, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Smartphone, 
  BarChart3, 
  Layers, 
  Code2 
} from 'lucide-react';

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: any;
  baseHours: number;
}

export const HOURLY_RATE = 200;

export const SERVICES: Service[] = [
  {
    id: 'ux-audit',
    title: 'Auditoria de UX/UI',
    description: 'Análise heurística completa e diagnóstico de usabilidade.',
    icon: Search,
    baseHours: 24
  },
  {
    id: 'design-system',
    title: 'Design System',
    description: 'Criação de biblioteca de componentes escalável e atômica.',
    icon: Layers,
    baseHours: 40
  },
  {
    id: 'prototype',
    title: 'Prototipagem High-Fi',
    description: 'Desenvolvimento de fluxos navegáveis de alta fidelidade.',
    icon: Zap,
    baseHours: 32
  },
  {
    id: 'mobile-app',
    title: 'App Mobile',
    description: 'Design de interface focado em experiência mobile-first.',
    icon: Smartphone,
    baseHours: 60
  },
  {
    id: 'strategy',
    title: 'Estratégia de Produto',
    description: 'Mapeamento de jornada e definição de visão de produto.',
    icon: Target,
    baseHours: 30
  },
  {
    id: 'frontend',
    title: 'Engenharia Front-end',
    description: 'Implementação de interfaces performáticas com React/Next.js.',
    icon: Code2,
    baseHours: 50
  }
];
