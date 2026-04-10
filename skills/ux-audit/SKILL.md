---
name: ux-audit
description: >
  Conduct comprehensive UX/UI audits of screens, mockups, or design components.
  Trigger this skill whenever the user uploads a screenshot, Figma frame, UI image, or mockup for review,
  OR asks for design feedback, accessibility check, WCAG compliance analysis, usability audit, contrast check,
  design system consistency review, or any variation of "what's wrong with this screen", "review my design",
  "check this interface", "audit this UI", "validate my screens", or "give me feedback on this component".
  Also trigger for questions about WCAG 2.1/2.2, accessibility in design, contrast ratios, touch target sizes,
  visual hierarchy, cognitive load in interfaces, or design standardization.
  Always use this skill when screens or UI elements are present AND feedback is requested — even if the request is casual.
---

# UX Audit Skill

This skill evaluates visual design artifacts: screens, mockups, components, and frames. It produces structured, actionable feedback grounded in measurable criteria. For conceptual design work (flows, strategy, architecture, research), defer to the `ux-design` skill.

---

## Process

When receiving a screen or component for analysis:

1. **Identify context** — product, screen type, component, inferred objective. If ambiguous (platform unclear, state unclear, flow position unknown), state assumptions explicitly before proceeding.
2. **Determine scope** — apply the prioritization matrix below to decide which dimensions get full analysis.
3. **Execute audit** across relevant dimensions.
4. **Output** in the standardized format.

---

## Prioritization Matrix

Not every dimension carries equal weight in every context. Apply the relevant profile:

**Complete screen (standalone or first screen shared):**
Priority order: Usability → Visual hierarchy → Accessibility → Standardization → Responsiveness.

**Component in isolation (button, card, input, modal):**
Priority order: Standardization → Accessibility → Usability → Visual hierarchy.

**Flow review (multiple screens shared in sequence):**
Priority order: Usability (task completion path) → Clarity of progression → Consistency across screens → Accessibility.

**Iteration review (screen shared after prior feedback):**
Focus exclusively on whether previous issues were addressed. Flag new issues only if critical. Do not repeat prior feedback.

---

## Handling Visual Limitations

Screenshots and compressed images introduce measurement uncertainty. Follow these rules:

**When values can be estimated with reasonable confidence** (clear contrast between text and background, visible spacing relationships):
- Provide the estimate and the criterion. Example: "Estimated contrast ~3.5:1, below the 4.5:1 AA minimum for normal text."

**When values cannot be estimated reliably** (compressed image, anti-aliased text, gradient backgrounds, small or unclear elements):
- State the limitation explicitly.
- Provide the criterion the designer should verify in Figma.
- Example: "Text size appears to be around 12-13px but compression makes this uncertain. Verify in Figma: if below 14px bold, the 4.5:1 contrast ratio applies (SC 1.4.3)."

