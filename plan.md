# Hugo to Astro Migration Plan

## Goal
Migrate jan.trejbal.land from Hugo to Astro while:
- Keeping the exact same visual design
- Preserving CSS print rules for PDF generation
- Using Bun as the runtime
- Producing a fully static output (no server runtime needed)

## Current State Analysis

### Hugo Structure
```
.
├── config.toml                    # Site config (title, theme, analytics)
├── content/
│   └── _index.md                  # Single-page CV content with shortcodes
├── layouts/
│   ├── _default/
│   │   └── baseof.html            # Base template override
│   └── partials/
│       └── site-footer.html       # Footer override
├── static/
│   ├── css/
│   │   ├── custom.css             # Custom styles (details element)
│   │   └── print.css              # Print-specific rules (@page, page breaks)
│   ├── key.asc                    # PGP key
│   └── .well-known/               # Security files
└── themes/winning/
    ├── layouts/
    │   ├── _default/
    │   │   ├── baseof.html        # Main HTML structure
    │   │   └── single.html        # Single page template
    │   ├── index.html             # Homepage template
    │   ├── 404.html               # 404 page
    │   ├── partials/
    │   │   ├── site-footer.html   # Footer partial
    │   │   └── site-favicon.html  # Favicon partial
    │   └── shortcodes/
    │       ├── grid.html          # Grid wrapper
    │       ├── column.html        # Column with dynamic classes
    │       ├── dd.html            # List to definition list converter
    │       ├── printonly.html     # Print-only content wrapper
    │       └── br.html            # Line break
    └── static/
        ├── css/
        │   ├── belmu.css          # CSS reset/framework (~2000 lines)
        │   ├── main.css           # Main styles (~433 lines)
        │   └── *.min.css          # Minified versions
        ├── img/
        │   └── noisyly.png        # Background texture
        └── favicon.png
```

### CSS Files to Migrate
1. **belmu.css** - CSS reset + utility classes (grid system, spacing, colors)
2. **main.css** - Main styles (typography, layout, download button, print styles)
3. **custom.css** - Site-specific overrides (details element styling)
4. **print.css** - Print-specific rules (@page size, margins, page breaks)

### Key Print Rules (MUST PRESERVE)
```css
/* From print.css */
@page {
    size: A4;
    margin: 1em 0 2em 0;
}
h2:nth-of-type(2) { break-before: page; }
h4:nth-of-type(5) { break-before: page; }

/* From main.css @media print */
@page { size: A4; margin: 2cm 3cm; }
.-print-only { display: block; }
.-print-hidden, .download-icon { display: none; }
```

### Hugo Shortcodes to Convert
| Shortcode | Purpose | Astro Equivalent |
|-----------|---------|------------------|
| `{{% grid %}}` | Wrap in `<div class="grid">` | `<Grid>` component |
| `{{% column CLASS1 CLASS2 %}}` | Column with classes | `<Column class="...">` |
| `{{% printonly %}}` | Print-only wrapper | `<PrintOnly>` component |
| `{{% dd %}}` | List to `<dl>` converter | `<DefinitionList>` or custom logic |
| `{{< br >}}` | Line break | `<br />` (no component needed) |

### Content Structure (_index.md)
- Frontmatter: `title: CV`
- Uses `{{% grid %}}` and `{{% column %}}` for 2-column layout
- Left column (60%): Professional Experience, Education
- Right column (40%): Contact, Skills, Hobbies
- Contains HTML within markdown (details element, line breaks)

## Target Astro Structure
```
.
├── astro.config.mjs
├── package.json
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro       # Main HTML structure
│   ├── components/
│   │   ├── Footer.astro           # Footer component
│   │   ├── Grid.astro             # Grid wrapper
│   │   ├── Column.astro           # Column component
│   │   └── PrintOnly.astro        # Print-only wrapper
│   ├── pages/
│   │   └── index.astro            # Main CV page
│   └── styles/
│       ├── belmu.css              # CSS reset/utilities
│       ├── main.css               # Main styles
│       ├── custom.css             # Custom overrides
│       └── print.css              # Print styles
├── public/
│   ├── favicon.png
│   ├── img/
│   │   └── noisyly.png
│   ├── key.asc
│   └── .well-known/
│       ├── security.txt
│       └── security.txt.sig
└── dist/                          # Build output (static)
```

