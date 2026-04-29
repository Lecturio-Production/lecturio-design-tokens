#!/usr/bin/env bash
#
# Lecturio design-tokens — compliance lint.
#
# Verifies a consuming tool follows the design-system contract. Run from
# the root of the tool's repo. Designed for use as a pre-push hook or a
# CI step.
#
# Checks (all must pass):
#   1. design-tokens submodule is present and populated
#   2. CLAUDE.md exists and declares a `**Styling path:**` (A or B)
#   3. tokens.css is imported in some app stylesheet
#   4. components.css is imported in some app stylesheet
#   5. No forbidden CSS-in-JS deps in package.json
#       (styled-components, @emotion/*, vanilla-extract)
#   6. Path-A only: lecturioPreset is referenced in tailwind.config.*
#
# Exit codes:
#   0 — all checks passed
#   1 — at least one check failed
#
# Usage:
#   cd ~/code/<your-tool>
#   bash <(curl -sL https://raw.githubusercontent.com/Lecturio-Production/lecturio-design-tokens/main/scripts/check-compliance.sh)
#
# Or as a pre-push hook in .git/hooks/pre-push:
#   #!/usr/bin/env bash
#   ~/code/lecturio-design-tokens/scripts/check-compliance.sh || exit 1

set -uo pipefail

TARGET_DIR="${1:-$(pwd)}"
cd "$TARGET_DIR"

# ── Output helpers ──────────────────────────────────────────────────────
c_g()  { printf "\033[32m%s\033[0m" "$*"; }
c_r()  { printf "\033[31m%s\033[0m" "$*"; }
c_y()  { printf "\033[33m%s\033[0m" "$*"; }
c_b()  { printf "\033[1m%s\033[0m" "$*"; }
ok()   { printf "  $(c_g ✓) %s\n" "$*"; }
fail() { printf "  $(c_r ✗) %s\n" "$*"; FAILED=1; }
warn() { printf "  $(c_y ⚠) %s\n" "$*"; }
hdr()  { printf "\n$(c_b "── %s ──")\n" "$*"; }

FAILED=0

# ── 1. Submodule present ────────────────────────────────────────────────
hdr "Submodule"

if [ ! -f "design-tokens/STYLEGUIDE.md" ]; then
  fail "design-tokens submodule missing or not populated. Run: git submodule update --init --recursive"
else
  ok "design-tokens submodule populated"
fi

# ── 2. CLAUDE.md styling-path declaration ───────────────────────────────
hdr "Styling-path declaration"

PATH_LETTER=""

if [ ! -f "CLAUDE.md" ]; then
  fail "CLAUDE.md missing. Add one with a **Styling path:** declaration."
elif ! grep -qF "Styling path:" CLAUDE.md; then
  fail "CLAUDE.md missing the **Styling path:** line."
elif grep -qE "Styling path:.*Path A|Styling path:.*Tailwind \+ Preset" CLAUDE.md; then
  PATH_LETTER="A"
  ok "Styling path: A (Tailwind + Preset)"
elif grep -qE "Styling path:.*Path B|Styling path:.*Plain CSS" CLAUDE.md; then
  PATH_LETTER="B"
  ok "Styling path: B (Plain CSS + tokens.css)"
else
  fail "Styling path declared but not recognized as Path A or B. Use the canonical phrasing."
fi

# ── 3 + 4. CSS imports in app stylesheets ───────────────────────────────
hdr "Stylesheet imports"

# Find all .css files outside node_modules / dist / .next / submodule
CSS_FILES="$(find . -type f -name '*.css' \
  -not -path './node_modules/*' \
  -not -path './dist/*' \
  -not -path './.next/*' \
  -not -path './design-tokens/*' \
  -not -path './build/*' \
  2>/dev/null)"

if [ -z "$CSS_FILES" ]; then
  fail "No app CSS files found. Where are your styles?"
else
  TOKENS_OK=0
  COMPONENTS_OK=0
  for f in $CSS_FILES; do
    grep -qF "design-tokens/tokens.css" "$f" && TOKENS_OK=1
    grep -qF "design-tokens/components.css" "$f" && COMPONENTS_OK=1
  done

  if [ $TOKENS_OK -eq 1 ]; then
    ok "tokens.css imported"
  else
    fail "tokens.css not imported in any app stylesheet"
  fi

  if [ $COMPONENTS_OK -eq 1 ]; then
    ok "components.css imported"
  else
    fail "components.css not imported in any app stylesheet"
  fi
fi

# ── 5. No CSS-in-JS deps ────────────────────────────────────────────────
hdr "Forbidden CSS-in-JS deps"

if [ ! -f "package.json" ]; then
  warn "No package.json found — skipping CSS-in-JS dep check"
else
  FORBIDDEN_PKGS=(
    "styled-components"
    "@emotion/react"
    "@emotion/styled"
    "@emotion/css"
    "@vanilla-extract/css"
    "stitches"
    "@stitches/react"
    "linaria"
  )
  CSS_IN_JS_FOUND=0
  for pkg in "${FORBIDDEN_PKGS[@]}"; do
    if grep -qF "\"$pkg\"" package.json; then
      fail "Forbidden CSS-in-JS dependency: $pkg"
      CSS_IN_JS_FOUND=1
    fi
  done
  if [ $CSS_IN_JS_FOUND -eq 0 ]; then
    ok "No CSS-in-JS dependencies"
  fi
fi

# ── 6. Path-A: Tailwind preset referenced ───────────────────────────────
if [ "$PATH_LETTER" = "A" ]; then
  hdr "Tailwind preset (Path A)"

  TW_FILE=""
  for f in tailwind.config.ts tailwind.config.js tailwind.config.cjs tailwind.config.mjs; do
    [ -f "$f" ] && TW_FILE="$f" && break
  done

  if [ -z "$TW_FILE" ]; then
    fail "Path A declared but no tailwind.config.* found"
  elif grep -qE "lecturioPreset|tailwind-preset.cjs" "$TW_FILE"; then
    ok "Lecturio preset referenced in $TW_FILE"
  else
    fail "$TW_FILE doesn't reference the Lecturio preset. Add: presets: [lecturioPreset]"
  fi
fi

# ── Summary ─────────────────────────────────────────────────────────────
hdr "Summary"

if [ $FAILED -eq 0 ]; then
  printf "  $(c_g 'All checks passed.') Tool is design-system compliant.\n\n"
  exit 0
else
  printf "  $(c_r 'Compliance check failed.') Fix the issues above.\n\n"
  printf "  See \`design-tokens/STYLEGUIDE.md\` and \`design-tokens/STACK.md\` for the rules.\n\n"
  exit 1
fi
