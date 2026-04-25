# lecturio-design-tokens (extract)

These three files are the seed for the new `lecturio-design-tokens` repo.

**This directory is not consumed by the SceneEditor.** It is an extract that you copy into a fresh GitHub repo, then re-attach to each tool as a Git submodule.

## Files

| File | Purpose |
|---|---|
| `tokens.css` | CSS custom properties (colors, shadows, typography). Import first. |
| `components.css` | Reusable `.lc-*` component classes. Import second. |
| `STYLEGUIDE.md` | The rules + recipes. Both humans and AI agents read this. |

## How to bootstrap the shared repo

```bash
# 1. Create empty GitHub repo at github.com/lecturio/design-tokens (private)

# 2. Initialise locally and copy the three files
mkdir -p ~/code/lecturio-design-tokens
cd ~/code/lecturio-design-tokens
git init && git remote add origin git@github.com:lecturio/design-tokens.git

# Copy the three files from this extract directory
cp /path/to/SceneEditor/design-tokens-extract/{tokens.css,components.css,STYLEGUIDE.md,README.md} .

# 3. First commit + push
git add . && git commit -m "initial: extract from scene-editor"
git push -u origin main
```

## How to attach in any consuming tool

```bash
cd ~/code/<tool>
git submodule add git@github.com:lecturio/design-tokens.git design-tokens
git commit -m "chore: add design-tokens submodule"
```

Then in the tool's main stylesheet:

```css
@import "../design-tokens/tokens.css";
@import "../design-tokens/components.css";
```

For Vite-based tools, the relative path resolves correctly from `src/App.css`. For other setups, adjust accordingly.

## How clones / CI fetch the submodule

```bash
# When cloning fresh
git clone --recurse-submodules git@github.com:lecturio/<tool>.git

# Or after a normal clone
git submodule update --init --recursive
```

GitHub Actions checkout step:

```yaml
- uses: actions/checkout@v4
  with:
    submodules: true
```

Railway / Containerfile builds: ensure `git submodule update --init` runs before `npm ci`, or commit the submodule contents into Docker context another way.

## After bootstrap, delete this directory

Once the shared repo exists and is attached as a submodule to the SceneEditor, this `design-tokens-extract/` directory should be deleted from this repo — its purpose is one-shot.
