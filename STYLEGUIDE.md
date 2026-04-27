# Lecturio Design System

This is the visual standard for all internal Lecturio tools. It is **not negotiable** without explicit design coordination — consistency across tools is the whole point.

If you're an AI agent: read this entire file before generating UI. Apply the patterns literally; do not invent variations of buttons, cards, or color schemes.

---

## Files

- **`tokens.css`** — CSS custom properties: colors, shadows, typography, radii. Import in your app's stylesheet (gives runtime access to `var(--primary)` etc. for the `.lc-*` primitives and any plain CSS).
- **`tailwind-preset.cjs`** — Tailwind preset that wires the tokens to shadcn-style utility names (`bg-primary`, `text-muted-foreground`, `shadow-card`, …). Add it to your `tailwind.config.ts` `presets` array.
- **`components.css`** — Reusable component primitives (`.lc-btn`, `.lc-card`, `.lc-form-block`, `.lc-shell-header`, `.lc-shell-footer`, etc.). Import after Tailwind so `@layer components` ordering is correct.
- **`react/`** — Source-only React components for the most-used patterns (`LcShell`, `LcShellHeader`, `LcShellFooter`, `LcPageHeader`). Import directly from the submodule. See `react/README.md`.
- **`STYLEGUIDE.md`** — This document. Rules + recipes.
- **`STACK.md`** — The mandatory tech stack contract (React, Tailwind version, Radix, Lucide, …).

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";
import lecturioPreset from "./design-tokens/tailwind-preset.cjs";

