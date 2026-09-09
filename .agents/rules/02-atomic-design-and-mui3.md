# 02 — Atomic Design & Material UI 3 Expressive System

> **Part of AptiTek-02 Architecture Guides**  
> **Master Index:** [ARCHITECTURE.md](file:///home/aptitek/50-59_Code/51_Websites/aptispace-lms-04/ARCHITECTURE.md)

---

## 1. The 7-Tier Architecture Model

AptiTek-02 organizes all UI code into a strict **Atomic Design** hierarchy adapted for the **Material UI 3 Expressive** framework. Every component lives at an explicit layer with enforced unidirectional import boundaries.

```
┌────────────────────────────────────────────────────────────────────────┐
│  Tier 5: Routes / Pages       src/routes/*                             │
├────────────────────────────────────────────────────────────────────────┤
│  Tier 4: Templates            src/components/templates/*               │
├────────────────────────────────────────────────────────────────────────┤
│  Tier 3: Organisms            src/components/organisms/*               │
├────────────────────────────────────────────────────────────────────────┤
│  Tier 2: Molecules            src/components/molecules/*               │
├────────────────────────────────────────────────────────────────────────┤
│  Tier 1: Atoms                src/components/atoms/*                   │
├────────────────────────────────────────────────────────────────────────┤
│  Tier 0: Tokens & Utilities   src/tokens/* • src/utils/*               │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Layer Definitions & Responsibilities

### 2.1 Tokens (`src/tokens/`)

- **Role:** Pure design tokens, Solarized palette primitives, typography scales, elevation levels, and spacing metrics.
- **Rules:** No React components. Only constants, theme definitions, and type declarations.

### 2.2 Atoms (`src/components/atoms/`)

- **Role:** Foundational, single-purpose UI primitives that cannot be broken down further without losing meaning.
- **Examples:** `Button`, `CardSurface`, `Galaxy` (3D cosmos background), `Typography`, `Input`, `Avatar`, `Badge`, `Icon`.
- **MUI3 Expressive Integration:** Built using `styled` from `@mui/material/styles` with rounded geometry, soft elevation, and Solarized theme token consumption.
- **Allowed Imports:** `tokens`, `utils/shared`, other `atoms`.
- **Forbidden Imports:** `molecules`, `organisms`, `templates`, `routes`.

### 2.3 Molecules (`src/components/molecules/`)

- **Role:** Functional combinations of atoms acting together as a single unit with cohesive behavior.
- **Examples:** `SearchBar` (Input + Search Button), `FormField` (Label + Input + ErrorText), `CourseProgressBadge` (ProgressRing + Label), `UserChip` (Avatar + Name).
- **Allowed Imports:** `atoms`, `tokens`, `utils/shared`, other `molecules`.
- **Forbidden Imports:** `organisms`, `templates`, `routes`.

### 2.4 Organisms (`src/components/organisms/`)

- **Role:** Distinct, self-contained sections of an interface combining molecules and atoms into functional widgets.
- **Examples:** `Header` / `NavBar`, `CourseCardGrid`, `LessonSidebar`, `GalaxyBackgroundLayer`, `HolographicCardDeck`.
- **Allowed Imports:** `organisms`, `molecules`, `atoms`, `tokens`, `utils/shared`.
- **Forbidden Imports:** `templates`, `routes`.

### 2.5 Templates (`src/components/templates/`)

- **Role:** Page-level layout skeletons, grid structures, and slot-based scaffolding. They place organisms and molecules into cohesive layouts without binding to live application data.
- **Examples:** `DashboardLayout`, `CourseOverviewLayout`, `LessonPlayerLayout`, `SettingsLayout`.
- **Allowed Imports:** `templates`, `organisms`, `molecules`, `atoms`, `tokens`, `utils/shared`.
- **Forbidden Imports:** `routes` (Pages).

### 2.6 Routes / Pages (`src/routes/`)

- **Role:** React Router v8 route modules. They handle route params, data loaders, actions, state orchestration, and render the appropriate template with live data.
- **Examples:** `routes/home.tsx`, `routes/courses.$id.tsx`, `routes/dashboard.tsx`.
- **Allowed Imports:** All layers (`templates`, `organisms`, `molecules`, `atoms`, `tokens`, `utils/shared`).

---

## 3. Material UI 3 (MUI3) Expressive Framework Principles

Material UI 3 Expressive emphasizes:

1. **Dynamic Shapes & Generous Radii:** Expressive rounded corners (`borderRadius: 12px` to `24px` on surfaces, cards, and interactive chips) creating a friendly, casual, yet sleek modern feel.
2. **Soft Depth & Layering:** Subtle shadows blended with Solarized background tones (`base03`/`base02` in dark mode, `base3`/`base2` in light mode) rather than harsh black drop shadows.
3. **Harmonious Color Roles:** Color applied purposefully to guide user attention (Solarized Blue for primary actions, Cyan/Violet for secondary flair, Orange/Yellow for warnings/milestones).
4. **Fluid Micro-Interactions:** Delightful hover states, smooth scaling, and spring physics transitions.

---

## 4. ESLint Layer Boundary Enforcement

Boundaries are strictly validated by `eslint-plugin-boundaries` in [eslint.config.js](file:///home/aptitek/50-59_Code/51_Websites/aptispace-lms-04/eslint.config.js).

```typescript
// Dependency policy matrix in eslint.config.js
settings: {
  "boundaries/include": ["src/**/*"],
  "boundaries/elements": [
    { type: "atoms", pattern: "atoms/*", base: "src/components" },
    { type: "molecules", pattern: "molecules/*", base: "src/components" },
    { type: "organisms", pattern: "organisms/*", base: "src/components" },
    { type: "templates", pattern: "templates/*", base: "src/components" },
    { type: "pages", pattern: "routes/*", base: "app" },
    { type: "tokens", pattern: "tokens/*", base: "app" },
    { type: "shared", pattern: "utils/*", base: "app" },
  ],
}
```

> [!CAUTION]
> **Violation Example:**
>
> ```typescript
> // In src/components/atoms/Button/Button.tsx
> import { SearchBar } from "~/components/molecules/SearchBar"; // ❌ ESLint ERROR: Atoms cannot import Molecules
> ```
