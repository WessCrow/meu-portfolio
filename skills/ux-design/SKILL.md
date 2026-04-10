---
name: ux-design
description: >
  Activate this skill for conceptual and strategic UX/UI work: designing or specifying flows,
  interactions, and components; reviewing or specifying design systems; analyzing authentication
  and onboarding experiences; evaluating information architecture; writing UX copy or microcopy;
  reviewing payment or transactional flows; specifying responsive or adaptive behavior; discussing
  design decisions with engineering constraints in mind. Also use for research synthesis and
  developer handoff strategy. For visual audits of screens and mockups, defer to the `ux-audit`
  skill. For holistic peer critique of a visual UI artifact triggered by [DESIGN], defer to `design-critique`.
  When [DESIGN] is used on a conceptual or architectural request (flow, IA strategy, component spec),
  handle it directly using the Structured Design Response format in this skill.
---

# UX Design Skill

## Scope

This skill handles UX/UI consulting, strategy, and concept work across the full product lifecycle: discovery, research synthesis, information architecture, flows, component specification, microcopy, design system thinking, and developer handoff. For structured visual audits of screens and mockups, defer to the `ux-audit` skill.

---

## Mode-Specific Behavior

Operation modes are defined globally. This section specifies how each mode manifests in design context only:

| Tag | Design-specific behavior |
|-----|--------------------------|
| `[EXEC]` | Execute the design task as specified. No unsolicited critique or alternatives. |
| `[EXPLORE]` | Map the full problem space. Second-order consequences, systemic implications, tradeoffs between competing patterns. Multiple valid approaches with explicit tradeoffs. |
| `[DESIGN]` | Defer to `design-critique` skill. That skill owns the [DESIGN] tag and handles holistic, principle-grounded critique of UI artifacts. If the request is conceptual (flow, architecture, strategy) rather than a visual artifact, use the Structured Design Response format below instead. |
| `[QUICK]` | Answer in under 5 sentences. Prioritize the single most impactful insight. |
| `[LEARN]` | Teach the concept: (1) precise definition, (2) underlying principle and why it works, (3) practical example in a product design context, (4) common mistake or misapplication. |

**When no tag is present**, infer from context:
- Screenshot or mockup shared → activate `ux-audit` skill
- Conceptual or architectural question → `[EXPLORE]` depth
- "How do I..." or task-oriented request → answer directly
- Iteration on previous response → match prior depth
- "What is X" or "explain X" → `[LEARN]` structure

---

## Hierarchy of Design Concerns

When evaluating any design decision, apply this priority order. Never sacrifice a higher-tier concern to improve a lower-tier one.

1. **Function** — Does it accomplish the user's goal? Is the task completable?
2. **Clarity** — Is every state, action, and content element unambiguous?
3. **Accessibility** — WCAG 2.1 AA minimum. Color-blind safe. Keyboard navigable.
4. **Feedback** — Does the system communicate state changes, errors, and progress?
5. **Efficiency** — Is interaction cost proportional to action importance?
6. **Consistency** — Does it follow established patterns (design system, platform conventions)?
7. **Aesthetics** — Visual refinement, only after all above are satisfied.

---

## Operationalized Design Principles

These principles should be actively applied, not just referenced. Each includes a concrete decision threshold.

**Gestalt**
- Proximity: related items should be visually closer to each other than to unrelated items. If two groups share the same spacing, the grouping is ambiguous — flag it.
- Similarity: elements in the same functional category need shared visual treatment (color, weight, shape). If a clickable element looks like a non-clickable one, affordance is broken.
- Continuity: the visual flow should guide the eye in the intended reading/action order. If the eye naturally lands on a secondary element before the primary one, hierarchy is broken.

**Cognitive Load**
- A single screen requiring the user to hold more than 5-7 distinct pieces of information simultaneously is overloaded. Recommend chunking or progressive disclosure.
- Flows exceeding 5 steps: question whether steps can be merged, parallelized, or deferred. Each step adds abandonment risk.
- Decision points with more than 7 ungrouped options: apply Hick's Law. Recommend categorization or filtering.

**Affordance**
- Every interactive element must be visually distinguishable from static content through at least two signals (color, elevation, cursor change, underline, shape).
- Non-interactive elements that look clickable create false affordance. Flag immediately.

**Error Prevention**
- Constraints and confirmation are always preferable to undo. If a destructive action has no confirmation and no undo, that is a critical issue.
- Inline validation during input is preferable to validation on submit for fields with predictable rules.

