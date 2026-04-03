import type { Service } from './constants';
import { HOURLY_RATE } from './constants';

export interface ProposalResults {
  totalHours: number;
  deliveryWeeks: number;
  totalPrice: number;
  stages: {
    name: string;
    hours: number;
    complexity: 'Baixa' | 'Média' | 'Alta';
  }[];
}

export function calculateProposal(
  selectedServices: Service[],
  deadline: number,
  investment: number,
  scale: number
): ProposalResults {
  // Base hours from selected services
  const baseHours = selectedServices.reduce((acc, s) => acc + s.baseHours, 0);
  
  if (baseHours === 0) {
    return {
      totalHours: 0,
      deliveryWeeks: 0,
      totalPrice: 0,
      stages: []
    };
  }

  // Multipliers based on sliders (0-100)
  // Deadline: 0 (Acelerado) means more urgency = potentially more cost or less depth
  // Inverting deadline for ease of math: 0 is fast, 100 is flexible.
  const deadlineFactor = 1 + ((100 - deadline) / 100) * 0.5; // Up to 50% increase for rush
  
  // Investment: 0 (MVP) to 100 (Premium)
  const investmentFactor = 0.5 + (investment / 100) * 1.5; // 0.5x to 2.0x depth/quality
  
  // Scale: 0 (Simples) to 100 (Robusto)
  const scaleFactor = 0.8 + (scale / 100) * 1.2; // 0.8x to 2.0x complexity

  const totalHours = Math.round(baseHours * investmentFactor * scaleFactor);
  const totalPrice = Math.round(totalHours * HOURLY_RATE * deadlineFactor);
  const deliveryWeeks = Math.max(1, Math.ceil(totalHours / (40 / deadlineFactor))); // Assuming 40h/week but rush reduces available weeks

  // Sample stages breakdown
  const stages: ProposalResults['stages'] = [
    { 
      name: 'Imersão & Pesquisa', 
      hours: Math.round(totalHours * 0.15), 
      complexity: totalHours > 100 ? 'Média' : 'Baixa' 
    },
    { 
      name: 'Arquitetura & Fluxos', 
      hours: Math.round(totalHours * 0.25), 
      complexity: scale > 60 ? 'Alta' : 'Média' 
    },
    { 
      name: 'Design de Interface', 
      hours: Math.round(totalHours * 0.40), 
      complexity: investment > 70 ? 'Alta' : 'Média' 
    },
    { 
      name: 'Entrega & QA', 
      hours: Math.round(totalHours * 0.20), 
      complexity: 'Média' 
    }
  ];

  return {
    totalHours,
    deliveryWeeks,
    totalPrice,
    stages
  };
}
