# 07 — Tooling, pnpm & Build Workflow

> **AptiTek-02 Static Website Architecture Guides**

---

## 1. Package Management: Strict `pnpm` Enforcement

**`pnpm` is strictly mandatory for all package operations across the repository.**

> [!CAUTION]
> **Strict Policy:**
>
> - ✅ **USE:** `pnpm add <pkg>`, `pnpm install`, `pnpm run <script>`
> - ❌ **NEVER USE:** `npm install`, `npm run`, `yarn`, `bun`
>
> Running `npm` or `yarn` creates conflicting lockfiles (`package-lock.json`, `yarn.lock`) and breaks the Wireit caching graph.

---

## 2. Wireit Task Graph & Incremental Caching

The project uses [Wireit](https://github.com/google/wireit) to manage task dependencies, input/output fingerprinting, and parallel execution.

```
                  ┌──────────────────────┐
                  │   pnpm run build     │
                  └──────────┬───────────┘
                             │ (depends on)
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ pnpm run typecheck │ │  pnpm run lint  │ │  pnpm run test  │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

### 2.1 Essential Scripts

| Command              | Action                                                                                                        |
| :------------------- | :------------------------------------------------------------------------------------------------------------ |
| `pnpm run dev`       | Starts the Astro development server with HMR on port 4321.                                                    |
| `pnpm run typecheck` | Executes `astro check` followed by strict `tsc --noEmit`.                                                     |
| `pnpm run lint`      | Runs ESLint 10 and Prettier across all code and configs.                                                      |
| `pnpm run test:unit` | Runs Vitest unit tests.                                                                                       |
| `pnpm run test:e2e`  | Runs Playwright E2E browser tests against local dev server.                                                   |
| `pnpm run test`      | Runs both `test:unit` and `test:e2e`.                                                                         |
| `pnpm run knip`      | Runs Knip dead code and unused dependency analysis.                                                           |
| `pnpm run build`     | Runs full verification pipeline (`typecheck` $\rightarrow$ `lint` $\rightarrow$ `test` $\rightarrow$ Astro build). |

---

## 3. Git Workflow & Conventional Commits

- **Husky & Git Hooks:** Husky runs pre-commit verification gates automatically.
  - `.husky/commit-msg`: `pnpm exec commitlint --edit "$1"`
  - `.husky/pre-commit`: `pnpm lint && pnpm typecheck`
  - `.husky/pre-push`: `pnpm test`
- **Commitlint:** All commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

Examples:
feat(atoms): create Solarized ExpressiveCard primitive
fix(tokens): resolve contrast calculation in dark mode
docs(arch): update typography standard to Recursive Casual
test(tokens): add unit tests for spacing scale
```

Allowed Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