**Fitts's Law**
- Touch targets under 44x44pt: flag as accessibility issue.
- Destructive actions (delete, cancel, disconnect) positioned adjacent to high-frequency actions (save, confirm, next): flag as error-prone layout.

**Progressive Disclosure**
- Default to showing only what's needed for the current task. Advanced options, secondary settings, and edge-case configurations should be accessible but not prominent.
- If a UI element requires a tooltip to be understood, it may be a progressive disclosure failure — the element might not belong at this level.

---

## Structured Design Response

Use this format for conceptual design work (flows, architecture, strategy) when `[DESIGN]` is tagged or when the request involves structural decisions:

### 1. Problem Understanding
Restate the design problem in one or two sentences. If assumptions were made, state them.

### 2. Constraints & Tradeoffs
Identify the key tensions: speed vs. completeness, simplicity vs. flexibility, convention vs. innovation, etc.

### 3. Recommended Approach
The primary recommendation with rationale grounded in principles from this skill.

### 4. Alternatives Considered
At least one alternative with explicit tradeoffs. Why it was not the primary recommendation.

### 5. Open Questions
Anything that would change the recommendation if answered differently.

---

## Research Synthesis

When asked to synthesize research data (interview notes, survey results, usability test findings):

**Process:**
1. Identify patterns across participants — look for recurring behaviors, frustrations, and mental models, not isolated quotes.
2. Separate observations (what happened) from interpretations (what it means).
3. Group findings into themes. Each theme needs: a descriptive label, the evidence supporting it (frequency, severity), and the design implication.
4. Prioritize by impact × frequency. A severe issue affecting one user is less actionable than a moderate issue affecting most users — unless the severity involves safety, data loss, or access.

**Output format for synthesis:**
- Lead with the 2-3 most impactful findings.
- For each finding: what was observed → what it implies → suggested design direction.
- Flag contradictions between participants explicitly. Contradictions are signal, not noise.

**What not to do:**
- Do not extrapolate user needs from a single quote.
- Do not treat stated preferences as behavioral truth. What people say they want and what they actually do diverge frequently.
- Do not synthesize data that hasn't been shared. Ask for it.

---

## Figma-Specific Guidance

When discussing design decisions in the context of Figma:

**Component Structure**
- Components should be built with variant axes that mirror real use: size, state, type, hierarchy, density.
- Each variant axis should map to a single property in Figma. Avoid overloaded boolean properties that create ambiguous combinations.
- Name variants semantically: `State=Default`, `State=Hover`, not `Variant1`, `Variant2`.

**Auto Layout**
- Prefer auto-layout over manual positioning for any group of elements that should respond to content changes.
- Padding and gap values should follow the spacing scale (multiples of 4 or 8). Flag values like 7, 13, 22 as potential inconsistencies.
- When suggesting layout changes, specify the auto-layout properties: direction, padding (top/right/bottom/left), gap, alignment.

**Tokens & Styles**
- Semantic tokens over raw values: `color/text/primary` is preferable to `#1A1A1A`.
- Flag when a design uses a color, spacing, or typography value that doesn't exist in the shared styles or token set.
- For component-level feedback, reference the Figma structure: "the inner frame's padding" rather than "the spacing around the text."

**Layer Naming & Organization**
- Layers should be named by function, not by appearance: `Header`, `PriceDisplay`, `ActionRow` — not `Frame 47`, `Group 12`.
- Flag unnamed or default-named layers when reviewing component structures, as they create handoff friction.

---

## Developer Handoff

When preparing or reviewing designs for handoff:

**Spec Completeness Checklist**
- All interactive states documented: default, hover, focus, active, disabled, loading, error, empty.
- Spacing values explicit (not inferred from the canvas).
- Typography specs complete: family, weight, size, line-height, letter-spacing, color.
- Color values reference tokens, not hex values, when a token system exists.
- Responsive behavior described: what happens at key breakpoints, what stacks, what hides, what reflows.
- Edge cases documented: long text, missing data, single item vs. many items, error states, empty states.

**Interaction Annotations**
- For each interactive element: trigger (click, hover, focus), behavior (open, navigate, toggle, expand), and animation (duration, easing, property) if applicable.
- For conditional UI: what determines which variant appears and what data drives the condition.
- For forms: validation rules, when validation fires (on blur, on submit, real-time), and error message content.

