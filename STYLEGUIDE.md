# Lecturio Design System

This is the visual standard for all internal Lecturio tools. It is **not negotiable** without explicit design coordination — consistency across tools is the whole point.

If you're an AI agent: read this entire file before generating UI. Apply the patterns literally; do not invent variations of buttons, cards, or color schemes.

---

## Files

- **`tokens.css`** — CSS custom properties: colors, shadows, typography, radii. Import in your app's stylesheet (gives runtime access to `var(--primary)` etc. for the `.lec-*` primitives and any plain CSS). Used by **both** styling paths.
- **`tailwind-preset.cjs`** — Tailwind preset that wires the tokens to shadcn-style utility names (`bg-primary`, `text-muted-foreground`, `shadow-card`, …). Used **only by Path A**.
- **`components.css`** — Reusable component primitives (`.lec-btn`, `.lec-card`, `.lec-form-block`, `.lec-shell-header`, `.lec-shell-footer`, etc.). Used by **both** paths.
- **`react/`** — Source-only React components for the most-used patterns (`LecShell`, `LecShellHeader`, `LecShellFooter`, `LecPageHeader`, `LecCard`). Import directly from the submodule. See `react/README.md`.
- **`STYLEGUIDE.md`** — This document. Rules + recipes.
- **`STACK.md`** — The tech stack contract (React, Tailwind version, Radix, Lucide, plus the two sanctioned styling paths).

For full setup instructions for each path, see "Two sanctioned styling paths" below.

---

## Hard rules

These are not preferences. Violating them is a bug.

1. **Brand tokens are mandatory.** Colors, radii, fonts come from `tokens.css` (`var(--*)`) or the `lecturioPreset` (Tailwind path). Tool-local brand values are forbidden.
2. **Pick one of the two sanctioned styling paths** — see "Two sanctioned styling paths" below. Mixing them inside a single tool is forbidden; commit to one per codebase and document it in the tool's `CLAUDE.md`.
3. **CSS-in-JS is forbidden** on both paths (styled-components, emotion, vanilla-extract). Even "just for one component." Plain CSS modules / app-local CSS files are fine.
4. **Primary color is `#59a831` (Lecturio Green).** Use `bg-primary`/`text-primary` (Tailwind) or `var(--primary)` (raw CSS). Never introduce another brand color.
5. **All radii are zero.** Square corners only. Tailwind's `rounded-*` utilities all resolve to `0`; raw CSS uses `0` directly. The exception: `rounded-full` (or `border-radius: 50%`) is preserved for genuinely circular elements like avatars.
6. **Cards have no border.** Elevation comes from `shadow-card` (Tailwind) or `var(--card-shadow)` (raw). Inputs and buttons have borders; cards do not.
7. **Noto Sans is the only font.** Loaded automatically by `tokens.css`. Tailwind's `font-sans` / `font-display` / `font-mono` all map to the right family.
8. **No emojis as icons.** Use Lucide React (`lucide-react`) for every icon. Default size is `16px`; large CTAs use `18px`. Stroke width is the Lucide default.

---

## Two sanctioned styling paths

A tool picks **one** path and sticks to it. Document the choice on the first line of the tool's `CLAUDE.md`.

### Path A: Tailwind + Preset (default)

Use this for **Next.js apps and any Vite tool that already has a build pipeline**. The Tailwind preset wires the brand tokens into shadcn-style utility names; you compose UI with utility classes and the `.lec-*` primitives.

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";
import lecturioPreset from "./design-tokens/tailwind-preset.cjs";

const config: Config = {
  presets: [lecturioPreset],
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
};
export default config;
```

```css
/* src/app/globals.css (or your app's main stylesheet) */
@import "../../design-tokens/tokens.css";
@import "../../design-tokens/components.css";

@tailwind base;
@tailwind components;
@tailwind utilities;
```

Then write JSX with utility classes plus the `.lec-*` primitives:

```tsx
<button className="lec-btn lec-btn--primary"><Plus size={16} /> New</button>
<div className="flex items-center gap-3">…</div>
```

You get: Tailwind utilities, the Lecturio Tailwind preset, the `Lec*` React shell components, all `.lec-*` primitives, plus runtime access to `var(--*)`.

### Path B: Plain CSS + tokens.css (lightweight)

Use this for **Vite SPAs that don't want a Tailwind build, prototype tools, embedded renderers, or any case where the Tailwind cost isn't worth it**. You import `tokens.css` + `components.css` and style app-local rules with raw CSS that references the tokens.

```css
/* src/App.css (or your main stylesheet) */
@import "../design-tokens/tokens.css";
@import "../design-tokens/components.css";

