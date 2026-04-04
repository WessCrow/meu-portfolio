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
  Code2,
  Microscope,
  Accessibility,
  Gauge,
  Palette
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
    id: 'ux-research',
    title: 'UX Research',
    description: 'Entendimento profundo do usuário.',
    icon: Microscope,
    baseHours: 28
  },
  {
    id: 'ux-audit',
    title: 'Auditoria UX/UI',
    description: 'Diagnóstico de usabilidade.',
    icon: Search,
    baseHours: 24
  },
  {
    id: 'ui-design',
    title: 'UI Design',
    description: 'Interface clara e intuitiva.',
    icon: Layout,
    baseHours: 40
  },
  {
    id: 'accessibility',
    title: 'Acessibilidade',
    description: 'Inclusão e conformidade WCAG.',
    icon: Accessibility,
    baseHours: 20
  },
  {
    id: 'design-system',
    title: 'Design System',
    description: 'Escala e consistência.',
    icon: Layers,
    baseHours: 40
  },
  {
    id: 'performance',
    title: 'Performance',
    description: 'Velocidade e eficiência.',
    icon: Gauge,
    baseHours: 30
  },
  {
    id: 'branding',
    title: 'Criação de Marca',
    description: 'Identidade e posicionamento.',
    icon: Palette,
    baseHours: 35
  }
];