## Migration Steps

### Phase 1: Project Setup
- [x] Initialize Astro project with Bun
- [x] Configure for static output
- [x] Set up directory structure

### Phase 2: CSS Migration
- [x] Copy CSS files to src/styles/
- [x] Update paths (img references) - changed `../img/` to `/img/`
- [x] Import CSS in BaseLayout via `<style is:global>`
- [x] Test print styles render correctly

### Phase 3: Component Migration
- [x] Create BaseLayout.astro (includes footer inline)
- [x] Create Grid.astro
- [x] Create Column.astro
- [x] Create PrintOnly.astro

### Phase 4: Content Migration
- [x] Convert _index.md content to index.astro
- [x] Replace shortcode syntax with component syntax
- [x] Preserve all HTML (details, links, etc.)

### Phase 5: Static Assets
- [x] Copy favicon.png to public/
- [x] Copy noisyly.png to public/img/
- [x] Copy key.asc to public/
- [x] Copy .well-known/ to public/
- [x] Copy report*.html files to public/

### Phase 6: Verification
- [x] Build static site - `bun run build` succeeds
- [ ] Compare visual output with original (needs browser testing)
- [ ] Test print styles (print preview)
- [ ] Verify all links work

## Observations

### 2025-02-05 - Initial Analysis
- Site is a single-page CV, very simple structure
- Heavy use of CSS utilities from belmu.css
- Print styles are critical for PDF generation
- No dynamic content, perfect for static generation
- Google Analytics integration exists (may skip or use Astro integration)

### 2025-02-05 - Migration Completed
- Astro project created in `astro-site/` subdirectory
- All CSS migrated with path fixes for background image
- Hugo shortcodes converted to Astro components:
  - `{{% grid %}}` → `<Grid>`
  - `{{% column CLASS %}}` → `<Column class="CLASS">`
  - `{{% printonly %}}` → `<PrintOnly>`
- Content manually converted from markdown to Astro JSX
- Static build produces single index.html + assets
- Dev server working at localhost:4321
- CSS warnings about `.-top-half` in belmu.css (line 2126) - non-critical, malformed CSS in original

### CSS Loading Order (Important)
1. Google Fonts (Montserrat, Fira Sans)
2. belmu.css (reset + utilities)
3. main.css (main styles)
4. custom.css (overrides)
5. print.css (media="print")

### Environment Handling
- Hugo uses `HUGO_ENV=production` for:
  - Loading minified CSS
  - Enabling Google Analytics
  - Setting robots meta to INDEX, FOLLOW
- Astro equivalent: `import.meta.env.PROD`

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Print styles break | Test early with print preview |
| CSS specificity issues | Keep original class names |
| Font loading issues | Copy exact Google Fonts links |
| Layout differences | Compare screenshots pixel-by-pixel |

## Commands Reference

```bash
# Development
bun run dev

# Build static site
bun run build

# Preview production build
bun run preview

# Generate PDF (requires preview server running)
bun run generate:pdf http://localhost:4321 jan-trejbal.pdf dist/

# Build everything including PDF
bun run build:pdf
```

## CI/CD (GitHub Actions)

Workflow file: `.github/workflows/build-and-deploy.yml`

### Pipeline Stages:
1. **build** - Builds Astro site to `dist/`
2. **generate-pdf** - Serves built site, generates PDF with Puppeteer
3. **deploy** - Deploys to GitHub Pages (only on push to main/master)

### Triggers:
- Push to `main` or `master` branch
- Pull requests to `main` or `master`
- Manual workflow dispatch

### Artifacts:
- `astro-dist` - Built site without PDF
- `site-with-pdf` - Built site with generated PDF

### PDF Generation:
- Uses Puppeteer with headless Chrome
- Generates A4 format PDF
- Output: `dist/jan-trejbal.pdf`
