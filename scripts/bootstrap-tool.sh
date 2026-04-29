#!/usr/bin/env bash
#
# Lecturio design-tokens — bootstrap a new tool.
#
# Run from the root of a target tool's repo. Adds the design-tokens
# submodule, wires it into the chosen styling path, and writes the
# styling-path declaration into the tool's CLAUDE.md.
#
# Usage:
#   cd ~/code/my-new-tool
#   bash <(curl -sL https://raw.githubusercontent.com/Lecturio-Production/lecturio-design-tokens/main/scripts/bootstrap-tool.sh)
#
#   # or, if you have design-tokens already checked out somewhere:
#   ~/code/lecturio-design-tokens/scripts/bootstrap-tool.sh
#
# The script is idempotent — running it twice is safe.

set -euo pipefail

REPO_URL="https://github.com/Lecturio-Production/lecturio-design-tokens.git"
SUBMODULE_PATH="design-tokens"
TARGET_DIR="${1:-$(pwd)}"

cd "$TARGET_DIR"

# ── Color helpers ───────────────────────────────────────────────────────
c_b() { printf "\033[1m%s\033[0m" "$*"; }
c_g() { printf "\033[32m%s\033[0m" "$*"; }
c_y() { printf "\033[33m%s\033[0m" "$*"; }
c_r() { printf "\033[31m%s\033[0m" "$*"; }
say()  { printf "  %s\n" "$*"; }
ok()   { printf "  $(c_g ✓) %s\n" "$*"; }
warn() { printf "  $(c_y ⚠) %s\n" "$*"; }
err()  { printf "  $(c_r ✗) %s\n" "$*"; }
hdr()  { printf "\n$(c_b "── %s ──")\n" "$*"; }

# ── Sanity ──────────────────────────────────────────────────────────────
hdr "Sanity check"

if [ ! -d ".git" ]; then
  err "$TARGET_DIR is not a git repository. Run 'git init' first."
  exit 1
fi
ok "Target is a git repo: $TARGET_DIR"

# ── Submodule ───────────────────────────────────────────────────────────
hdr "design-tokens submodule"

if [ -f "$SUBMODULE_PATH/STYLEGUIDE.md" ]; then
  ok "Submodule already present — skipping add."
else
  if [ -e "$SUBMODULE_PATH" ]; then
    err "$SUBMODULE_PATH exists but is not a populated submodule. Resolve manually."
    exit 1
  fi
  say "Adding submodule from $REPO_URL ..."
  git submodule add "$REPO_URL" "$SUBMODULE_PATH"
  git submodule update --init --recursive
  ok "Submodule added at $SUBMODULE_PATH/"
fi

# ── Pick a styling path ─────────────────────────────────────────────────
hdr "Pick a styling path"

cat <<EOF
  A) Tailwind + Preset      → default; Next.js / modern Vite
  B) Plain CSS + tokens.css → lightweight Vite SPA / prototype / embed
EOF
echo
read -r -p "  Path [A/B] (A): " path_choice
path_choice="${path_choice:-A}"
path_choice="$(echo "$path_choice" | tr '[:lower:]' '[:upper:]')"

if [ "$path_choice" != "A" ] && [ "$path_choice" != "B" ]; then
  err "Invalid choice: $path_choice"
  exit 1
fi
ok "Selected: Path $path_choice"

# ── Locate the main stylesheet ──────────────────────────────────────────
hdr "Main stylesheet"

CANDIDATES=(
  "src/app/globals.css"
  "src/index.css"
  "src/App.css"
  "src/main.css"
  "src/styles.css"
  "app/globals.css"
)

STYLE_FILE=""
for c in "${CANDIDATES[@]}"; do
  if [ -f "$c" ]; then
    STYLE_FILE="$c"
    break
  fi
done

if [ -z "$STYLE_FILE" ]; then
  warn "No standard stylesheet found. Creating src/app/globals.css ..."
  mkdir -p src/app
  STYLE_FILE="src/app/globals.css"
  : > "$STYLE_FILE"
fi
ok "Stylesheet: $STYLE_FILE"

# Compute relative path from the stylesheet's directory to the submodule.
STYLE_DIR="$(dirname "$STYLE_FILE")"
relpath="$(python3 -c "import os, sys; print(os.path.relpath(sys.argv[1], sys.argv[2]))" "$SUBMODULE_PATH" "$STYLE_DIR")"

