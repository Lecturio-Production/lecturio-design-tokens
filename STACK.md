# Lecturio Tool Stack — Mandatory Tech Picks

Every internal Lecturio tool uses the same baseline stack. This is **not** a recommendation — it's a contract. Variations need explicit cross-team coordination, not solo choices.

The point: a developer moving from one tool to another should find familiar bones. New tools take a day to scaffold, not a week.

---

## The stack

| Layer | Pick | Notes |
|---|---|---|
| **Framework** | React 19 | Either Next.js (App Router) for full-stack tools or Vite + React Router for pure-frontend tools. Pick based on whether you need SSR/server actions/route handlers. |
| **Language** | TypeScript, `strict: true` | Plain JS is not allowed in shipped code. |
| **Styling** | Default: Tailwind CSS (v3.x) + this design-tokens repo. Alternative: Plain CSS + `tokens.css` (allowed for lightweight Vite SPAs, prototypes, embedded renderers). | Two sanctioned paths — see `STYLEGUIDE.md` "Two sanctioned styling paths". CSS-in-JS (styled-components, emotion, vanilla-extract) is forbidden in **both** paths. |
| **Shell components** | `design-tokens/react/` (`LecShell`, `LecShellHeader`, `LecShellFooter`, `LecPageHeader`) | Source-only React components for the standard app frame. Don't roll your own header — wire up the existing one with your tool's `navItems` and slots. |
| **UI primitives** | Radix UI primitives (unstyled) | Use Radix for dialogs, dropdowns, tooltips, popovers, etc. Style them with Tailwind utilities and the design-tokens. shadcn/ui as a starting point is fine; tokens-from-this-repo override its defaults. |
| **Icons** | Lucide React (`lucide-react`) | Default size 16px. No emojis, no SVG-by-hand for stock icons, no FontAwesome, no Material Icons. |
| **Fonts** | Noto Sans (variable) | Loaded automatically by `tokens.css` from Google Fonts. Don't add custom font loaders. |
| **Forms** | React Hook Form + Zod | When forms get nontrivial. For a single-input form, raw `useState` is fine. |
| **Data fetching** | Native `fetch` + Server Components or Server Actions (Next.js) / TanStack Query (Vite) | No Apollo, no SWR. |
| **State** | React state + Context. Zustand if shared global state really exists. | No Redux. No MobX. |
| **Routing** | Next.js App Router or React Router | Whichever the framework dictates. |
| **Auth** | NextAuth v5 (Google, `@lecturio.de` only) for tools that need their own login. Most tools don't — they live behind the orchestrator's tools-gateway. | The bootstrap-token flow (Ed25519) is described in the orchestrator's `docs/ARCHITECTURE.md`. |
| **DB** | PostgreSQL + Prisma 5 (when persistence is needed) | Each tool owns its own DB. No shared schema across tools. |
| **Deployment** | Railway via `Containerfile` | Build context excludes `.git`, so any submodule init must happen in the Containerfile (see `README.md`). |
| **Observability** | Plain stdout/stderr. Railway's log viewer is the default. | No external APM in tool services unless explicitly justified. |

---

## What this gives you

- **Consistent muscle memory across tools.** Same imports, same hooks, same patterns.
- **Centralized brand.** Tailwind preset + `tokens.css` mean a brand change ripples through every tool with one submodule bump.
- **Battle-tested set.** Every choice here is mainstream React-ecosystem; no obscure picks.
- **Predictable bundle size.** No competing UI libs (Material UI vs Chakra vs Mantine).

---

## What this rules out

- **Vue, Svelte, SolidJS** for tool UIs (we standardize on React).
- **Tailwind v4** until the design-tokens preset has been validated against it.
- **CSS-in-JS** in any form (styled-components, emotion, vanilla-extract). Forbidden on both Path A (Tailwind) and Path B (Plain CSS). Even "just for one component."
- **Tool-local color/typography overrides.** Extend the preset (Path A) or add to `components.css` upstream (Path B) — never hardcode brand values per tool.
- **Mixing Path A and Path B inside one tool.** Pick one per codebase.

---

## When you really need an exception

Open a discussion in the Lecturio dev channel before deviating. The default answer is "no, fit it into the stack." But there are legitimate cases (e.g. an embedded WebGL tool with a different rendering pipeline). Document the exception in the consuming tool's `CLAUDE.md` so future contributors know why.

---

## Bootstrapping a new tool — checklist

The fastest path is the bootstrap script — it adds the submodule, picks a path interactively, patches your stylesheet, and writes the `**Styling path:**` line into your `CLAUDE.md`:

```bash
cd ~/code/<your-tool>
bash <(curl -sL https://raw.githubusercontent.com/Lecturio-Production/lecturio-design-tokens/main/scripts/bootstrap-tool.sh)
```

The manual checklists below describe what the script does, in case you need to do it by hand or audit the output.

### Path A: Tailwind + Preset (default)

1. `npx create-next-app@latest` (or `npm create vite@latest` for Vite tools) — TypeScript, Tailwind.
2. `git submodule add https://github.com/Lecturio-Production/lecturio-design-tokens.git design-tokens`
3. Update `tailwind.config.ts`:
   ```ts
   import lecturioPreset from "./design-tokens/tailwind-preset.cjs";
   export default { presets: [lecturioPreset], content: [...] };
   ```
4. Update `src/app/globals.css` (or equivalent):
   ```css
   @import "../../design-tokens/tokens.css";
   @import "../../design-tokens/components.css";
   @tailwind base; @tailwind components; @tailwind utilities;
   ```
5. Add the submodule-init block to your `Containerfile` — copy from `design-tokens/templates/Containerfile.submodule-init`.
6. Install `lucide-react`, `@radix-ui/*` as you need them.
7. Add to your tool's `CLAUDE.md`: `**Styling path:** Tailwind + Preset`.
8. Read `STYLEGUIDE.md` before writing any UI.

### Path B: Plain CSS + tokens.css (lightweight)

Use when: Vite SPA without Tailwind build, prototype tool, embedded renderer.

1. `npm create vite@latest` (TypeScript template).
2. `git submodule add https://github.com/Lecturio-Production/lecturio-design-tokens.git design-tokens`
3. In your main stylesheet (e.g. `src/App.css`):
   ```css
   @import "../design-tokens/tokens.css";
   @import "../design-tokens/components.css";
   ```
4. Style app-local rules with `var(--*)` tokens — never hardcode brand values.
5. Install `lucide-react` for icons.
6. Add to your tool's `CLAUDE.md`: `**Styling path:** Plain CSS + tokens.css (no Tailwind)`.
7. Read `STYLEGUIDE.md` (Path B section) before writing any UI.

If the result looks like a Lecturio tool out of the box, you did it right. If it doesn't, something's miswired — usually the preset isn't being loaded (Path A) or `tokens.css` isn't imported (Path B).
