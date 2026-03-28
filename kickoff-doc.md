---
shaping: true
project: Wess Strategic Portfolio
status: in-progress
last_updated: 2026-03-27
---

# Project Kickoff: Wess Strategic Portfolio

## 1. Frame
The strategic objective is to build a high-fidelity, premium portfolio for **Wess (Wesley)**, an iAUx Strategist and Innovation Designer. The portfolio must transition from a generic "AI" look to a high-agency, technical "Matrix" aesthetic inspired by KPRverse and modern editorial luxury (e.g., Heyefi).

### Outcomes Expected
- **Visual Identity**: "Matrix Light" — ultra-clean, 1px thin grid, squared corners (0 radius), high-contrast typography.
- **Technical Signature**: Integration of an IAA (Intent-Action-Audit) framework and HUD-style micro-interactions.
- **Performance**: Near-instant interaction using Next.js Turbopack and optimized SVG filters.

### Out of Scope
- Backend CMS (initially hardcoded content for speed).
- Blog/Article system (focus is on Case Study "Area Scans").

---

## 2. The Territory

### A. The Matrix Grid (System Layout)
The core architecture is a 12-column matrix. Every element is bounded by a thin, technical line.
- **Affordances**: Células numeradas (ex: 001, 002) que servem como identificadores de estado do sistema.
- **Design Decisions**: 
  - Fundo `#F0F0F0` (Technical Grey).
  - Linhas de grid com 1px e opacidade 0.08.
  - Fontes: **Clash Display** para headlines e **Geist Mono** para metadados técnicos.

### B. Image Processing (Area Scan)
Imagens de projetos devem parecer "dados capturados" pelo sistema.
- **Effect**: Chromatic Aberration Shader via SVG Filter (`feColorMatrix` + `feOffset`).
- **Interaction**: Transição de Grayscale -> Full Color + Chromatic Distortion no mouseover.
- **Design Decisions**: O efeito deve ser nítido (4px offset) para ser visível em telas de alta densidade sem poluir o design "clean".

### C. Typewriter 2.0 (Information Reveal)
A informação não aparece; ela é "bootada".
- **Interaction**: Efeito de revelação caractere por caractere com blur-to-focus progressivo.
- **Design Decisions**: Delay estagiário de 0.03s por caractere para manter a legibilidade enquanto reforça o aspecto de "terminal".

### D. Navigation & HUD (The Bridge)
- **Header**: Fixo, com mix-blend-mode e indicadores de status pulsantes.
- **Cursor**: Crosshair HUD que segue o mouse com física de mola para feedback tátil.

---

## 3. Build Sequence

1. **[DONE] Matrix Foundation**: Setup of Next.js and Tailwind v4 Matrix tokens.
2. **[DONE] Implementation of Chromatic Shader**: SVG Filter integration in layout.
3. **[DONE] HUD Interactions**: Custom cursor and Typewriter reveal logic.
4. **[TODO] Area Scan Content**: Populating project case studies with actual data from Firecrawl.
5. **[TODO] Responsive Hardening**: Ensuring the 12-column grid collapses elegantly on mobile.

---

*This document is a living map. Any change to the UI or Logic must be reflected here to maintain the "Shaping" integrity.*
