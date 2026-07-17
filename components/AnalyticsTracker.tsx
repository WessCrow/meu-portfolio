"use client";

import { useEffect } from "react";

/**
 * Rastreio de cliques para o Umami Cloud.
 *
 * O script do Umami (carregado em app/layout.tsx) já registra pageviews e
 * visitantes únicos automaticamente — não precisamos rastrear "visita" aqui.
 *
 * Este componente apenas captura cliques em elementos interativos (botões,
 * links e qualquer elemento com data-umami-event) e os envia como eventos
 * nomeados via window.umami.track(). Isso alimenta o painel de "eventos"
 * do Umami, equivalente à antiga coluna "Lugares Mais Clicados".
 */

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, unknown>) => void;
    };
  }
}

export default function AnalyticsTracker() {
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const closestLink = target.closest("a");
      const closestButton = target.closest("button");
      const marked = target.closest("[data-umami-event]") as HTMLElement | null;

      // Só rastreia elementos com significado (links, botões ou marcados).
      const trigger = marked || closestLink || closestButton;
      if (!trigger) return;

      // Prioridade do nome: data-umami-event > id > texto visível.
      let name =
        trigger.getAttribute("data-umami-event") ||
        trigger.id ||
        (trigger as HTMLElement).innerText ||
        trigger.tagName.toLowerCase();

      // Normaliza: colapsa quebras de linha/espaços e limita o tamanho.
      name = name.replace(/\s+/g, " ").trim().substring(0, 50);
      if (!name) return;

      window.umami?.track(name);
    };

    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  return null;
}
