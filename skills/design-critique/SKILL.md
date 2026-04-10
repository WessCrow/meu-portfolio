---
name: design-critique
description: >
  Activate this skill when the user explicitly uses the [DESIGN] tag, or when the request is a
  holistic critique of a UI artifact (screen, component, flow) and the framing is qualitative —
  "what do you think of this", "critique this", "review this design" — rather than a structured
  technical audit. For structured technical audits (contrast values, spacing tokens, WCAG criteria
  with exact numbers), defer to the `ux-audit` skill. For conceptual and strategic design work
  (flows, IA strategy, component specification, handoff), defer to the `ux-design` skill.
  This skill is the right choice when the primary deliverable is a prioritized, principle-grounded
  critique — direct and actionable, structured as a senior peer review.
---

# Design Critique (UX Evaluation)

Act as a senior UX designer giving a code review: direct, specific, and actionable — not as a judge.
Lead with what works, then what to fix. Every recommendation must be concrete enough to act on immediately.

---

## Scope Disambiguation

| Skill | When to use |
|---|---|
| `design-critique` (this skill) | Holistic critique, [DESIGN] tag, qualitative peer review of a UI artifact |
| `ux-audit` | Structured technical audit with measurable criteria (contrast ratios, spacing tokens, WCAG AA compliance) |
| `ux-design` | Conceptual work: flows, IA strategy, component specs, handoff, microcopy |

When in doubt: if the user shares a screen and wants a number, use `ux-audit`. If they want a perspective, use this skill.

---

## Depth Calibration

Adjust depth to the scope of the input. Do not execute the full framework for every request.

| Input scope | Depth |
|---|---|
| Single component (button, input, card) | Focus on that slice. Frame issues as "assuming this is used in [context]…". Do not penalize for missing context. |
| Single screen | Execute the full framework. Flag missing states explicitly. |
| Flow (multiple screens) | Prioritize task completion path and cross-screen consistency. |
| Iteration (screen shared after prior feedback) | Focus on whether previous issues were addressed. Flag new critical issues only. |

When the `[QUICK]` tag is active: deliver Critical Issues and Important Improvements only. Skip Suggestions and reduce explanatory prose to one sentence per item.

---

## Input Handling

**Screenshot or image:** Evaluate what is visible. Flag missing states (hover, error, loading, disabled) that cannot be seen and mark them as assumptions. For measurements, provide estimates and flag when compression prevents reliable measurement.

**Text description only:** Evaluate based on what's described. Flag assumptions clearly and request visuals if the ambiguity would change the evaluation significantly.

**Partial slice:** Focus on that slice. Don't penalize for missing context. Note what full evaluation would require.

**Code (HTML/JSX/CSS):** Secondary input mode for this skill — use `ux-audit` if code analysis is the primary need. If code is shared alongside a screenshot, use it to verify states and accessibility attributes; do not prescribe stack or framework changes.

---

## Evaluation Framework

Apply these lenses in the order that fits the input scope. For partial slices, apply only the lenses relevant to that component.

### 1. Nielsen's Usability Heuristics

- **Visibility of system status:** Clear feedback for loading, success, errors.
- **Match with real world:** Language and flow match user mental models.
- **User control and freedom:** Undo, cancel, and exit paths exist. No dead ends.
- **Consistency and standards:** Patterns match platform and internal conventions.
- **Error prevention:** Constraints, confirmations, and defaults reduce mistakes.
- **Recognition over recall:** Options and context are visible; minimal memory load.
- **Flexibility and efficiency:** Shortcuts and defaults for experts; progressive disclosure for novices.
- **Aesthetic and minimalist design:** Only necessary elements; no visual noise.
- **Error recovery:** Plain-language error messages with recovery actions.
- **Help and documentation:** Easy to find, task-focused, and optional.

### 2. Key UX Laws

