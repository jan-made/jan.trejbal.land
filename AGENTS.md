# AGENTS.md

Project: jan.trejbal.land (Hugo site + winning theme)

## Source of Truth
- This file is the local agent guide for this repo.
- No Cursor rules found in `.cursor/rules/` or `.cursorrules`.
- No Copilot rules found in `.github/copilot-instructions.md`.

## Build, Dev, Lint, Test

### Hugo dev server (theme)
Run from `themes/winning/` (or `themes/winning/exampleSite/` for example site):

```
npm start
```

Script: `hugo serve -d docs` (see `themes/winning/package.json`).

### Production build (theme)
Run from `themes/winning/` (or `themes/winning/exampleSite/`):

```
npm run build
```

Script: `HUGO_ENV=production hugo -d docs && npm run minifycss`.

### Staging build (theme)
Run from `themes/winning/`:

```
npm run stage
```

Script: `HUGO_ENV=production npm start | npm run minifycss`.

### CSS minification
Run from `themes/winning/`:

```
npm run minifycss
```

Script uses PostCSS + cssnano (see `themes/winning/postcss.config.js`).

### Hugo build (CI behavior)
From repo root (CI uses this):

```
hugo --baseURL http://site -d public_site
hugo
```

### PDF generation
From repo root:

```
node generatepdf.js http://site jan-trejbal.pdf
```

Notes:
- Script writes to `public/`.
- CI uses Puppeteer image; local use may require puppeteer.

### Security signing
From repo root:

```
make security
make securityVerify
```

### Linting
- No ESLint/Prettier/Stylelint configs found.
- No lint scripts configured.

### Tests
- No test framework configured.
- No unit tests or single-test command available.

## Repo Layout
- Hugo site configuration: `config.toml`
- Custom site templates: `layouts/`
- Static assets: `static/`
- Theme: `themes/winning/`
- Example theme site: `themes/winning/exampleSite/`

## Code Style Guidelines

### General
- Indentation: 2 spaces (HTML templates, CSS, JS).
- No formatter enforced; follow existing style in touched files.
- Prefer small, focused changes; avoid reformatting entire files.

### Hugo templates (Go template)
- Use 2-space indentation.
- Keep template comments in Hugo format: `{{/* comment */}}`.
- Maintain existing block/partial structure:
  - Base: `layouts/_default/baseof.html`
  - Partials: `layouts/partials/*.html`

### HTML structure
- Prefer semantic elements: `<main>`, `<footer>`, `<header>`.
- Keep attributes compact; avoid multi-line unless existing style uses it.

### CSS
- Vanilla CSS only (no Sass/Less).
- 2-space indentation, braces on same line.
- Use existing naming conventions:
  - Utility-like classes prefixed with `-` (e.g., `-text-center`).
  - Semantic classes for structure (e.g., `.main`, `.footer`).
- Prefer relative units where used (`rem`, `em`, `%`).
- Keep print styles in `static/css/print.css`.
- Custom overrides belong in `static/css/custom.css`.

### JavaScript (Node scripts)
- CommonJS modules (`require` / `module.exports`).
- 2-space indentation.
- camelCase for variables (`outputFile`, `page`).
- Keep scripts simple; avoid adding new dependencies unless necessary.

### Markdown content
- Hugo shortcodes are used for layout.
- Keep heading hierarchy consistent (`#`, `##`, `###`).

## Error Handling Conventions
- JS scripts use minimal error logging (e.g., `console.error(err)` in callbacks).
- Avoid empty `catch` blocks.
- Prefer explicit checks to match existing style.

## Environment Notes
- Production builds set `HUGO_ENV=production`.
- Robots meta uses HUGO_ENV or `.Site.Params.env`.

## CI/CD Notes (GitLab)
- Pipeline defined in `.gitlab-ci.yml`.
- Stages: generate HTML, pre-pack, generate PDF, pack, deploy.
- Docker images and deployment are CI-only; do not run locally unless requested.

## Safe Defaults for Agents
- For local dev, run `npm start` in `themes/winning/`.
- For production build, run `npm run build` in `themes/winning/`.
- Avoid introducing linters/formatters unless asked.
- Do not edit generated/minified CSS unless explicitly requested.

## Files to Avoid Editing Directly
- `themes/winning/static/css/*.min.css` (generated)
- `public/` and `public_site/` (build outputs)

## When Unsure
- Check existing patterns in the nearest similar file.
- If build/test commands are unclear, re-check `themes/winning/package.json` and `.gitlab-ci.yml`.
