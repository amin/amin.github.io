# Projects Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the empty `#yrco` placeholder with a data-driven `#projects` section that showcases Yrco and accepts further projects without markup changes.

**Architecture:** Project content lives in `src/_data/projects.js`, an Eleventy global data file. `projects.njk` loops it and renders one full-width row per project — visual column on one side, copy on the other, sides alternating via `nth-child(even)`. Styling goes in the already-`@forward`ed but empty `_projects.scss`, following the `$accent`-variable-plus-`mq.mq()` pattern the other section stylesheets use.

**Tech Stack:** Eleventy 3, Nunjucks, Sass (compiled through a custom Eleventy extension), esbuild. No JavaScript changes — `_nav.js` discovers sections generically via `section.section` + `data-link-id`.

## Global Constraints

- **Spec:** `docs/superpowers/specs/2026-07-31-projects-section-design.md` is the source of truth for all copy, colours and structure. Copy strings must match it character for character.
- **No test framework exists.** This is a static site with no test runner and none is being introduced. The test cycle for every task is: run `npm run build`, then assert against the generated `public/index.html` or `public/assets/styles/app.css` with `grep`. A grep that must fail before implementation and pass after is this plan's equivalent of a failing test.
- **`public/` is gitignored.** Never `git add` build output.
- **Branch:** `canary`. Do not merge, rebase or push.
- **Palette (exact, uppercase hex):** `#453C62` `#D89B6C` `#E37475` `#523249` `#D7D3E4` `#EDEFBA` `#DBD56E`
- **Accent variable:** `$projects-accent: #453c62;` — lowercase in SCSS, matching `$skills-accent` and `$connect-accent`.
- **`data-link-id` for this section is `4`.** Connect is already `5`. Do not renumber anything.
- **Breakpoint mixin:** `@include mq.mq($from: tablet)` — never a raw `@media` query. `tablet` is 740px.
- **Existing lorem ipsum in Home, About and Skills is out of scope.** Do not touch those files.

---

### Task 1: Brand assets

Two inline SVG icons. Both follow the convention set by `src/_includes/icons/brand/react.svg`: no `width`/`height` attributes (CSS controls size), `role="img"`, a `<title>`, and a `viewBox`.

The Yrco mark comes from the Figma symbol `logomark-individual` — the logomark as three separate overlapping capsules rather than one merged shape. Two changes from the raw Figma export: the `#F5F5F5` backing rectangle is dropped so the mark sits on any surface, and each capsule gets its own fill. Draw order matters — the diagonal is painted last and sits on top, so the pale chartreuse stays underneath where it won't wash out against white.

`github.svg` is an addition beyond the spec's file table: the spec calls for the Octicons mark on the GitHub link, and no GitHub icon exists in the repo yet. The path is the same Octicons glyph already inlined in `connect.njk`, cleaned of its Inkscape metadata and normalised to a `0 0 16 16` viewBox. Leave `connect.njk` alone — cleaning that up is a separate job.

**Files:**
- Create: `src/_includes/icons/brand/yrco.svg`
- Create: `src/_includes/icons/brand/github.svg`

**Interfaces:**
- Produces: two include paths used by Task 3 — `icons/brand/yrco.svg` (referenced through the `logomark` data field) and `icons/brand/github.svg` (referenced literally).

- [ ] **Step 1: Create the Yrco mark**

`src/_includes/icons/brand/yrco.svg`:

```svg
<svg role="img" viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg"><title>Yrco</title><path d="M16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8V26C0 30.4183 3.58172 34 8 34C12.4183 34 16 30.4183 16 26V8Z" fill="#453C62"/><path d="M26 34C30.4183 34 34 30.4183 34 26C34 21.5817 30.4183 18 26 18H8C3.58172 18 0 21.5817 0 26C0 30.4183 3.58172 34 8 34H26Z" fill="#DBD56E"/><path d="M26.3773 18.9245C29.5015 15.8003 29.5015 10.735 26.3773 7.6108C23.2531 4.48661 18.1878 4.48661 15.0636 7.6108L2.33566 20.3387C-0.788534 23.4629 -0.788535 28.5282 2.33566 31.6524C5.45985 34.7766 10.5252 34.7766 13.6494 31.6524L26.3773 18.9245Z" fill="#E37475"/></svg>
```