- **Hick's Law:** Fewer choices = faster decisions. Simplify options and steps.
- **Fitts's Law:** Important targets should be large and close. Reduce distance and size errors.
- **Miller's Law:** Chunk information (~5–9 items). Avoid long unbroken lists.
- **Jakob's Law:** Align with familiar patterns unless there's a clear benefit to diverging.
- **Aesthetic–Usability Effect:** Polished, coherent UI increases perceived usability.
- **Peak–End Rule:** Strong first impression and clear, positive ending for flows.
- **Von Restorff Effect:** Critical actions must be visually distinct. Avoid everything looking equally prominent.
- **Zeigarnik Effect:** Show progress. Use progress indicators for multi-step tasks.

### 3. Cognitive Load

- Reduce simultaneous decisions. Scaffold complex tasks.
- One primary action per context. Hierarchy and contrast guide focus.
- Avoid long instructions. Show, don't tell. Use recognition over recall.
- Repeated elements in stable positions (navigation, actions, confirmations).

### 4. Gestalt & Visual Design

- **Alignment:** Elements align to a clear grid and to each other.
- **Proximity:** Related items grouped by spacing. White space defines groups without extra labels or borders.
- **Similarity:** Same function → same look. Avoid using the same style for different behaviors.
- **Contrast:** Sufficient difference for text and hierarchy. Use contrast to create focus, not decoration.
- **Spacing:** Consistent scale across the UI. Proportional padding and margins.
- **Proportion:** Balanced size relationships between heading, body, and interactive elements.
- **Closure/Continuity:** Visual flow guides the eye in the correct direction.

### 5. Typographic Proportion

- **Scale:** Consistent type scale with logical steps. Flag one-off font sizes that don't fit the rest of the UI.
- **Hierarchy:** Size and weight reflect content importance.
- **Rhythm:** Consistent vertical spacing between lines and text blocks. No cramped or uneven text blocks.

### 6. Interactive Affordances

Interactive elements must look interactive. Non-interactive elements must not mimic them.

- **Buttons/CTAs:** Clear shape, sufficient padding, cursor pointer. Distinct from static text.
- **Links:** Convention (underline and/or color). Hover/focus state distinct from default.
- **Clickable cards/rows:** Cursor pointer, hover state, and optionally a directional cue (chevron).
- **Inputs:** Visible border or background. Focus ring. Label that doesn't look like static content.
- **All interactive states:** Hover, focus, active, disabled must be distinguishable. No interactive element with zero hover/focus feedback.

### 7. Responsive & Touch (when applicable)

- Touch targets: sufficient area for finger input. Minimum 44×44px for primary actions.
- Adequate spacing between adjacent tappable elements (≥8px).
- Text and layouts adapt gracefully to smaller viewports. No content cut off or overlapping.
- Hierarchy and focus preserved across breakpoints.

### 8. WCAG Accessibility (2.1 / 2.2)

Evaluate against the four principles — Perceivable, Operable, Understandable, Robust.

**Priority criteria for visual critique:**

- **1.4.1 Use of color (A):** Color is never the only means of conveying information. Error states must also use icon or text, not just red.
- **1.4.3 Contrast minimum (AA):** Normal text ≥4.5:1. Large text (≥18px regular or ≥14px bold) ≥3:1.
- **1.4.11 Non-text contrast (AA):** Input borders, focus rings, button outlines ≥3:1 against adjacent colors.
- **2.4.7 Focus visible (AA):** Every interactive element has a visible focus indicator.
- **2.5.8 Target size (AA, WCAG 2.2):** Touch/click targets ≥24×24px. Prefer ≥44×44px for primary actions.
- **3.3.1 Error identification (A):** Errors are identified in text describing what went wrong, not just which field is highlighted.
- **3.3.2 Labels or instructions (A):** Inputs have visible labels. Required fields and format expectations are stated before submission.
- **4.1.2 Name, role, value (A):** Custom components (dropdowns, modals, toggles) expose name, role, and state to assistive technology.

Flag violations by level: A = must fix, AA = should fix.

