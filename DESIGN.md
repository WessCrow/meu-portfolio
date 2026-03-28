# Design System: Wess iAUx Strategic HUD (v2.0)

## 1. Practical Architecture (3-Tier Tokens)
Inspired by Carbon and Material Design, this system uses a tiered architecture to separate raw values from intent:
1. **Primitives:** Raw hexadecimal values (`--neutral-900`, `--accent-innovation`).
2. **Semantic Tokens:** Usage-based aliases (`--color-surface`, `--color-text-primary`, `--color-border-subtle`).
3. **System Foundations:** Standardized spacings and typography scales.

## 2. Color Palette & Semantic Roles
### Primitives
- **Neutral Scale:** White (#FFF) to OLED Black (#050505).
- **Accents:** Cyan Innovation (#00F2FE), Hazard Red (#FF2A2A).

### Semantic Mapping (Adaptive Theme)
- **Canvas:** Page-level background (`--neutral-50` Light / `--neutral-950` Dark).
- **Surface:** Component-level background (`--neutral-0` Light / `--neutral-900` Dark).
- **Surface Sunken:** Decorative or nested backgrounds (`--neutral-100` Light / `--neutral-800` Dark).
- **Ink Primary:** High-contrast text (`--neutral-900` Light / `--neutral-0` Dark).
- **Ink Muted:** Low-contrast text (`--neutral-400`).
- **Border Default:** Standard grid and component strokes (`0.2 opacity` in Dark).

## 3. Typography Rules
- **Display:** "Clash Display" (or Monument Extended) — Track-tight (-0.05em), leading-none, weight-driven hierarchy. Used for HERO and Section Headers.
- **Body:** "Satoshi" (or Geist) — Leading-relaxed, max 65ch width for paragraphs.
- **Mono:** "Geist Mono" — Exclusively for telemetry data, numerical IDs (001, 002), and technical labels.
- **Banned:** Inter, Roboto, Generic Serif (banned in this technical context).

## 4. Component Stylings
* **The Double-Bezel (Doppelrand):** Cards must use a 1.5px outer shell (#0A0A0A) with a 1px ring, wrapping an inner core (#121212) with a subtle inner highlight shadow. Outer radius: 2.5rem.
* **Buttons:** "Button-in-Button" architecture. Primary pills with trailing icons nested in their own circular wrapper. Tactile -1px vertical translate on active.
* **HUD Tags:** Micro-badges with monospace text, 10px, uppercase, 0.2em tracking. Border + 5% fill.
* **Loaders:** Skeletal shimmer matching component dimensions. 
* **Empty States:** Terminal-style "SEARCHING..." or "EMPTY_PROTOCOL" indicators.

## 5. Spacing System (8pt Grid)
All layouts must adhere to a strict 8pt grid system to ensure visual balance and practical scalability:
- **Spacing-1 (4px):** Micro adjustments.
- **Spacing-2 (8px):** Internal element spacing.
- **Spacing-4 (16px):** Standard component gaps.
- **Spacing-8 (32px):** Large component margins.
- **Spacing-12 (48px):** Section-level whitespace.

## 6. Motion & Interaction
* **Spring Physics:** Stiffness 100, Damping 20.
* **Perpetual Motion:** Breathing pulses on status dots, slow-moving noise textures, and staggered carousel reveals for data streams.
* **Magnetic Hover:** HUD elements pull slightly toward the cursor using hardware-accelerated transforms.
* **Grain Overlay:** Fixed, 3% opacity noise filter applied global-root level.

## 7. Anti-Patterns (Banned)
- No emojis
- No neon purple/AI gradients
- No generic "3-column equal cards"
- No `h-screen`
- No linear easing
- No placeholders like "John Doe" (Use "WESS" or specific case names)