/* Then style your tool with var(--*) refs — never hardcode brand values */
.my-layout {
  background: var(--bg-subtle);
  color: var(--fg);
  padding: 24px;
}
.my-layout h1 {
  font-family: var(--font-display);
  font-size: 28px;
  letter-spacing: -0.02em;
}
```

You get: all design tokens as CSS custom properties, all `.lec-*` component primitives, the bundled Noto Sans font.

You don't get: Tailwind utilities (`flex gap-2 bg-primary` etc.), the `lecturioPreset`, the `Lec*` React shell components (those use `import.meta.url` — works in Vite, but you still need to opt in by importing them).

Pick this path consciously. Don't add Tailwind later "just for one section" — that's a Path A migration, not a free upgrade.

---

---

## Token reference

| Token | Value | Use |
|---|---|---|
| `--bg` | `#ffffff` | Default page surface |
| `--bg-subtle` | `#f7f9fa` | Subtle page background, nested areas |
| `--bg-elev-2` | `#f1f4f6` | Hover backdrop, idle pills |
| `--bg-dim` | `#eaeef1` | Disabled buttons |
| `--fg` | `#0f172a` | Primary text |
| `--fg-muted` | `#5c6773` | Helper text, secondary labels |
| `--muted` | `#8893a0` | Tertiary text, placeholders |
| `--border` | `#e2e8ed` | Subtle dividers, dashed-line bottoms |
| `--border-strong` | `#cbd5db` | Input borders |
| `--primary` | `#59a831` | Brand green |
| `--primary-hover` | `#4a8f28` | Brand green pressed/hover |
| `--primary-soft` | `#eaf4df` | Brand badge backgrounds |
| `--primary-shadow` | `rgba(89,168,49,0.25)` | Brand-tinted button shadow |
| `--amber` / `--amber-soft` | `#d97706` / `#fef3c7` | Warning fg / bg |
| `--red` / `--red-soft` | `#dc2626` / `#fee2e2` | Danger fg / bg |
| `--blue` / `--blue-soft` | `#2563eb` / `#dbeafe` | Info / experimental accents |
| `--card-shadow` | 3-layer drop shadow | Default card elevation |
| `--card-shadow-hover` | 3-layer drop shadow, deeper | Hovered card |
| `--shadow-focus` | `0 0 0 3px rgba(89,168,49,0.18)` | Input focus ring |
| `--font-display` | Noto Sans | Headings, titles, eyebrows |
| `--font-body` | Noto Sans | Body text, buttons, inputs |
| `--font-mono` | system mono stack | Times, IDs, code-like data |

---

## Component recipes

### Page header

Top of every list/index page.

```html
<header class="lec-page-header">
  <div>
    <div class="lec-eyebrow">Library</div>
    <h1 class="lec-page-title">Narrated Scenes</h1>
    <p class="lec-page-sub">One sentence, plain language, what this page is for.</p>
  </div>
  <button class="lec-btn lec-btn--primary">Neue Scene</button>
</header>
```

- **Eyebrow**: 12px uppercase, primary color, letter-spaced. Always one line.
- **Title**: 36px, weight 800, tight tracking. Single line preferred.
- **Sub**: 15px, muted, max 620px wide.

### Buttons

Three variants — never invent a fourth.

```html
<button class="lec-btn lec-btn--primary"><PencilIcon /> Save</button>
<a class="lec-btn lec-btn--secondary" href="..."><EyeIcon /> Edit</a>
<button class="lec-btn lec-btn--ghost"><Trash2 /></button>
<button class="lec-btn lec-btn--ghost is-danger"><Trash2 /></button>
```

Rules:
- Icon always **before** the label, gap 8px.
- Disabled state: dim background, muted text, no shadow.
- Use `.lec-cta` (large, 15px font, heavier shadow) only for the single most important action on a page — typically a "Generate" or "Submit" with surrounding marketing context.

### Card