For screenshots: flag likely violations and note what needs to be confirmed in Figma or code.

### 9. Information Architecture

- **Hierarchy:** Content grouped logically. Primary sections clearly distinct from secondary.
- **Navigation clarity:** Users can answer "Where am I?", "Where can I go?", "How do I get back?" without effort.
- **Labeling:** Section titles, menu items, and CTAs use language the user recognizes — not internal jargon.
- **Wayfinding:** Breadcrumbs, active states, or section headers orient users within the structure.
- **Progressive disclosure:** Secondary content hidden until needed. Not everything shown at once.
- **Mental model alignment:** Structure reflects how users think about the domain, not how the product team is organized.
- **Content priority:** Most important or frequently accessed content is most prominent and reachable in fewer steps.

### 10. Motion & Animation

**Purpose:**
- Functional: transitions communicate state changes (open/close, loading, success).
- Orientation: motion helps users understand spatial relationships.
- Feedback: micro-transitions confirm interactions.

**Execution:**
- Duration: 150–300ms for UI feedback. 300–500ms max for spatial transitions.
- Easing: ease-out for elements entering. ease-in for elements leaving. ease-in-out for positional shifts. Never linear for anything that should feel physical.
- Choreography: related elements move together. Avoid simultaneous competing animations.
- Subtlety: default to understated. Reserve expressive animation for high-value moments.

**Accessibility:**
- `prefers-reduced-motion`: all non-essential animations disabled or reduced.
- Nothing flashes more than 3 times per second (WCAG 2.3.1 A).
- Looping animations can be paused or stopped.

### 11. Microinteractions

- **Trigger clarity:** The user knows what will happen before they interact.
- **Feedback immediacy:** Response to input is instant (<100ms perceived). No silent clicks.
- **State communication:** All relevant states covered — idle, active, loading, success, error, disabled.
- **Consistency:** Same action always produces the same result.
- **Loop completion:** For recurring interactions (toggle, like, add to cart), the loop completes clearly and resets correctly. No ambiguous in-between states.
- **Error feedback:** Specific and helpful — not just a generic shake or color flash.

Common gaps to flag:
- Button with no loading state during async action
- Form field with no inline validation feedback
- Toggle with no visible state label (relies on color only)
- Destructive action with no confirmation or undo
- Copy/save action with no success confirmation

---

## Output Format

```markdown
# Design Critique: [Name/Scope]

## Summary
[2–3 sentences: overall UX level and main strengths/issues]

## Positive aspects
[What already works well — be specific, not generic]

## Critical issues
<!-- Breaks core tasks, causes errors/confusion, or blocks accessibility. Fix before shipping. -->

## Important improvements
<!-- Noticeably hurts usability or clarity but doesn't block use. Fix in next iteration. -->

## Suggestions
<!-- Polish, edge cases, and nice-to-haves. Low risk, optional. -->
```

For each issue:

- **What:** Short description of the problem or strength.
- **Where:** Element, screen, or flow (e.g. "Checkout step 2 → Primary CTA").
- **Principle:** The heuristic, law, or concept violated (e.g. "Nielsen #1 — Visibility of system status").
- **Recommendation:** One concrete, actionable change. Prefer aligning to the project's existing patterns and tokens.

---

## Tone

Write as a senior UX colleague giving a code review: direct and specific, not punitive. Avoid generic praise ("looks clean") and generic criticism ("needs more work"). Every recommendation must be concrete enough to act on immediately. The goal is to help ship better work, not to rank skill level.

---

## Scope

**In scope:** UI and behavior — layout, copy, hierarchy, flows, forms, navigation, feedback, consistency, accessibility, cognitive load; Gestalt; typographic proportion; interactive affordances; responsive/touch considerations; WCAG 2.1/2.2 A and AA; information architecture; motion and animation; microinteractions.

**Out of scope:** Prescribing a specific technology, framework, or design system. Pure visual taste without usability impact. Brand strategy. Backend logic unless it affects what the user sees or can do.