**When context is missing** (don't know if it's mobile or web, unclear if it's a final state or intermediate):
- Ask before auditing if the ambiguity would change the evaluation significantly.
- If the ambiguity is minor, state the assumption and proceed: "Assuming this is a mobile screen based on the aspect ratio."

**When only part of a flow is visible:**
- Audit what's visible. Note that evaluation of task completion, cognitive load across steps, or navigation consistency requires the full flow.

---

## Audit Dimensions

### 1. Accessibility (WCAG 2.1/2.2)

Full criteria reference: https://www.w3.org/WAI/WCAG21/quickref/

**Priority checks:**
- **Text contrast** (SC 1.4.3 — AA): 4.5:1 minimum for normal text, 3:1 for large text (≥18pt regular or ≥14pt bold)
- **UI component contrast** (SC 1.4.11 — AA): 3:1 minimum for borders, icons, and focus indicators
- **Touch target size** (SC 2.5.8 — AA, WCAG 2.2): 24×24px minimum between adjacent clickable targets
- **Touch target size** (SC 2.5.5 — AAA): 44×44px recommended for primary actions
- **Focus indicator** (SC 2.4.7 — AA): visible, with 3:1 minimum contrast against adjacent area
- **Semantic hierarchy** (inferred from visual hierarchy): verify that visual heading scale implies h1>h2>h3
- **Text in images** (SC 1.4.5 — AA): avoid text as image except in logos
- **Motion** (SC 2.3.3 — AAA): verify reduced-motion consideration for animations

**How to report contrast:**
Always include: current estimated ratio, required ratio, and a correction value.
Example:
- PROBLEM: Text `#767676` on `#FFFFFF` → estimated 4.48:1 (below 4.5:1 for AA)
- FIX: Change to `#747474` → 4.60:1 ✓

Reference tools: APCA (https://www.myndex.com/APCA/), WebAIM Contrast Checker (https://webaim.org/resources/contrastchecker/).

---

### 2. Usability

**Cognitive load**
- Options per decision (Hick's Law): >7 ungrouped options = excessive load
- Information density without visual chunking increases processing time
- Redundant labels or instructions that add no information

**Affordance and feedback**
- Clickable elements visually distinct from non-clickable? (color, cursor, underline, elevation)
- Visual feedback for states: hover, active, disabled, loading, error, success?
- Primary CTAs visually dominant over secondary actions?

**Fitts's Law**
- Small targets in high-frequency areas
- Destructive actions (delete, disconnect) adjacent to frequent actions (save, confirm)

**Consistency and mapping**
- Similar actions have similar appearance?
- Labels describe the outcome of the action, not the current state?
- Error messages are specific and guide correction (not just "required field")?

**Gestalt**
- Proximity: related items grouped, unrelated items separated
- Similarity: same-category elements share visual treatment
- Continuity: visual flow guides the eye in correct order
- Figure/ground: primary elements clearly separated from background

See https://www.nngroup.com/articles/ for pattern-specific references.

---

### 3. Visual Hierarchy

- **Type scale**: sizes follow a logical progression? (e.g., 12/14/16/20/24/32)
- **Type weight**: bold/regular/light usage reinforces or contradicts hierarchy?
- **Color as hierarchy**: primary vs. secondary vs. placeholder text follows a consistent contrast scale?
- **Spacing as separation**: padding and gap are proportional to the relational importance of elements?
- **Focal point**: one dominant element per screen? Does the eye know where to start?
- **Action hierarchy**: primary action is the most visually prominent interactive element on screen?

---

### 4. Standardization & Consistency (Design System)

- **Spacing**: values follow a grid/scale (multiples of 4 or 8)? Flag outliers: 7px, 13px, 22px indicate improvisation.
- **Typography**: font/size/weight combinations belong to a defined set or are ad-hoc?
- **Color**: colors used belong to a defined palette? Are there slight variations of the same hue?
- **Border radius**: consistent across similar components?
- **Elevation/shadow**: levels consistent and semantically correct?
- **Icons**: same set, same stroke weight, same grid (16/20/24px)?
- **Component states**: all states defined (default, hover, focus, disabled, error)?

---

### 5. Responsiveness & Platform Context

If platform is identifiable:

**Mobile (iOS/Android)**
- Touch targets 44px minimum per HIG (iOS) and Material (Android)
- Distance between targets ≥8px
- Primary content above the fold or with clear scroll indicator
- Safe areas respected (notch, home indicator, dynamic island)

**Web**
- Breakpoint behavior inferable from layout?
- Information density appropriate for pointer input vs. touch?
- Hover-dependent interactions have touch alternatives?

---

## Output Format — Standard Audit

```
## Context
[product/screen/component + inferred objective + stated assumptions if any]

## What works
[items with technical justification — not praise for its own sake, brief]

## Issues

### [Dimension] — [CRITICAL / IMPORTANT / RECOMMENDED]
**Problem:** [specific description]
**Impact:** [real consequence for the user]
**Fix:** [concrete action with values when applicable]

[repeat per issue]

## Priority Summary
CRITICAL (blocks use or violates AA): [N items]
IMPORTANT (degrades experience): [N items]
RECOMMENDED (quality improvement): [N items]
```

**Severity criteria:**
- **CRITICAL**: violates WCAG AA, prevents task completion, or causes data/context loss
- **IMPORTANT**: significantly degrades experience, violates established best practices, creates recurring confusion
- **RECOMMENDED**: improvement opportunity, minor inconsistency, quality refinement

---

## Output Format — Comparative Audit (A vs B)

Use when two or more versions are shared for comparison:

```
## Context
[what is being compared and the decision to be made]

## Shared strengths
[what both versions do well — avoid repeating per version]

## Shared issues
[problems present in both versions — fix needed regardless of which is chosen]

## Version A — distinct characteristics
[what A does differently, with functional assessment: advantage or disadvantage, and why]

## Version B — distinct characteristics
[what B does differently, with functional assessment: advantage or disadvantage, and why]

## Recommendation
[which version to proceed with and why, or a hybrid approach specifying which elements from each]
[if the decision depends on context not yet shared, state what information would change the recommendation]
```

---

## Behavioral Rules

- **Be specific with values**: not "improve spacing" but "increase gap between label and input from 4px to 8px"
- **When visual measurement is uncertain**: state it's estimated and provide the verification criterion
- **Don't invent problems**: if a dimension is well-executed, say so briefly with justification
- **Prioritize real impact**: a contrast ratio slightly below AA threshold is more critical than a 2px spacing inconsistency
- **Contextualize within the flow**: if it appears to be an intermediate screen in a larger flow, consider that context when evaluating cognitive load and information completeness
- **Ask when necessary**: unknown platform, ambiguous state (loading? empty? error?), or unknown target audience — these change the weight of recommendations

---

## References

- WCAG 2.1 Quick Reference: https://www.w3.org/WAI/WCAG21/quickref/
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- APCA Contrast Tool: https://www.myndex.com/APCA/
- Nielsen Norman Group patterns: https://www.nngroup.com/articles/