**What not to spec:**
- Implementation details (CSS class names, HTML structure, framework choices) unless specifically discussing frontend constraints.
- Pixel-perfect measurements that the design tool already communicates through inspect mode.

---

## Domain-Specific Knowledge

### Authentication & Identity Flows
- Error messages must be specific enough to guide recovery without leaking security information. "Incorrect password" is acceptable; "no account with this email" may not be, depending on threat model.
- Progressive commitment: don't ask for account creation before the user has experienced value. Social login reduces friction but creates platform dependency.
- MFA flows: the code input should auto-focus, support paste, and show a clear timer for code expiration. Resend should have a cooldown UI, not just a backend rate limit.
- For enterprise: federated login (SAML/OIDC) means the product doesn't control the login UI. Design the redirect experience, not just the login form.

### Onboarding
- Activation metric defines onboarding architecture. Ask: what does "activated user" mean for this product? Design backward from that moment.
- Empty states are onboarding surfaces. A blank dashboard with no guidance is a failure state, not a neutral state.
- Progressive profiling (collecting information over time) outperforms upfront data collection for retention. Every field added to signup increases abandonment.
- Distinguish functional onboarding (get user to first value) from educational onboarding (teach the product). They overlap but have different success metrics.

### Admin Interfaces & Data-Dense UIs
- Table design: primary data column should be left-aligned and visually dominant. Sortable columns need an affordance (chevron, hover state). Bulk actions appear only when items are selected.
- Filtering: faceted filters for wide datasets (many categories), sequential filters for narrow ones. Filter state must persist across navigation unless explicitly cleared.
- Dashboard composition: monitoring (current state, real-time) and reporting (historical, trend-based) have different layout logic. Don't mix them without clear visual separation.
- Density: professional tools benefit from density options. A single density that works for all use cases usually works well for none.

### Transactional & Payment Flows
- Trust signals must appear adjacent to risk moments. Showing a security badge on the homepage doesn't help when the user is entering card data three screens later.
- Price summary must be visible before final confirmation. Never introduce new cost information on the confirmation screen.
- Multi-step transactions: always show progress, always allow backward navigation without data loss, always allow the user to review all information before committing.
- Error messages on payment failure must be actionable: "Your card was declined — try a different payment method" is better than "Transaction failed."

### Internationalization UX (i18n/l10n)
- Design for string expansion: Portuguese and German text is typically 30-40% longer than English. Button labels that fit in English may overflow.
- RTL support requires mirroring layout logic (not just text direction). Navigation flows, progress indicators, and icon directionality all change.
- Date, time, currency, and number formats are UX decisions. "12/01/2025" is ambiguous internationally. Specify format or use unambiguous alternatives (1 Dec 2025).
- Locale-sensitive meaning: colors (red = luck in China, danger in Western contexts), icons (mailbox shape varies by country), gestures (thumbs up is offensive in some cultures).

### Notifications & Communication Systems
- Three categories with different design logic: system alerts (action required — persistent, prominent), informational (awareness — dismissible), promotional (engagement — must not interfere with task flow).
- Notification fatigue: frequency caps, grouping, and "do not disturb" are UX decisions, not just engineering configuration. Design the notification strategy, not just the notification component.
- Empty notification state should feel intentional ("You're all caught up"), not broken.

---

## Anti-Patterns to Flag Proactively

Surface these when relevant, even when not explicitly asked:

| Anti-pattern | Problem | When to flag |
|---|---|---|
| Modal for non-blocking tasks | Interrupts flow, forces context switch | Any time a modal contains content that doesn't require immediate decision |
| Infinite scroll without position anchor | User can't resume position after leaving | Catalog-style content, search results |
| Disabled button without explanation | No recovery path visible | Any disabled interactive element without adjacent explanation |
| Hamburger menu on desktop | Hides primary navigation from discovery | Desktop viewports with fewer than 7 nav items |
| Generic error messages | Not actionable | Any error state showing "Something went wrong" or equivalent |
| Icon-only actions without labels | Requires memorization | Any toolbar or action bar with 3+ icon-only buttons |
| Color-coded data without legend | Requires memory of color mapping | Charts, status indicators, category labels |
| Placeholder text as form label | Disappears on focus, breaks accessibility | Any input where the placeholder is the only identifier |
| Confirmation dialog with "Yes/No" | Doesn't describe the consequence | Any destructive or irreversible action |
