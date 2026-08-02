<div align="center">

# amin.sh

My portfolio — a single page about who I am, what I build with, and what I have shipped.

Static from end to end. No client framework, no runtime, no server: Eleventy renders one HTML file at build time and GitHub Pages serves it.

[![Eleventy](https://img.shields.io/badge/Eleventy-3-222222?logo=eleventy&logoColor=white)](https://www.11ty.dev/)
[![Sass](https://img.shields.io/badge/Sass-CC6699?logo=sass&logoColor=white)](https://sass-lang.com/)
[![esbuild](https://img.shields.io/badge/esbuild-FFCF00?logo=esbuild&logoColor=black)](https://esbuild.github.io/)
[![pnpm](https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-222222?logo=githubpages&logoColor=white)](https://amin.sh)

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
│   ├── cv.pdf            Generated CV, committed and passthrough-copied to /cv.pdf
│   ├── cv/
│   │   └── amin_cv.tex   CV source — the only file to edit
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
├── scripts/
│   └── build-cv.sh       Compiles the CV in a TeX Live container
└── .github/workflows/
    └── deploy.yml        Build, upload public/ as a Pages artifact, deploy
```

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

## CV

The CV is written in LaTeX and served at [amin.sh/cv.pdf](https://amin.sh/cv.pdf). Edit `src/cv/amin_cv.tex`, then:

```bash
pnpm cv
```

That compiles it inside a TeX Live container — podman or docker, whichever is installed — and writes `src/cv.pdf`. Commit the `.tex` and the `.pdf` together; the build only copies the PDF, so a LaTeX error can never reach the deploy.

---

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Eleventy with `--serve`, watching templates, Sass and JS |
| `pnpm build` | Production build into `public/` |
| `pnpm cv` | Compiles `src/cv/amin_cv.tex` into `src/cv.pdf` |