- [ ] **Step 2: Create the GitHub mark**

`src/_includes/icons/brand/github.svg`:

```svg
<svg role="img" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>
```

- [ ] **Step 3: Verify both files are well-formed and free of the Figma backing rect**

Run:

```bash
node -e '
const fs = require("fs");
for (const f of ["src/_includes/icons/brand/yrco.svg", "src/_includes/icons/brand/github.svg"]) {
  const s = fs.readFileSync(f, "utf8");
  if (/F5F5F5/i.test(s)) throw new Error(f + ": Figma backing rect still present");
  if (/<rect/i.test(s)) throw new Error(f + ": unexpected <rect>");
  if (/\bwidth=|\bheight=/.test(s)) throw new Error(f + ": remove width/height, CSS sizes these");
  if (!/role="img"/.test(s) || !/<title>/.test(s)) throw new Error(f + ": missing role/title");
  console.log("ok", f);
}
const y = fs.readFileSync("src/_includes/icons/brand/yrco.svg", "utf8");
for (const c of ["#453C62", "#DBD56E", "#E37475"]) {
  if (!y.includes(c)) throw new Error("yrco.svg missing fill " + c);
}
if (y.indexOf("#E37475") < y.indexOf("#DBD56E")) throw new Error("coral must be painted last, on top");
console.log("ok yrco fills and draw order");
'
```

Expected: three `ok` lines, exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/_includes/icons/brand/yrco.svg src/_includes/icons/brand/github.svg
git commit -m "Add Yrco and GitHub brand marks"
```

---

### Task 2: Project data and section rewiring

This task deliberately renders almost nothing — just the project name. Its job is to prove the risky part of the design works before any real markup depends on it.

The risk: `.eleventy.js` registers `js` as a template format with a custom extension handler whose `permalink` returns `false` for anything outside `src/assets`. Eleventy is supposed to exclude the data directory from template processing, so `src/_data/projects.js` should never reach that handler — but it is unverified. Step 4 is the proof. If the build errors or the name never appears in the output, stop and convert the data file to `src/_data/projects.json` (dropping `export default`, leaving the array), then re-run.

The rename and the wiring go in this task too: `index.njk` and `nav.njk` reference the old filename and id, so splitting them out would leave the build broken between commits.

**Files:**
- Create: `src/_data/projects.js`
- Rename: `src/_includes/_sections/yrco.njk` → `src/_includes/_sections/projects.njk` (via `git mv`), then replace contents
- Modify: `src/index.njk` — the include path
- Modify: `src/_includes/partials/nav.njk` — fourth `<li>`

**Interfaces:**
- Produces: the global `projects` array, consumed by Task 3. Each entry: `name` (string), `logomark` (string, include path, optional), `tagline` (string), `description` (string), `role` (string, optional), `tech` (string[]), `palette` (string[], hex), `links` (`{ live?: string, github?: string }`).
- Produces: `section#projects[data-link-id="4"]` with a `.wrapper`, which Task 4 styles.

- [ ] **Step 1: Write the data file**

`src/_data/projects.js`:

```js
export default [
  {
    name: "Yrco",
    logomark: "icons/brand/yrco.svg",
    tagline: "Where first impressions come in full colour.",
    description:
      "A networking app for the evening Yrgo's design and web development students meet the industry. Everyone who attends picks seven traits that define them, and those traits become a palette that is theirs alone — so you can read the room by colour, find the people who complement you, and leave with the connections worth keeping.",
    role: "A four-person school project. I built the application end to end — React front end, Express API, MongoDB, and LinkedIn OAuth.",
    tech: ["React 19", "Express 5", "MongoDB", "LinkedIn OAuth", "Tailwind v4", "Turborepo"],
    palette: ["#453C62", "#D89B6C", "#E37475", "#523249", "#D7D3E4", "#EDEFBA", "#DBD56E"],
    links: {
      live: "https://yrco.se",
      github: "https://github.com/amin/yrco",
    },
  },
];
```

- [ ] **Step 2: Rename the section file and write the minimal loop**

```bash
git mv src/_includes/_sections/yrco.njk src/_includes/_sections/projects.njk
```

