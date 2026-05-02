# lecturio-design-tokens

The shared design system + tech stack contract for every internal Lecturio tool.

This repo is consumed as a **git submodule** in each tool. Pinning to a specific commit makes builds reproducible: a tool deployed today and the same tool deployed in six months produce the same look unless someone explicitly bumps the submodule.

## What's in here

| File | Purpose |
|---|---|
| `tokens.css` | CSS custom properties (colors, shadows, typography) + Noto Sans loader. Imported in the consuming app's main stylesheet for runtime access via `var(--*)`. |
| `tailwind-preset.cjs` | Tailwind preset wiring the tokens to shadcn-style utility names (`bg-primary`, `text-muted-foreground`, `shadow-card`, …). Added to each tool's `tailwind.config.ts` `presets` array. |
| `components.css` | `.lec-*` component primitives (button, card, page-header, form-block, app-shell). |
| `assets/logo.png` | Canonical Lecturio logo. Used by `LecShellHeader` via `brand.productName` — see `react/README.md`. |
| `assets/favicon.png` | Canonical Lecturio favicon. Wire into your app head/manifest (Next.js App Router: re-export as `app/icon.png`; static: `<link rel="icon" type="image/png" href="…/design-tokens/assets/favicon.png">`). |
| `STYLEGUIDE.md` | Hard rules + component recipes. **Read this before writing UI.** |
| `STACK.md` | Mandatory tech stack contract (React, Tailwind, Radix, Lucide). |
| `preview.html` | Static preview of the components + tokens. Open in a browser. |
| `templates/Containerfile.submodule-init` | Canonical Docker snippet for fetching the submodule on Railway / CI builds. Copy verbatim into your tool's `Containerfile`. |
| `scripts/bootstrap-tool.sh` | One-shot tool setup. See "Attaching this repo to a tool". |
| `scripts/check-compliance.sh` | Pre-push lint that verifies a tool follows the design-system contract. See below. |
| `CHANGELOG.md` | All notable changes. Read before bumping the submodule pin. |

## Attaching this repo to a tool

### One-shot bootstrap (recommended)

```bash
cd ~/code/<your-tool>
bash <(curl -sL https://raw.githubusercontent.com/Lecturio-Production/lecturio-design-tokens/main/scripts/bootstrap-tool.sh)
```

The script adds the submodule, asks you for a styling path (A: Tailwind + Preset, B: Plain CSS + tokens.css), patches your main stylesheet, and writes the styling-path declaration into the tool's `CLAUDE.md`. Idempotent — safe to re-run.

### Manual

```bash
cd ~/code/<your-tool>
git submodule add https://github.com/Lecturio-Production/lecturio-design-tokens.git design-tokens
git commit -m "chore: add design-tokens submodule"
```

Then in the tool:

**`tailwind.config.ts`**
```ts
import type { Config } from "tailwindcss";
import lecturioPreset from "./design-tokens/tailwind-preset.cjs";

const config: Config = {
  presets: [lecturioPreset],
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
};
export default config;
```

**`src/app/globals.css`** (or your equivalent)
```css
@import "../../design-tokens/tokens.css";
@import "../../design-tokens/components.css";

@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Containerfile** — see the orchestrator's `Containerfile` for the canonical submodule-fetch block (Railway clones repos without `.git`, so we re-clone the submodule by URL during the build).

## Updating to a newer design-tokens commit

```bash
cd ~/code/<your-tool>
git submodule update --remote design-tokens
git add design-tokens
git commit -m "chore: bump design-tokens"
git push
```

This is a deliberate per-tool action — no auto-update at deploy time. That's the point: what you preview locally is what ships.

## Cloning a tool fresh

```bash
git clone --recurse-submodules <tool-repo-url>
# or after a normal clone:
git submodule update --init --recursive
```

## Compliance check

Verify a tool follows the design-system contract:

```bash
cd ~/code/<your-tool>
bash <(curl -sL https://raw.githubusercontent.com/Lecturio-Production/lecturio-design-tokens/main/scripts/check-compliance.sh)
```

Checks: submodule present, `**Styling path:**` declared in `CLAUDE.md`, `tokens.css` and `components.css` imported, no CSS-in-JS dependencies, and (Path A only) Lecturio preset referenced in `tailwind.config.*`. Exit code 1 on any failure — wire it up as a pre-push hook to keep tools from drifting.

## Modifying the design system

Changes happen here, in this repo. Push to `main`. Then bump the submodule pin in each consuming tool that should pick the change up. There is no global rollout.

**Every change adds an entry to [`CHANGELOG.md`](CHANGELOG.md)** (top of "Unreleased", or new dated section). Mark breaking changes with `🚨 breaking` and explain how consumers migrate — that's the file consuming-tool maintainers read before bumping the submodule pin.

## Local preview

Open `preview.html` in any browser to see the components + tokens rendered.