TOKENS_IMPORT="@import \"$relpath/tokens.css\";"
COMPONENTS_IMPORT="@import \"$relpath/components.css\";"

# Idempotent prepend: only add lines that aren't already present.
TMP="$(mktemp)"
{
  if ! grep -qF "$relpath/tokens.css" "$STYLE_FILE"; then
    echo "$TOKENS_IMPORT"
  fi
  if ! grep -qF "$relpath/components.css" "$STYLE_FILE"; then
    echo "$COMPONENTS_IMPORT"
  fi
  cat "$STYLE_FILE"
} > "$TMP"
mv "$TMP" "$STYLE_FILE"
ok "tokens.css + components.css imports prepended (or already present)"

# ── Path-specific patches ───────────────────────────────────────────────
if [ "$path_choice" = "A" ]; then
  hdr "Tailwind preset"

  TW_FILE=""
  for f in tailwind.config.ts tailwind.config.js tailwind.config.cjs tailwind.config.mjs; do
    [ -f "$f" ] && TW_FILE="$f" && break
  done

  if [ -z "$TW_FILE" ]; then
    warn "No tailwind.config.* found. Manual step required:"
    cat <<'EOF'

    Create tailwind.config.ts:

      import type { Config } from "tailwindcss";
      import lecturioPreset from "./design-tokens/tailwind-preset.cjs";

      const config: Config = {
        presets: [lecturioPreset],
        content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
      };
      export default config;

EOF
  elif grep -q "lecturioPreset\|tailwind-preset.cjs" "$TW_FILE"; then
    ok "$TW_FILE already references the Lecturio preset."
  else
    warn "$TW_FILE found but doesn't reference the preset. Manual step required:"
    cat <<EOF

    Add to the top of $TW_FILE:
      import lecturioPreset from "./design-tokens/tailwind-preset.cjs";

    And add to the config object:
      presets: [lecturioPreset],

    (auto-patching TS/JS configs would be too fragile to do safely)

EOF
  fi
fi

# ── Optional: lucide-react ──────────────────────────────────────────────
hdr "Icon library"

if [ -f package.json ] && grep -q '"lucide-react"' package.json; then
  ok "lucide-react already installed."
else
  warn "lucide-react not detected. Install it later if you want icons:"
  echo
  echo "    npm install lucide-react"
  echo
fi

# ── CLAUDE.md styling-path declaration ──────────────────────────────────
hdr "Tool CLAUDE.md"

CLAUDE_FILE="CLAUDE.md"

if [ "$path_choice" = "A" ]; then
  STYLING_LINE="**Styling path:** Tailwind + Preset (Path A)"
else
  STYLING_LINE="**Styling path:** Plain CSS + tokens.css (Path B, no Tailwind)"
fi

if [ -f "$CLAUDE_FILE" ] && grep -qF "Styling path:" "$CLAUDE_FILE"; then
  ok "Styling-path line already present in $CLAUDE_FILE."
else
  if [ ! -f "$CLAUDE_FILE" ]; then
    say "Creating $CLAUDE_FILE ..."
    cat > "$CLAUDE_FILE" <<EOF
# CLAUDE.md — $(basename "$TARGET_DIR")

$STYLING_LINE

See \`design-tokens/STYLEGUIDE.md\` and \`design-tokens/STACK.md\` for the
brand, layout, and tech-stack rules every Lecturio tool follows.

EOF
  else
    say "Appending styling-path line to existing $CLAUDE_FILE ..."
    printf "\n%s\n\nSee \`design-tokens/STYLEGUIDE.md\` and \`design-tokens/STACK.md\`.\n" "$STYLING_LINE" >> "$CLAUDE_FILE"
  fi
  ok "$CLAUDE_FILE updated."
fi

# ── Done ────────────────────────────────────────────────────────────────
hdr "Done"

cat <<EOF
  Next steps:

  1. Verify the changes:
       git status
       cat $STYLE_FILE
       cat $CLAUDE_FILE

  2. Read the styleguide:
       \$EDITOR design-tokens/STYLEGUIDE.md

  3. Commit:
       git add .gitmodules design-tokens $STYLE_FILE $CLAUDE_FILE
       git commit -m "chore: bootstrap Lecturio design-tokens (Path $path_choice)"

  4. Don't forget the Containerfile submodule-init block when you set up
     deployment — copy it from the orchestrator's Containerfile.

EOF
