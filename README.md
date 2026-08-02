<div align="center">

# amin.sh

My portfolio — a single page about who I am, what I build with, and what I have shipped.

Static from end to end. No client framework, no runtime, no server: Eleventy renders one HTML file at build time and GitHub Pages serves it.

[![Eleventy](https://img.shields.io/badge/Eleventy-3-00808C?logo=eleventy&logoColor=white)](https://www.11ty.dev/)
[![Sass](https://img.shields.io/badge/Sass-C65124?logo=sass&logoColor=white)](https://sass-lang.com/)
[![esbuild](https://img.shields.io/badge/esbuild-C65124?logo=esbuild&logoColor=white)](https://esbuild.github.io/)
[![pnpm](https://img.shields.io/badge/pnpm-00808C?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-00808C?logo=githubpages&logoColor=white)](https://amin.sh)

</div>

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| **Site** | Eleventy 3, Nunjucks templates |
| **Styles** | Sass, compiled through a custom Eleventy extension |
| **Scripts** | Vanilla ES modules, bundled by esbuild through a second extension |
| **Images** | `@11ty/eleventy-img` — AVIF, WebP and raster fallbacks generated at build time |
| **Output** | `html-minifier-terser` on every page |
| **Hosting** | GitHub Pages via Actions, custom domain behind Cloudflare |

Sass and JS are not a separate pipeline. `.scss` and `.js` are registered as template formats, so Eleventy treats them as pages and compiles them on the same pass that builds the HTML — one watcher, one build, no parallel tooling.

## Project Structure

```
amin.github.io/
├── .eleventy.js          Build config — passthrough, image plugin, Sass and JS extensions, HTML minify
├── CNAME                 Custom domain, passthrough-copied so the artifact carries it
├── src/
│   ├── index.njk         The only page
│   ├── _data/
│   │   ├── projects.js   Project list — adding one is a single object
│   │   └── site.js       URL, OG title, meta description
│   ├── _layouts/
│   │   └── base.njk      <head>, landmarks, skip link
│   ├── _includes/
│   │   ├── _sections/    home, about, skills, projects, connect
│   │   ├── partials/     nav, topbar
│   │   ├── icons/        Inlined SVG — brand/ holds logotypes, the rest are tech marks
│   │   ├── header.njk
│   │   └── footer.njk
│   └── assets/
│       ├── styles/
│       │   ├── base/     Reset, typography, skip link
│       │   ├── utils/    Breakpoints, colour roles, wrapper, spacing
│       │   └── includes/ Per-section stylesheets, mirroring _sections/
│       ├── js/           Nav and the hero typewriter
│       └── images/
└── .github/workflows/
    └── deploy.yml        Build, upload public/ as a Pages artifact, deploy
```

## Colour Roles

Two values that look like the same orange do different jobs, and the distinction is load-bearing:

| Token | Value | Use |
| --- | --- | --- |
| `$orange-surface` | `#f27b50` | Backgrounds only. Black on it is 7.7:1. |
| `$orange-ink` | `#c65124` | Text and UI marks on white. `#f27b50` is 2.7:1 there and fails every threshold. |

The teal `#00808c` was darkened from `#00939e` for the same reason — white on the original reached only 3.7:1, and no text colour fixes a background that light.

Logos are exempt from contrast rules, which is why the `./` mark keeps its pale `#d4d4d4` slash in all four places it appears.

---

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm

### 1. Clone and install

```bash
git clone https://github.com/amin/amin.github.io.git
cd amin.github.io
pnpm install
```

### 2. Start the dev server

```bash
pnpm dev
```

Serves on `http://localhost:8080` with live reload. No environment variables — there is nothing to configure.

---

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Eleventy with `--serve`, watching templates, Sass and JS |
| `pnpm build` | Production build into `public/` |

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes `public/` as a Pages artifact.

```
push to main
      │
      v
pnpm install --frozen-lockfile → pnpm build
      │
      v
upload-pages-artifact (path: public)
      │
      v
deploy-pages → GitHub Pages CDN → Cloudflare → amin.sh
```

Two things worth knowing before changing any of it:

- **`dir.output` in `.eleventy.js` and `path:` in the workflow must agree.** Pages never sees the directory name — the artifact's *contents* are published at the site root — so the coupling is only enforced by those two lines matching.
- **Repository Settings → Pages → Source must be "GitHub Actions".** Pointed at a branch instead, the workflow runs green and publishes nothing.
