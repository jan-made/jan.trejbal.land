# AGENTS.md

Project: jan.trejbal.land (Astro static site - CV/personal website)

## Source of Truth

- This file is the local agent guide for this repo.
- No Cursor rules found in `.cursor/rules/` or `.cursorrules`.
- No Copilot rules found in `.github/copilot-instructions.md`.

## Build, Dev, Lint, Test

### Development server

```bash
bun dev
```

Starts local dev server at `localhost:4321`.

### Production build

```bash
bun run build
```

Outputs static site to `dist/`.

### Preview build

```bash
bun run preview
```

Serves the built `dist/` folder locally.

### PDF generation

```bash
bun run generate:pdf http://localhost:4321 jan-trejbal.pdf dist/
```

Or combined build + PDF:

```bash
bun run build:pdf
```

Notes:

- Requires Puppeteer (installed as devDependency).
- CI installs additional system dependencies for headless Chrome.

### Linting

- No ESLint/Prettier/Stylelint configs present.
- No lint scripts configured.

### Tests

- No test framework configured.
- No unit tests available.

## Repo Layout

```
/
├── src/
│   ├── pages/          # Astro pages (index.astro = main CV page)
│   ├── layouts/        # Base layout (BaseLayout.astro)
│   ├── components/     # Reusable Astro components (Grid, Column, PrintOnly)
│   └── styles/         # CSS files (belmu.css, main.css, custom.css, print.css)
├── public/             # Static assets copied as-is to dist/
│   ├── .well-known/    # security.txt and signature
│   ├── img/            # Images
│   ├── favicon.png
│   └── key.asc         # PGP public key
├── scripts/            # Build scripts (generatepdf.js)
├── astro.config.mjs    # Astro configuration
├── package.json        # Dependencies and scripts (Bun)
└── tsconfig.json       # TypeScript config (strict mode)
```

## Code Style Guidelines

### General

- Indentation: 2 spaces everywhere.
- No formatter enforced; follow existing style in touched files.
- Prefer small, focused changes; avoid reformatting entire files.

### Astro Components (.astro files)

```astro
---
// TypeScript frontmatter goes here
interface Props {
  title: string;
}

const { title } = Astro.props;
---

<div class="my-component">
  <slot />
</div>

<style>
  /* Scoped styles */
</style>
```

- Use TypeScript interfaces for Props.
- Destructure `Astro.props` in frontmatter.
- Use `<slot />` for children content.
- Prefer scoped `<style>` unless global styles needed (`<style is:global>`).
- Comments in frontmatter: `// comment`.

### HTML Structure

- Use semantic elements: `<main>`, `<footer>`, `<header>`.
- Keep attributes on single line unless readability suffers.
- Use class-based styling (no inline styles).

### CSS

- Vanilla CSS only (no Sass/preprocessors).
- 2-space indentation.
- Naming conventions from belmu.css framework:
  - Utility classes prefixed with `-` (e.g., `-text-center`, `-m-auto`).
  - Semantic classes without prefix (e.g., `.main`, `.footer`, `.grid`).
- Print styles in `src/styles/print.css`.
- Custom overrides in `src/styles/custom.css`.

### TypeScript/JavaScript

- ES modules (`import`/`export`).
- 2-space indentation.
- camelCase for variables and functions.
- Async/await preferred over callbacks.
- Error handling: catch and log with `console.error`, then `process.exit(1)` for scripts.

### Imports

- Astro components: `import Component from '../components/Component.astro';`
- Layouts: `import Layout from '../layouts/Layout.astro';`
- Use relative paths within src/.

## Error Handling Conventions

- Scripts: wrap async operations in try/catch, log error, exit with code 1.
- Avoid empty catch blocks.

## Environment Notes

- `import.meta.env.PROD` - true in production build.
- Robots meta tag uses PROD to control indexing.
- Site URL configured in `astro.config.mjs`.

## CI/CD Notes (GitHub Actions)

Pipeline: `.github/workflows/build-and-deploy.yml`

### Stages

1. **build**: Install deps, build Astro site, upload artifact.
2. **generate-pdf**: Download artifact, serve site, generate PDF with Puppeteer.
3. **deploy**: Upload to GitHub Pages (only on push to main/master).

### Key Details

- Runner: `blacksmith-2vcpu-ubuntu-2404`
- Package manager: Bun
- Artifacts include hidden files (`.well-known/` for security.txt).
- PDF generation uses headless Puppeteer.

## Safe Defaults for Agents

- For local dev: `bun dev`
- For production build: `bun run build`
- For preview: `bun run preview`
- Output directory: `dist/` (not `public/`)
- Static assets source: `public/` (copied to `dist/` on build)

## Files to Avoid Editing Directly

- `dist/` - build output, gitignored
- `node_modules/` - dependencies
- `bun.lock` - auto-generated lockfile
- `src/styles/belmu.css` - third-party CSS framework

## When Unsure

- Check existing patterns in similar files.
- Refer to `astro.config.mjs` for build configuration.
- Check `.github/workflows/build-and-deploy.yml` for CI behavior.