const config: Config = {
  presets: [lecturioPreset],
  content: [/* your file globs */],
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

---

## Hard rules

These are not preferences. Violating them is a bug.

1. **Tailwind is the styling layer.** Compose UI with Tailwind utility classes and the `.lc-*` component primitives. No CSS-in-JS (styled-components, emotion, vanilla-extract). Plain CSS modules are allowed for app-local rules that the tokens don't cover, but the brand-tokenized utilities should always be the first reach.
2. **Use the Lecturio Tailwind preset.** Every consuming tool's `tailwind.config.ts` includes `lecturioPreset` in `presets`. Do not redefine colors, fonts, radii locally — extend through the preset only.
3. **Primary color is `#59a831` (Lecturio Green).** Use `bg-primary`/`text-primary` (Tailwind) or `var(--primary)` (raw CSS). Do not introduce another brand color.
4. **All radii are zero.** Square corners only. Tailwind's `rounded-*` utilities all resolve to `0`. The exception: `rounded-full` is preserved (9999px) for genuinely circular elements like avatars.
5. **Cards have no border.** Elevation comes from `shadow-card` (Tailwind) or `var(--card-shadow)` (raw). Inputs and buttons have borders; cards do not.
6. **Noto Sans is the only font.** Loaded automatically by `tokens.css`. Tailwind's `font-sans` / `font-display` / `font-mono` all map to the right family.
7. **No emojis as icons.** Use Lucide React (`lucide-react`) for every icon. Default size is `16px`; large CTAs use `18px`. Stroke width is the Lucide default.

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
<header class="lc-page-header">
  <div>
    <div class="lc-eyebrow">Library</div>
    <h1 class="lc-page-title">Narrated Scenes</h1>
    <p class="lc-page-sub">One sentence, plain language, what this page is for.</p>
  </div>
  <button class="lc-btn lc-btn--primary">Neue Scene</button>
</header>
```

- **Eyebrow**: 12px uppercase, primary color, letter-spaced. Always one line.
- **Title**: 36px, weight 800, tight tracking. Single line preferred.
- **Sub**: 15px, muted, max 620px wide.

### Buttons

Three variants — never invent a fourth.

```html
<button class="lc-btn lc-btn--primary"><PencilIcon /> Save</button>
<a class="lc-btn lc-btn--secondary" href="..."><EyeIcon /> Edit</a>
<button class="lc-btn lc-btn--ghost"><Trash2 /></button>
<button class="lc-btn lc-btn--ghost is-danger"><Trash2 /></button>
```

Rules:
- Icon always **before** the label, gap 8px.
- Disabled state: dim background, muted text, no shadow.
- Use `.lc-cta` (large, 15px font, heavier shadow) only for the single most important action on a page — typically a "Generate" or "Submit" with surrounding marketing context.

### Card

```html
<article class="lc-card">
  <div class="lc-card-head">
    <span class="lc-card-badge">9 Slides</span>
    <span class="lc-card-duration">04:30</span>
  </div>
  <div class="lc-card-title">Healthy Foods Intro</div>
  <div class="lc-card-sub">Daily routine - five categories with examples.</div>
  <div class="lc-card-actions">
    <button class="lc-btn lc-btn--secondary"><Pencil /> Bearbeiten</button>
    <button class="lc-btn lc-btn--ghost is-danger"><Trash2 /></button>
  </div>
  <div class="lc-card-footer">Zuletzt aktualisiert: 24.04.2026 18:30</div>
</article>
```

- **Padding 20px**, gap 10px between sections.
- **Box-shadow only**, no border, no radius.
- For card-as-link: add `lc-card--clickable`, set `onClick` on the wrapper, `e.stopPropagation()` inside any inner buttons. Add `tabIndex={0}` and an Enter/Space key handler for accessibility.

### Card grid

```html
<ul class="lc-card-grid">
  <li class="lc-card">…</li>
  <li class="lc-card">…</li>
</ul>
```

Auto-fills 300px+ columns, gap 20px. Don't override columns unless you have a specific reason.

### Empty state

```html
<div class="lc-empty">
  <FolderPlusIcon class="lc-empty-icon" size={48} strokeWidth={1.5} />
  <div class="lc-empty-head">Noch keine Scenes</div>
  <div class="lc-empty-sub">Leg eine erste Scene an…</div>
  <button class="lc-btn lc-btn--primary"><Plus /> Erste Scene erstellen</button>
</div>
```

Always pair empty state with a single primary action that resolves it.

### Form block

```html
<div class="lc-form-block">
  <div class="lc-form-block-head">Audio</div>
  <label class="lc-form-field">
    <span>URL</span>
    <input type="url" placeholder="https://…" />
  </label>
  <div class="lc-form-warning">
    <AlertTriangle />
    <span>Audio-URL nicht erreichbar.</span>
  </div>
</div>
```

- **Block head**: 11px uppercase, heavily letter-spaced (0.22em), muted color. Acts as a section label, not a heading.
- Fields stack vertically; use `.lc-form-row` for horizontal groupings.
- Warnings always have left-border accent + icon. No bare text alerts.

### App shell

**Brand pattern:** every Lecturio tool's header opens with the Lecturio logo + a thin divider + the tool's product name. The logo carries the brand identity; the product name disambiguates which tool you're in. The brand is a single link to the tool's home.

**For React tools, prefer the ready-made components from `react/`** — they enforce the layout and accept slots for tool-specific content:

```tsx
import { LcShell, LcShellMain, LcShellHeader, LcShellFooter } from "../../design-tokens/react";

<LcShell>
  <LcShellHeader
    brand={{ logoSrc: "/logo.svg", productName: "Orchestrator" }}
    navItems={[
      { href: "/library", label: "Library", icon: Library, isActive: true },
      { href: "/experimental", label: "Experimental", icon: Beaker },
    ]}
    rightSlot={<MyUserMenu />}
    LinkComponent={NextLink}
    ImageComponent={NextImage}
  />
  <LcShellMain>{children}</LcShellMain>
  <LcShellFooter leftSlot={<>© 2026 Lecturio</>} />
</LcShell>
```

The plain HTML version below is the same markup the React components produce — useful for non-React tools or to understand what the components render:

```html
<div class="lc-shell">
  <header class="lc-shell-header">
    <a class="lc-shell-brand" href="/">
      <img src="/logo.svg" alt="Lecturio" class="lc-shell-brand-logo" />
      <span class="lc-shell-brand-divider"></span>
      <span class="lc-shell-brand-product">Orchestrator</span>
    </a>
    <nav class="lc-shell-nav">
      <a class="lc-shell-nav-link is-active" href="/library">Library</a>
      <a class="lc-shell-nav-link" href="/experimental">Experimental</a>
    </nav>
    <span class="lc-shell-spacer"></span>
  </header>
  <main class="lc-shell-main">
    {/* page content */}
  </main>
  <footer class="lc-shell-footer">
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

Default `size={16}`. For `.lc-cta` use `size={18}`. For oversized empty-state illustrations use `size={48} strokeWidth={1.5}`.

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

- ❌ Round corners (`rounded-md`, `border-radius: 8px`) — Tailwind preset already collapses these
- ❌ CSS-in-JS (styled-components, emotion, vanilla-extract) — even "just for one component"
- ❌ Local Tailwind color overrides — extend the preset upstream instead
- ❌ Emojis as functional icons (decoration in slide content is fine)
- ❌ Drop-shadow on buttons that already have a brand-shadow (no double shadows)
- ❌ Borders + box-shadows on the same card
- ❌ Custom brand colors per tool ("oh just for this one we used purple")
- ❌ System fonts as primary (always Noto Sans)
- ❌ Indeterminate states without a state pill (`scene-state` pattern: small mono badge)

---

## For AI agents

When generating UI in any Lecturio tool:

1. **The stack is fixed. See `STACK.md`.** React + Tailwind + Radix + Lucide. Don't propose alternatives.
2. **Always import the Lecturio Tailwind preset** in `tailwind.config.ts` and `tokens.css` + `components.css` in the app's main stylesheet. If they're not wired up, fix that first before generating any other UI.
3. **Compose with `lc-`-prefixed primitives whenever possible.** If you find yourself writing a button style, stop — use `.lc-btn` + a variant. If you need a layout primitive that doesn't exist, propose it as a new `.lc-*` class upstream rather than ad-hoc styling.
4. **Read this STYLEGUIDE.md and `STACK.md` before writing any UI.**
5. **When in doubt about a value (color, spacing, font-size), use Tailwind utilities first, then `var(--*)` tokens.** Don't invent.
6. **App-specific styles go in the consuming app's CSS, not in this design system.** Tool-specific layouts (e.g. `.editor-layout`, `.scene-grid`) belong in the app, not here.
7. **If the request needs something that doesn't fit any pattern here**, surface that explicitly. The right answer might be to extend `components.css` or the preset upstream rather than creating a one-off in the consuming app.
