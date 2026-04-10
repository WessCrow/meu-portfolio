---
name: frontend-design
description: >
  Create frontend interfaces that translate design decisions into working code. Use this skill when the user asks to build web components, pages, artifacts, or applications. Distinguishes between product interfaces (where function, consistency, and accessibility lead) and marketing/expressive interfaces (where visual impact leads). Generates production-grade code that respects the design hierarchy established in ux-design.
---

# Frontend Design Skill

This skill generates working frontend code (HTML/CSS/JS, React) from design intent. It bridges the gap between design decisions made in Figma and their implementation in code.

---

## Context Detection

Before writing code, determine the context. The context dictates which principles dominate.

**Product interface** (dashboards, admin panels, forms, app screens, SaaS tools):
- Hierarchy of concerns from `ux-design` applies in full: Function > Clarity > Accessibility > Feedback > Efficiency > Consistency > Aesthetics.
- Typography: system fonts, established UI families (Inter, SF Pro, system-ui) are appropriate. Legibility and scalability over expressiveness.
- Color: semantic tokens, consistent palette, WCAG-compliant contrast.
- Layout: predictable grid, consistent spacing scale (multiples of 4 or 8), auto-layout-friendly structures.
- Motion: functional only. State transitions, loading indicators, feedback animations. No decorative motion.
- Goal: the interface should feel invisible. Users accomplish tasks without noticing the UI.

**Marketing / expressive interface** (landing pages, portfolios, promotional pages, one-off campaign pages):
- Aesthetics and differentiation move higher in priority (but Function and Accessibility remain non-negotiable).
- Typography: distinctive display fonts paired with refined body fonts. Characterful choices encouraged.
- Color: bold palettes, dominant colors with sharp accents. Cohesive mood over strict token adherence.
- Layout: asymmetry, overlap, diagonal flow, grid-breaking elements, generous negative space.
- Motion: choreographed page loads with staggered reveals, scroll-triggered animations, hover states that surprise.
- Goal: memorable and distinctive. The interface itself is part of the message.

**If the user doesn't specify context**, infer from the request. Component libraries, app screens, and tool-like interfaces default to product. Landing pages, portfolio pieces, and showcase projects default to marketing. When ambiguous, ask.

---

## Design System Awareness

When building product interfaces, respect design system conventions:

**Spacing**
- Use a consistent scale: 4, 8, 12, 16, 24, 32, 48, 64. Map to CSS custom properties.
- Never use arbitrary values (7px, 13px, 22px) without explicit justification.

**Typography**
- Define a type scale as CSS variables. Reference by semantic role (`--text-body`, `--text-heading-sm`), not raw values.
- Line height: 1.5x for body, 1.2-1.3x for headings.
- Ensure the type scale works at the smallest breakpoint before scaling up.

**Color**
- Define colors as semantic tokens: `--color-text-primary`, `--color-surface-elevated`, `--color-action-primary`.
- Never hardcode hex values inline when a token system is being used.
- Verify contrast ratios against WCAG AA for every text/background combination in the implementation.

**Components**
- If the code generates a component that maps to an existing design system pattern (button, input, card, modal), match the established API: same sizes, same states, same variant names.
- Document interactive states in code: default, hover, focus-visible, active, disabled, loading, error.

---

## Implementation Standards

**Accessibility in code (non-negotiable):**
- Semantic HTML: `button` for actions, `a` for navigation, `input` with associated `label`, headings in order.
- Focus management: visible `:focus-visible` states, logical tab order, no keyboard traps.
- ARIA only when semantic HTML is insufficient. Prefer native elements.
- Color is never the sole indicator: pair with icons, text, or patterns.
- Touch targets: 44x44px minimum for interactive elements on touch-capable interfaces.

**Responsive approach:**
- Mobile-first as content priority, not just CSS methodology. Start with the smallest viewport to force prioritization.
- Breakpoints defined by content needs, not device names. "When the sidebar no longer fits" is a better breakpoint than "768px."
- Test: does the layout break at any intermediate width, or only at defined breakpoints?

**Performance considerations:**
- Fonts: limit to 2 families maximum. Use `font-display: swap`. Subset when possible.
- Images: specify dimensions to prevent layout shift. Use responsive images (`srcset`) when applicable.
- Animations: prefer `transform` and `opacity` (composited properties). Avoid animating `width`, `height`, `top`, `left`.

---

## Code Quality

- CSS custom properties for all design tokens (color, spacing, typography, radii, shadows).
- Logical structure: HTML reflects content hierarchy, not visual layout hacks.
- Comments only for non-obvious decisions: "why", not "what."
- No dead code, no placeholder comments like `<!-- TODO -->` in deliverables.

---

## What to Avoid

- **Generic AI aesthetics**: gratuitous gradients, purple-on-white schemes, over-rounded corners on everything, shadow-heavy cards with no purpose. Every visual choice needs a reason.
- **Decorative complexity in product UI**: grain overlays, mesh gradients, and noise textures belong in marketing contexts, not in app screens where they add visual noise without information.
- **Font monoculture across projects**: vary typographic choices between unrelated projects. Defaulting to the same display typeface regardless of context produces a homogeneous output. Every project should justify its type choices against its own goals, not inherit them from the previous one.
- **Styling over structure**: a beautiful component that doesn't handle empty states, error states, or overflow is incomplete. Build states first, style second.

---

## Output

When generating frontend code:
1. Single file unless the user requests otherwise (inline CSS/JS in HTML, or single React component with Tailwind).
2. Working code that can be rendered immediately.
3. If the code implements a design the user previously discussed or shared, reference the design decisions explicitly in the implementation (e.g., "using the 8px spacing scale from your system" or "this maps to the secondary button variant").
4. If accessibility or functional issues exist in the requested design, flag them before implementing rather than silently reproducing problems.