```html
<article class="lec-card">
  <div class="lec-card-head">
    <span class="lec-card-badge">9 Slides</span>
    <span class="lec-card-duration">04:30</span>
  </div>
  <div class="lec-card-title">Healthy Foods Intro</div>
  <div class="lec-card-sub">Daily routine - five categories with examples.</div>
  <div class="lec-card-actions">
    <button class="lec-btn lec-btn--secondary"><Pencil /> Bearbeiten</button>
    <button class="lec-btn lec-btn--ghost is-danger"><Trash2 /></button>
  </div>
  <div class="lec-card-footer">Zuletzt aktualisiert: 24.04.2026 18:30</div>
</article>
```

- **Padding 20px**, gap 10px between sections.
- **Box-shadow only**, no border, no radius.
- For card-as-link: add `lec-card--clickable`, set `onClick` on the wrapper, `e.stopPropagation()` inside any inner buttons. Add `tabIndex={0}` and an Enter/Space key handler for accessibility.

### Card grid

```html
<ul class="lec-card-grid">
  <li class="lec-card">…</li>
  <li class="lec-card">…</li>
</ul>
```

Auto-fills 300px+ columns, gap 20px. Don't override columns unless you have a specific reason.

### Empty state

```html
<div class="lec-empty">
  <FolderPlusIcon class="lec-empty-icon" size={48} strokeWidth={1.5} />
  <div class="lec-empty-head">Noch keine Scenes</div>
  <div class="lec-empty-sub">Leg eine erste Scene an…</div>
  <button class="lec-btn lec-btn--primary"><Plus /> Erste Scene erstellen</button>
</div>
```

Always pair empty state with a single primary action that resolves it.

### Form block

```html
<div class="lec-form-block">
  <div class="lec-form-block-head">Audio</div>
  <label class="lec-form-field">
    <span>URL</span>
    <input type="url" placeholder="https://…" />
  </label>
  <div class="lec-form-warning">
    <AlertTriangle />
    <span>Audio-URL nicht erreichbar.</span>
  </div>
</div>
```

- **Block head**: 11px uppercase, heavily letter-spaced (0.22em), muted color. Acts as a section label, not a heading.
- Fields stack vertically; use `.lec-form-row` for horizontal groupings.
- Warnings always have left-border accent + icon. No bare text alerts.

### App shell

**Brand pattern:** every Lecturio tool's header opens with the Lecturio logo + a thin divider + the tool's product name. The logo carries the brand identity; the product name disambiguates which tool you're in. The brand is a single link to the tool's home.

**For React tools, prefer the ready-made components from `react/`** — they enforce the layout and accept slots for tool-specific content:

```tsx
import { LecShell, LecShellMain, LecShellHeader, LecShellFooter } from "../../design-tokens/react";

<LecShell>
  <LecShellHeader
    brand={{ productName: "Orchestrator" }}
    navItems={[
      { href: "/library", label: "Library", icon: Library, isActive: true },
      { href: "/experimental", label: "Experimental", icon: Beaker },
    ]}
    rightSlot={<MyUserMenu />}
    LinkComponent={NextLink}
    ImageComponent={NextImage}
  />
  <LecShellMain>{children}</LecShellMain>
  <LecShellFooter leftSlot={<>© 2026 Lecturio</>} />
</LecShell>
```

The plain HTML version below is the same markup the React components produce — useful for non-React tools or to understand what the components render:

```html
<div class="lec-shell">
  <header class="lec-shell-header">
    <a class="lec-shell-brand" href="/">
      <img src="/logo.svg" alt="Lecturio" class="lec-shell-brand-logo" />
      <span class="lec-shell-brand-divider"></span>
      <span class="lec-shell-brand-product">Orchestrator</span>
    </a>
    <nav class="lec-shell-nav">
      <a class="lec-shell-nav-link is-active" href="/library">Library</a>
      <a class="lec-shell-nav-link" href="/experimental">Experimental</a>
    </nav>
    <span class="lec-shell-spacer"></span>
  </header>
  <main class="lec-shell-main">
    {/* page content */}
  </main>
  <footer class="lec-shell-footer">
    <div>© 2026 Lecturio</div>
    <div></div>
  </footer>
</div>
```

---

## Icons

