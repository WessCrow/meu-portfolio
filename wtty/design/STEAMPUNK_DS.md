# Design System: Vapor-Vacuum-01 (Steampunk Retro-Space)

## 1. Visão Geral
Uma fusão entre a mecânica vitoriana de latão/cobre e a tecnologia de tubos de vácuo de uma corrida espacial dos anos 50 que nunca aconteceu.

## 2. Design Tokens (Variáveis Semânticas)

### Cores (Chromatics)
```css
:root {
  /* Metals & Alloys */
  --sv-brass:        #D4AF37; /* Latão polido */
  --sv-brass-dark:   #8B7500;
  --sv-copper:       #B87333; /* Cobre quente */
  --sv-copper-rust:  #4E2E28;
  
  /* Vacuum Tubes & Displays */
  --sv-amber:        #FFB000; /* Neon de vácuo */
  --sv-amber-dim:    rgba(255, 176, 0, 0.15);
  --sv-oxide:        #43695B; /* Pátina de cobre */

  /* Surfaces */
  --sv-coal:         #0A0A0A; /* Superfície de metal preto */
  --sv-iron:         #1E1E1E;
  --sv-border:       rgba(212, 175, 55, 0.25);
  
  /* States */
  --sv-active:       var(--sv-amber);
  --sv-hazard:       #FF2A2A;
}
```

### Tipografia (Mechanics)
- **Display:** "Grenze Gotisch" (ou Serifada pesada como fallback)
- **Interface:** "Geist Mono" (Monospace industrial)

## 3. Componentes de Interface

### Console Inferior (Comand Deck)
- **Posição:** Fixed bottom, centrado.
- **Estilo:** Metal escovado horizontal, botões com chanfros (`bevel`) simulando peças encaixadas.
- **Interação:** Hover com glow âmbar (`box-shadow: 0 0 15px var(--sv-amber-dim)`).

### Lateral Drawer (Data-Vault)
- **Origem:** Direita lateral.
- **Animação:** Deslize pneumático (rápido no início, suave no fim).
- **Vidro:** Blur pesado (`backdrop-filter: blur(12px)`) com tom âmbar sutil.

## 4. Efeitos de Superfície
1. **Pátina:** Textura de ruído sobre superfícies de latão.
2. **Parafusos:** Elementos decorativos nos cantos dos painéis.
3. **Scanlines:** Mantidas do design anterior para o visor principal.
