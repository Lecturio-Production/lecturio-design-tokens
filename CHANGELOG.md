# Changelog

All notable changes to the Lecturio design-tokens repo.

Each entry should mention what changed and — for **breaking** changes —
what consuming tools need to do to migrate. Tools pin a specific commit
of this repo via git submodule; bumping the pin should be a deliberate
action informed by this file.

Format: reverse-chronological, grouped by `feat` / `fix` / `refactor` /
`breaking` / `docs`. Date is the commit date.

---

## Unreleased

_Nothing pending._

---

## 2026-05-02

- **`feat`** Add `assets/favicon.png` — canonical Lecturio favicon (29×40 PNG, RGBA). Consuming tools should wire it into their app head/manifest so every Lecturio tool ships with the same brand mark in the browser tab. For Next.js apps: copy or re-export it from `app/icon.png` (App Router auto-discovers); for static pages: `<link rel="icon" type="image/png" href="…/design-tokens/assets/favicon.png">`.

---

## 2026-04-29

- **`feat`** Add `templates/Containerfile.submodule-init` — canonical Docker snippet for fetching the submodule on Railway / CI builds. Update `STACK.md` to reference it instead of "steal from the orchestrator".
- **`feat`** Add `CHANGELOG.md` (this file).
- **`feat`** Add `scripts/check-compliance.sh` — pre-push lint that verifies a consuming tool follows the design-system contract (styling-path declared, `tokens.css` imported, no CSS-in-JS deps).
- **`docs`** Document the two sanctioned styling paths in `STYLEGUIDE.md` and `STACK.md`: Path A (Tailwind + Preset, default) and Path B (Plain CSS + tokens.css, lightweight). CSS-in-JS forbidden on both. Tools must declare `**Styling path:**` on the first line of their `CLAUDE.md`.

## 2026-04-28

- **`feat`** Add `scripts/bootstrap-tool.sh` — one-shot setup script that adds the submodule, prompts for a styling path, patches the main stylesheet, and writes the styling-path declaration into the consuming tool's `CLAUDE.md`. Run via `bash <(curl -sL ...)`.

## 2026-04-27

- **🚨 breaking** Rename CSS class prefix `.lc-*` → `.lec-*` and React component prefix `Lc*` → `Lec*` for clarity. **Migration:** in every consuming tool, run a project-wide search-and-replace of `lc-` → `lec-` (with word boundary) and `Lc[A-Z]` → `Lec[A-Z]`. Bump the submodule pin AFTER the rename, never before — otherwise build fails with stale class references.
- **`feat`** Add `LecCard` + `LecCardGrid` React components for the standard card pattern.
- **`feat`** Add `.lec-card-duration` and `.lec-card-objective` CSS primitives to align with SceneEditor card pattern.
- **`feat`** Equalize `lec-card-grid` item heights via `.lec-card-link` helper class — cards in the same row now stretch to the tallest one.
- **`fix`** `LecCard` is now server-component-safe (no event handlers attached internally). Wrap it in a `<Link>` or `<button>` for interactivity.

## 2026-04-26

- **`feat`** Bundle the canonical Lecturio logo (`assets/logo.png`) and resolve it in `LecShellHeader` via `import.meta.url`. Tools no longer need to provide a logo path — `brand={{ productName: "MyTool" }}` is enough.
- **`feat`** Add brand pattern: logo + thin divider + product name in the shell header. Matches the SceneEditor pattern.
- **`feat`** Export `lecturioLogoSrc` for tools that need to render the logo outside the standard header (login splash, footer, error pages).

## 2026-04-25

- **`feat`** Add `react/` source-only React components: `LecShell`, `LecShellMain`, `LecShellHeader`, `LecShellFooter`, `LecPageHeader`. Pluggable `LinkComponent` and `ImageComponent` props for framework-independence (Next.js, React Router, plain `<a>`).
- **`feat`** Add `STACK.md` — the mandatory tech stack contract.
- **`feat`** Add `tailwind-preset.cjs` — Tailwind preset wiring tokens to shadcn-style utility names (`bg-primary`, `text-muted-foreground`, `shadow-card`, …). Consuming tools include it via `presets: [lecturioPreset]`.
- **🚨 breaking** STYLEGUIDE.md flips the Tailwind position: Tailwind is now the **default** styling layer (was: forbidden). Tools should add the preset to their `tailwind.config.ts`. **Migration:** drop any local shadcn-style HSL `--primary` etc. from your `globals.css`; let the preset handle it.
- **`feat`** Add `.lec-shell-footer` CSS primitive for the optional bottom strip.

## 2026-04-24

- **`feat`** Initial extraction from the SceneEditor prototype: `tokens.css`, `components.css`, `STYLEGUIDE.md`, `preview.html`. Set up as a separate git repo, consumed via submodule.
