# lecturio-design-tokens

The shared design system + tech stack contract for every internal Lecturio tool.

This repo is consumed as a **git submodule** in each tool. Pinning to a specific commit makes builds reproducible: a tool deployed today and the same tool deployed in six months produce the same look unless someone explicitly bumps the submodule.

## What's in here

| File | Purpose |
|---|---|
| `tokens.css` | CSS custom properties (colors, shadows, typography) + Noto Sans loader. Imported in the consuming app's main stylesheet for runtime access via `var(--*)`. |
| `tailwind-preset.cjs` | Tailwind preset wiring the tokens to shadcn-style utility names (`bg-primary`, `text-muted-foreground`, `shadow-card`, …). Added to each tool's `tailwind.config.ts` `presets` array. |
| `components.css` | `.lec-*` component primitives (button, card, page-header, form-block, app-shell). |
| `STYLEGUIDE.md` | Hard rules + component recipes. **Read this before writing UI.** |
| `STACK.md` | Mandatory tech stack contract (React, Tailwind, Radix, Lucide). |
| `preview.html` | Static preview of the components + tokens. Open in a browser. |

## Attaching this repo to a tool

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

## Modifying the design system

Changes happen here, in this repo. Push to `main`. Then bump the submodule pin in each consuming tool that should pick the change up. There is no global rollout.

If the change is breaking (renamed token, removed `.lec-*` class, changed Tailwind preset shape), call it out in the commit message — consumers need to know what to migrate.

## Local preview

Open `preview.html` in any browser to see the components + tokens rendered.