Then replace the contents of `src/_includes/_sections/projects.njk` with:

```njk
<section class="section" data-link-id="4" id="projects">
    <div class="wrapper">
        <span class="section-label">Projects</span>
        <h2>Work I'm proud of.</h2>
        <ul class="projects-list">
            {% for project in projects %}
            <li class="project">{{ project.name }}</li>
            {% endfor %}
        </ul>
    </div>
</section>
```

- [ ] **Step 3: Update the include and the nav**

In `src/index.njk`, change the fourth include:

```njk
    {% include "_sections/projects.njk"%}
```

In `src/_includes/partials/nav.njk`, replace the fourth `<li>`:

```html
        <li><a data-in-viewport="false" data-link-id="4" data-target="#projects" href="#projects">Projects</a></li>
```

Leave the Connect `<li>` on `data-link-id="5"` untouched. Neither file ends with a newline — keep it that way.

- [ ] **Step 4: Build and verify the data pipeline resolves**

Run:

```bash
npm run build && node -e '
const html = require("fs").readFileSync("public/index.html", "utf8");
const must = [
  ["section id=projects", /<section[^>]*id="?projects"?/],
  ["data-link-id 4 on section", /<section[^>]*data-link-id="?4"?/],
  ["nav points at #projects", /href="?#projects"?/],
  ["nav label", />Projects</],
  ["project name rendered from data", /Yrco/],
  ["old id gone", /#yrco/],
];
for (const [label, re] of must) {
  const hit = re.test(html);
  const want = label !== "old id gone";
  if (hit !== want) throw new Error("FAILED: " + label);
  console.log("ok", label);
}
'
```

Expected: six `ok` lines. `Yrco` appearing is the proof the data file was loaded — it exists nowhere in the templates.

If the build errors, or `Yrco` is absent, the `js` extension handler is intercepting the data file. Convert to `src/_data/projects.json` (plain JSON array, no `export default`), delete the `.js`, and re-run this step.

- [ ] **Step 5: Commit**

```bash
git add src/_data src/_includes/_sections/projects.njk src/_includes/partials/nav.njk src/index.njk
git commit -m "Turn the yrco placeholder into a data-driven projects section"
```

---

### Task 3: Full section markup

Fills in the real row. Every content field is guarded so a future project can omit `logomark`, `palette`, `role` or either link without the template breaking.

The live-link label is derived from the URL rather than stored, so the data stays as the spec defines it: `https://yrco.se` → `yrco.se`.

Note the mark appears twice per row by design — small inside the tile grid completing the eight-cell block, and at lockup size introducing the copy. They read as two different objects. Do not "deduplicate" this.

`{% include %}` accepts an expression in Nunjucks, so `{% include project.logomark %}` resolves the path from the data file against the includes directory.

**Files:**
- Modify: `src/_includes/_sections/projects.njk` (replace the `<li>` body from Task 2)

**Interfaces:**
- Consumes: the `projects` array from Task 2; `icons/brand/yrco.svg` and `icons/brand/github.svg` from Task 1.
- Produces: the class names Task 4 styles — `.projects-list`, `.project`, `.project-visual`, `.project-tiles`, `.project-tile`, `.project-tile--mark`, `.project-caption`, `.project-copy`, `.project-strip`, `.project-lockup`, `.project-logomark`, `.project-name`, `.project-description`, `.project-role`, `.project-tech`, `.project-links`.

- [ ] **Step 1: Confirm the content is not there yet**

Run:

```bash
grep -c "project-lockup" public/index.html || echo "absent, as expected"
```

Expected: `0` or `absent, as expected`.

- [ ] **Step 2: Write the full section**

Replace the entire contents of `src/_includes/_sections/projects.njk` with:

```njk
<section class="section" data-link-id="4" id="projects">
    <div class="wrapper">
        <span class="section-label">Projects</span>
        <h2>Work I'm proud of.</h2>
        <ul class="projects-list">
            {% for project in projects %}
            <li class="project">
                {% if project.palette %}
                <div class="project-visual">
                    <div class="project-tiles">
                        {% for colour in project.palette %}
                        <span class="project-tile" style="background:{{ colour }}"></span>
                        {% endfor %}
                        <span class="project-tile project-tile--mark">
                            {% if project.logomark %}{% include project.logomark %}{% endif %}
                        </span>
                    </div>
                    <p class="project-caption">Seven traits &rarr; one palette</p>
                </div>
                {% endif %}
                <div class="project-copy">
                    {% if project.palette %}
                    <div class="project-strip">
                        {% for colour in project.palette %}
                        <span style="background:{{ colour }}"></span>
                        {% endfor %}
                    </div>
                    {% endif %}
                    <div class="project-lockup">
                        {% if project.logomark %}
                        <span class="project-logomark">{% include project.logomark %}</span>
                        {% endif %}
                        <span class="project-name">{{ project.name }}</span>
                    </div>
                    <h3>{{ project.tagline }}</h3>
                    <p class="project-description">{{ project.description }}</p>
                    {% if project.role %}
                    <p class="project-role">{{ project.role }}</p>
                    {% endif %}
                    <ul class="project-tech">
                        {% for item in project.tech %}
                        <li>{{ item }}</li>
                        {% endfor %}
                    </ul>
                    <div class="project-links">
                        {% if project.links.live %}
                        <a href="{{ project.links.live }}" target="_blank" rel="noopener noreferrer">{{ project.links.live | replace("https://", "") }}</a>
                        {% endif %}
                        {% if project.links.github %}
                        <a href="{{ project.links.github }}" target="_blank" rel="noopener noreferrer">{% include "icons/brand/github.svg" %}GitHub</a>
                        {% endif %}
                    </div>
                </div>
            </li>
            {% endfor %}
        </ul>
    </div>
</section>
```

The `project-caption` text is fixed rather than data-driven — it describes Yrco's specific concept. When a second project with a palette is added, move it into the data file as an optional `paletteCaption` field and guard it. Not now: YAGNI.

- [ ] **Step 3: Build and verify every content element rendered**

Run:

```bash
npm run build && node -e '
const html = require("fs").readFileSync("public/index.html", "utf8");
const must = [
  ["heading", /Work I&#39;m proud of\.|Work I.m proud of\./],
  ["tagline", /Where first impressions come in full colour\./],
  ["description", /those traits become a palette that is theirs alone/],
  ["role", /A four-person school project\./],
  ["lockup", /project-lockup/],
  ["name", /project-name/],
  ["caption", /one palette/],
  ["live link", /href="https:\/\/yrco\.se"/],
  ["live label derived", />yrco\.se</],
  ["github link", /href="https:\/\/github\.com\/amin\/yrco"/],
  ["github label", /GitHub/],
  ["rel noopener", /rel="noopener noreferrer"/],
  ["yrco mark inlined", /<title>Yrco<\/title>/],
  ["github mark inlined", /<title>GitHub<\/title>/],
];
for (const [label, re] of must) {
  if (!re.test(html)) throw new Error("MISSING: " + label);
  console.log("ok", label);
}
const tiles = (html.match(/class="project-tile"/g) || []).length;
if (tiles !== 7) throw new Error("expected 7 palette tiles, got " + tiles);
const strip = (html.match(/project-strip/g) || []).length;
if (strip !== 1) throw new Error("expected 1 palette strip, got " + strip);
const tech = (html.match(/React 19|Express 5|MongoDB|LinkedIn OAuth|Tailwind v4|Turborepo/g) || []).length;
if (tech !== 6) throw new Error("expected 6 tech pills, got " + tech);
const marks = (html.match(/<title>Yrco<\/title>/g) || []).length;
if (marks !== 2) throw new Error("expected the mark twice (tile + lockup), got " + marks);
console.log("ok counts: 7 tiles, 1 strip, 6 tech, 2 marks");
'
```

Expected: fourteen `ok` lines plus the counts line.

- [ ] **Step 4: Commit**

```bash
git add src/_includes/_sections/projects.njk
git commit -m "Build out the Yrco project entry"
```

---

### Task 4: Section stylesheet

`src/assets/styles/includes/sections/_projects.scss` already exists, is empty, and is already `@forward`ed from `sections/_index.scss`. No index changes.