Always [Lucide](https://lucide.dev/) (`lucide-react` for React tools). Common picks:

| Use | Icon |
|---|---|
| Add / new | `Plus` |
| Edit | `Pencil` |
| Delete | `Trash2` |
| Save | `Save` |
| Time / duration | `Clock` |
| Open / external | `ArrowUpRight` |
| Back | `ArrowLeft` |
| Restart | `RotateCcw` |
| Warning | `AlertTriangle` |
| Empty folder | `FolderPlus` |
| Settings | `Settings2` |
| Play / Pause | `Play` / `Pause` |

Default `size={16}`. For `.lec-cta` use `size={18}`. For oversized empty-state illustrations use `size={48} strokeWidth={1.5}`.

---

## Spacing scale

There's no formal scale — use these values:

- `4px`, `6px`, `8px`, `10px`, `12px`, `14px`, `16px`, `20px`, `24px`, `28px`, `32px`, `40px`, `80px`

Default gap inside a card is 10px. Default gap inside form blocks is 14px. Page-level gaps are 20–28px. Don't introduce 13px / 18px / 22px without a reason.

---

## Typography scale

| Level | Size | Weight | Letter-spacing | Line-height |
|---|---|---|---|---|
| Page title (h1) | 36px | 800 | -0.025em | 1.1 |
| Editor title (h1) | 28px | 800 | -0.02em | 1.2 |
| Empty-state head | 22px | 700 | — | — |
| Card title | 18px | 700 | -0.01em | 1.3 |
| Body / inputs | 14px | 400–500 | — | 1.5 |
| Sub / muted | 13–15px | 400–500 | — | 1.55 |
| Eyebrow / form-block-head | 11–12px | 700 | 0.18–0.22em | — |
| Footer / mono meta | 11–12px | 500–600 | — | — |

Don't introduce sizes between these stops.

---

## What NOT to do

- ❌ Round corners (`rounded-md`, `border-radius: 8px`) — Tailwind preset already collapses these on Path A; raw CSS uses `0` directly on Path B
- ❌ CSS-in-JS (styled-components, emotion, vanilla-extract) — even "just for one component", forbidden on **both paths**
- ❌ Local Tailwind color overrides (Path A) — extend the preset upstream instead
- ❌ Hardcoded brand values in CSS (Path B) — always use `var(--primary)`, `var(--fg)`, etc.
- ❌ Mixing Path A (Tailwind) and Path B (Plain CSS) inside one tool — pick one per codebase
- ❌ Emojis as functional icons (decoration in slide content is fine)
- ❌ Drop-shadow on buttons that already have a brand-shadow (no double shadows)
- ❌ Borders + box-shadows on the same card
- ❌ Custom brand colors per tool ("oh just for this one we used purple")
- ❌ System fonts as primary (always Noto Sans)
- ❌ Indeterminate states without a state pill (`scene-state` pattern: small mono badge)

---

## For AI agents

When generating UI in any Lecturio tool:

1. **Check the tool's styling path first.** Open the tool's `CLAUDE.md` and find the `**Styling path:**` line. If it says "Tailwind + Preset" → Path A. If it says "Plain CSS + tokens.css" → Path B. If neither line exists, ask before guessing.
2. **The stack is fixed. See `STACK.md`.** React + Radix + Lucide on both paths. Don't propose alternatives.
3. **Path A: always import the Lecturio Tailwind preset** in `tailwind.config.ts` and `tokens.css` + `components.css` in the app's main stylesheet. If they're not wired up, fix that first.
4. **Path B: always import `tokens.css` + `components.css`** in the app's main stylesheet. Use `var(--*)` for any custom CSS. Never hardcode brand values.
5. **Compose with `lec-`-prefixed primitives whenever possible** (works on both paths). If you find yourself writing a button style, stop — use `.lec-btn` + a variant. If you need a layout primitive that doesn't exist, propose it as a new `.lec-*` class upstream rather than ad-hoc styling.
6. **Read this STYLEGUIDE.md and `STACK.md` before writing any UI.**
7. **When in doubt about a value (color, spacing, font-size), use the design tokens.** Path A: Tailwind utilities backed by the preset. Path B: `var(--*)` directly. Don't invent.
8. **App-specific styles go in the consuming app's CSS, not in this design system.** Tool-specific layouts (e.g. `.editor-layout`, `.scene-grid`) belong in the app, not here.
9. **If the request needs something that doesn't fit any pattern here**, surface that explicitly. The right answer might be to extend `components.css` or the preset upstream rather than creating a one-off in the consuming app.
