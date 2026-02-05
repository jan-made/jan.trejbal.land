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
- [ ] Initialize Astro project with Bun
- [ ] Configure for static output
- [ ] Set up directory structure

### Phase 2: CSS Migration
- [ ] Copy CSS files to src/styles/
- [ ] Update paths (img references)
- [ ] Import CSS in BaseLayout
- [ ] Test print styles render correctly

### Phase 3: Component Migration
- [ ] Create BaseLayout.astro
- [ ] Create Footer.astro
- [ ] Create Grid.astro
- [ ] Create Column.astro
- [ ] Create PrintOnly.astro

### Phase 4: Content Migration
- [ ] Convert _index.md content to index.astro
- [ ] Replace shortcode syntax with component syntax
- [ ] Preserve all HTML (details, links, etc.)

### Phase 5: Static Assets
- [ ] Copy favicon.png to public/
- [ ] Copy noisyly.png to public/img/
- [ ] Copy key.asc to public/
- [ ] Copy .well-known/ to public/

### Phase 6: Verification
- [ ] Build static site
- [ ] Compare visual output with original
- [ ] Test print styles (print preview)
- [ ] Verify all links work

## Observations

### 2024-02-05 - Initial Analysis
- Site is a single-page CV, very simple structure
- Heavy use of CSS utilities from belmu.css
- Print styles are critical for PDF generation
- No dynamic content, perfect for static generation
- Google Analytics integration exists (may skip or use Astro integration)

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
```