Follows the house pattern exactly: `@use "../../utils/mq";` first, then the accent variable, then everything nested under `section#projects`. The canvas stays white — the section sets no `background`, so the page rhythm becomes white → teal → white → white → orange.

The reset already gives `a { text-decoration: none; color: inherit }` and `svg { display: block; max-width: 100% }`, so links need an explicit colour but no `text-decoration` reset. Base typography sizes `h1`/`h2`/`p` but not `h3`, so `h3` needs an explicit `font-size` here.

**Files:**
- Modify: `src/assets/styles/includes/sections/_projects.scss` (currently empty)

**Interfaces:**
- Consumes: the class names produced by Task 3; `mq.mq()` from `utils/_mq.scss`.

- [ ] **Step 1: Confirm the compiled CSS has no projects rules yet**

Run:

```bash
grep -c "project-lockup" public/assets/styles/app.css || echo "absent, as expected"
```

Expected: `0` or `absent, as expected`.

- [ ] **Step 2: Write the stylesheet**

`src/assets/styles/includes/sections/_projects.scss`:

```scss
@use "../../utils/mq";

$projects-accent: #453c62;
$projects-highlight: #dbd56e;

section#projects {
    .section-label {
        color: $projects-accent;
    }

    h2 {
        margin-bottom: 3rem;
    }

    .projects-list {
        list-style: none;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 4rem;
    }

    .project {
        display: flex;
        flex-direction: column;
        gap: 2rem;

        @include mq.mq($from: tablet) {
            flex-direction: row;
            align-items: center;
            gap: 3.5rem;

            &:nth-child(even) {
                flex-direction: row-reverse;
            }
        }
    }

    .project-visual {
        flex: 1;
        min-width: 0;
    }

    .project-copy {
        flex: 1.15;
        min-width: 0;
    }

    .project-tiles {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0.55rem;
    }

    .project-tile {
        display: block;
        aspect-ratio: 1;
        border-radius: 0.55rem;

        &--mark {
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1.5px dashed #d2d2d2;

            svg {
                width: 60%;
                height: 60%;
            }
        }
    }

    .project-caption {
        font-size: 0.9rem;
        letter-spacing: 1px;
        text-align: center;
        color: #8a8a8a;
        margin-top: 0.7rem;
    }

    .project-strip {
        display: flex;
        height: 7px;
        border-radius: 99px;
        overflow: hidden;
        margin-bottom: 1.4rem;

        span {
            flex: 1;
        }
    }

    .project-lockup {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        margin-bottom: 0.9rem;

        svg {
            width: 1.8rem;
            height: 1.8rem;
        }
    }

    .project-name {
        font-family: "EB Garamond", serif;
        font-size: 1.8rem;
        letter-spacing: 1px;
        color: $projects-accent;
    }

    h3 {
        font-size: 1.6rem;
        margin-bottom: 0.75rem;
    }

    .project-description {
        max-width: 56ch;
        line-height: 1.65;
        margin-bottom: 1rem;
    }

    .project-role {
        font-size: 1.05rem;
        line-height: 1.55;
        max-width: 56ch;
        color: #666;
        border-left: 2px solid $projects-highlight;
        padding-left: 0.8rem;
    }

    .project-tech {
        list-style: none;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
        margin-top: 1.2rem;

        li {
            font-size: 0.8rem;
            letter-spacing: 1.1px;
            padding: 0.25rem 0.7rem;
            border-radius: 99px;
            border: 1px dashed $projects-accent;
            color: $projects-accent;
        }
    }

    .project-links {
        display: flex;
        gap: 1.5rem;
        margin-top: 1.4rem;

        a {
            display: inline-flex;
            align-items: center;
            gap: 0.45rem;
            font-size: 0.8rem;
            letter-spacing: 1.4px;
            text-transform: uppercase;
            color: $projects-accent;
            border-bottom: 1px solid $projects-accent;
            padding-bottom: 0.2rem;

            svg {
                width: 0.9rem;
                height: 0.9rem;
                fill: $projects-accent;
            }

            &:hover {
                color: #1a1a1a;
                border-bottom-color: #1a1a1a;

                svg {
                    fill: #1a1a1a;
                }
            }
        }
    }
}
```

- [ ] **Step 3: Build and verify the CSS compiled**

