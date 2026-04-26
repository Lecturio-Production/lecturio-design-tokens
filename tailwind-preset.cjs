/**
 * Lecturio design-tokens — Tailwind preset
 *
 * Drop this preset into a tool's `tailwind.config.ts` and the Lecturio
 * brand (colors, radii, fonts, shadows) is wired up automatically. Pair
 * with `tokens.css` (CSS custom properties + Noto Sans loader) so the
 * `.lc-*` component primitives in `components.css` resolve too.
 *
 * Usage:
 *
 *   // tailwind.config.ts
 *   import type { Config } from "tailwindcss";
 *   import lecturioPreset from "./design-tokens/tailwind-preset.cjs";
 *
 *   const config: Config = {
 *     presets: [lecturioPreset],
 *     content: [...],
 *   };
 *   export default config;
 *
 * Hard rules baked in (mirror STYLEGUIDE.md):
 *  - All radii are 0 (square corners).
 *  - Brand color is Lecturio Green.
 *  - Noto Sans for display + body.
 *  - shadcn-style color names (primary, muted, …) keep working — they
 *    map to design-tokens equivalents at runtime via CSS custom props.
 *
 * Color values that need to support `/<alpha>` modifiers are emitted in
 * RGB-tuple form. Hex equivalents in tokens.css must mirror these — keep
 * them in sync if the brand changes.
 */
module.exports = {
  theme: {
    extend: {
      colors: {
        // Solid colors — reference design tokens directly.
        border: "var(--border)",
        input: "var(--border-strong)",
        background: "var(--bg-subtle)",
        foreground: "var(--fg)",
        secondary: {
          DEFAULT: "var(--bg-elev-2)",
          foreground: "var(--fg)",
        },
        destructive: {
          DEFAULT: "var(--red)",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "var(--bg-elev-2)",
          foreground: "var(--fg)",
        },
        popover: {
          DEFAULT: "var(--bg)",
          foreground: "var(--fg)",
        },
        card: {
          DEFAULT: "var(--bg)",
          foreground: "var(--fg)",
        },

        // Colors used with /<alpha> need rgb-tuple form.
        // Mirror tokens.css hex values.
        ring: "rgb(89 168 49 / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(89 168 49 / <alpha-value>)", // var(--primary) #59a831
          hover: "rgb(74 143 40 / <alpha-value>)", // var(--primary-hover) #4a8f28
          soft: "rgb(234 244 223 / <alpha-value>)", // var(--primary-soft) #eaf4df
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "var(--bg-elev-2)",
          foreground: "rgb(92 103 115 / <alpha-value>)", // var(--fg-muted) #5c6773
        },
        amber: {
          DEFAULT: "rgb(217 119 6 / <alpha-value>)", // var(--amber) #d97706
          soft: "rgb(254 243 199 / <alpha-value>)", // var(--amber-soft) #fef3c7
        },
        red: {
          DEFAULT: "rgb(220 38 38 / <alpha-value>)", // var(--red) #dc2626
          soft: "rgb(254 226 226 / <alpha-value>)", // var(--red-soft) #fee2e2
        },
        blue: {
          DEFAULT: "rgb(37 99 235 / <alpha-value>)", // var(--blue) #2563eb
          soft: "rgb(219 234 254 / <alpha-value>)", // var(--blue-soft) #dbeafe
        },
      },
      borderRadius: {
        none: "0",
        sm: "0",
        DEFAULT: "0",
        md: "0",
        lg: "0",
        xl: "0",
        "2xl": "0",
        "3xl": "0",
        full: "9999px", // kept for genuinely circular elements (avatars)
      },
      fontFamily: {
        sans: ['"Noto Sans"', "system-ui", "-apple-system", "sans-serif"],
        display: ['"Noto Sans"', "system-ui", "-apple-system", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      boxShadow: {
        card: "var(--card-shadow)",
        "card-hover": "var(--card-shadow-hover)",
        focus: "var(--shadow-focus)",
      },
    },
  },
};