Run:

```bash
npm run build && node -e '
const css = require("fs").readFileSync("public/assets/styles/app.css", "utf8");
const must = [
  ["section scope", /section#projects/],
  ["accent applied", /#453c62/i],
  ["highlight border", /#dbd56e/i],
  ["tile grid", /repeat\(4,1fr\)|repeat\(4, 1fr\)/],
  ["alternating rows", /nth-child\(2n\)|nth-child\(even\)/],
  ["row-reverse", /row-reverse/],
  ["tablet breakpoint", /46\.25em/],
];
for (const [label, re] of must) {
  if (!re.test(css)) throw new Error("MISSING: " + label);
  console.log("ok", label);
}
'
```

Expected: seven `ok` lines. `46.25em` is 740px converted by the `mq` mixin — its presence proves the mixin was used rather than a raw media query.

- [ ] **Step 4: Commit**

```bash
git add src/assets/styles/includes/sections/_projects.scss
git commit -m "Style the projects section"
```

---

### Task 5: Browser verification

The build assertions prove content and CSS exist. They cannot prove the section *looks* right or that the nav still tracks it. This task is manual and produces no commit unless it uncovers a defect.

**Files:**
- None expected. Fix-ups land in the files from Tasks 3 and 4.

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

Serves on `http://localhost:8080`.

- [ ] **Step 2: Check the nav integration**

The section id changed from `#yrco` to `#projects`, so confirm:

- Clicking "Projects" in the nav smooth-scrolls to the section.
- Scrolling past the section makes "Projects" the highlighted link, and Skills/Connect take over on either side. (`_nav.js` reads `data-link-id` off `section.section` generically — this should just work, but the id change is exactly the kind of thing that silently breaks it.)
- On a viewport under 740px, opening the burger menu shows five items and tapping "Projects" closes the menu and scrolls.

- [ ] **Step 3: Check the layout at three widths**

- **1200px+** — row splits, visual left and copy right, tile grid square and not stretched.
- **740px** (the breakpoint boundary) — the row splits exactly here, nothing overlaps at 739px or 741px.
- **320px** — single column, visual first, no horizontal overflow. `body` has `overflow-x: hidden`, which hides overflow rather than fixing it, so check by shrinking the window rather than trusting the absence of a scrollbar.

- [ ] **Step 4: Check the seams and the links**

- Skills (white) above and Connect (orange) below still read as distinct sections with `#projects` between them.
- Both links open in a new tab: `yrco.se` and the GitHub repo.
- Hover on each link darkens text, border and the GitHub glyph together.

- [ ] **Step 5: Report**

If everything passes, report done — no commit. If anything is off, fix it in the Task 3 or Task 4 file, re-run that task's build assertion, and commit with a message describing the fix.

---

## Self-Review

**Spec coverage.** Section label and heading → Task 2. Tagline, description, role, tech, links, palette → Tasks 2 (data) and 3 (markup). Layout with alternating rows → Task 4. Visual block and name lockup → Task 3 markup, Task 4 styling. Palette strip in the copy column, not section-level → Task 3. Data shape and degradation guards → Tasks 2 and 3. Styling conventions → Task 4. Brand mark with the three fills and draw order → Task 1. File table → Tasks 1–4, with `icons/brand/github.svg` added and its reason stated. Verification steps 1–4 from the spec → Task 2 Step 4, Task 3 Step 3, Task 4 Step 3, Task 5. No gaps.

**Placeholders.** None. Every code step carries the full file contents or the exact replacement block; every verification step carries a runnable command and its expected output.

**Type consistency.** The data field names in Task 2 (`name`, `logomark`, `tagline`, `description`, `role`, `tech`, `palette`, `links.live`, `links.github`) are the exact names Task 3 reads. The class names Task 3 emits are the exact selectors Task 4 styles. `$projects-accent` is lowercase hex in SCSS and uppercase in the data file's palette — deliberate, and the Task 4 assertion is case-insensitive.

**One deliberate deviation from the spec**, flagged in Task 1: `src/_includes/icons/brand/github.svg` is not in the spec's file table. The spec asks for the Octicons mark on the GitHub link and the repo has no GitHub icon, so the file is required.
