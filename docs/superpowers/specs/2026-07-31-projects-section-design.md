# Projects section — design

**Date:** 2026-07-31
**Branch:** canary
**Status:** Approved, ready for implementation planning

## Goal

Replace the empty `#yrco` placeholder with a `#projects` section that showcases Yrco — a
four-person school project — and accepts further projects later without markup changes.

## Scope

In scope: the new section, its data file, its stylesheet, the Yrco brand mark, and the
nav/index wiring that points at it.

Out of scope: the lorem ipsum still sitting in Home, About and Skills. Those are untouched.

## Content

### Section

- Label: `Projects`
- Heading: `Work I'm proud of.`

Heading voice matches the existing sections — short declarative sentences ending in a
period, as in "A developer, end to end." and "A modern, full-stack toolkit."

### Yrco entry

- **Tagline (h3):** Where first impressions come in full colour.
- **Description:** A networking app for the evening Yrgo's design and web development
  students meet the industry. Everyone who attends picks seven traits that define them,
  and those traits become a palette that is theirs alone — so you can read the room by
  colour, find the people who complement you, and leave with the connections worth keeping.
- **Role:** A four-person school project. I built the application end to end — React front
  end, Express API, MongoDB, and LinkedIn OAuth.
- **Tech:** React 19, Express 5, MongoDB, LinkedIn OAuth, Tailwind v4, Turborepo
- **Links:** `https://yrco.se` (labelled `yrco.se`) and `https://github.com/amin/yrco`
  (labelled `GitHub`, with the Octicons mark). No other links.
- **Palette:** `#453C62` `#D89B6C` `#E37475` `#523249` `#D7D3E4` `#EDEFBA` `#DBD56E`

The role line is first-person and factual: 433 of the repo's 451 commits are the author's.

## Layout

One full-width row per project, visual on one side and copy on the other, sides alternating
down the list. Chosen over a card grid because there is exactly one project today — a grid
would render as one real card beside empty holes — and over featured-plus-list because rows
give every future project equal weight.

```
┌───────────────────────────── section#projects ─────────────────────────────┐
│  PROJECTS                                                                  │
│  Work I'm proud of.                                                        │
│                                                                            │
│  ┌──── .project (odd) ────────────────────────────────────────────────┐    │
│  │  ┌─ .project-visual ─┐   ┌─ .project-copy ──────────────────────┐  │    │
│  │  │  7 palette tiles  │   │  ▬▬▬▬▬▬▬ palette strip               │  │    │
│  │  │  + logomark tile  │   │  ◕ yrco                              │  │    │
│  │  │  "Seven traits    │   │  Tagline (h3)                        │  │    │
│  │  │   → one palette"  │   │  Description                         │  │    │
│  │  │                   │   │  │ Role (accent left-border)         │  │    │
│  │  │                   │   │  ( React 19 )( Express 5 )( … )      │  │    │
│  │  │                   │   │  yrco.se    GitHub                   │  │    │
│  │  └───────────────────┘   └──────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│  ┌──── .project (even) — row-reverse, visual on the right ────────────┐    │
└────────────────────────────────────────────────────────────────────────────┘
```

Below `tablet` (740px) each row collapses to a single column, visual first.

### Visual block

A four-column grid of eight rounded tiles: the seven palette colours, plus a dashed eighth
tile holding the coloured logomark. Caption underneath: "Seven traits → one palette". The
grid is a direct restatement of the product concept, which is why it earns the space.

### Name lockup

The copy column opens with a horizontal lockup — the coloured logomark at ~29px beside the
project name set in EB Garamond, coloured `$projects-accent`. The mark therefore appears
twice per row, once small inside the tile grid completing the eight-cell block and once at
lockup size introducing the copy. This is intentional and reads as two different objects, not
a duplicate.

### Palette strip

A thin rounded seven-colour strip sits at the top of the **copy column**, not at the top of
the section. On a section named "Projects", a Yrco-coloured band spanning the section header
would misattribute Yrco's brand to every project below it. Inside the row it belongs to the
project, and project two brings its own.

## Data

`src/_data/projects.js` — Eleventy's global data directory (`dir.input` is `src`), exposing
`projects` to templates. ESM `export default`, consistent with `"type": "module"`.

```js
export default [
  {
    name: "Yrco",
    logomark: "icons/brand/yrco.svg",   // optional
    tagline: "…",
    description: "…",
    role: "…",
    tech: ["React 19", "Express 5", "MongoDB", "LinkedIn OAuth", "Tailwind v4", "Turborepo"],
    palette: ["#453C62", "#D89B6C", "#E37475", "#523249", "#D7D3E4", "#EDEFBA", "#DBD56E"],
    links: { live: "https://yrco.se", github: "https://github.com/amin/yrco" },
  },
];
```

Adding a project is one object. `palette` drives both the strip and the tiles, so the same
markup renders any project's colours. Fields degrade individually:

| Field | Omitted |
| --- | --- |
| `logomark` | Name renders in EB Garamond, no mark |
| `palette` | Strip and tile grid are both skipped; visual column omitted |
| `role` | Role paragraph skipped |
| `links.live` / `links.github` | That link is skipped |

`logomark` is a path under `_includes`, included via Nunjucks `{% include %}`, matching how
`skills.njk` pulls in its icons. Because `include` needs a literal path, the loop resolves it
with `{% include project.logomark %}` — supported by Nunjucks with a variable expression.

**Build risk to verify:** `.eleventy.js` registers `js` as a template format with a custom
extension handler. Eleventy excludes the data directory from template processing, so
`src/_data/projects.js` should not hit that handler — confirm with a build. If it does,
fall back to `projects.json`.

## Styling

`src/assets/styles/includes/sections/_projects.scss` — the file already exists, empty, and
is already `@forward`ed from `sections/_index.scss`. No index changes needed.

Follows the house pattern established by `_skills.scss` and `_connect.scss`:

- `@use "../../utils/mq";` at the top, then `$projects-accent: #453c62;`
- Section canvas stays white — the default. Page rhythm becomes
  white → teal → white → **white** → orange.
- `.section-label` and headings inherit from `base/_typography.scss`; only colour is set.
- Tech pills use `1px dashed $projects-accent`, matching the dashed rules already in
  `_skills.scss`, `_about.scss` and `_connect.scss`.
- Row split at `@include mq.mq($from: tablet)`; alternation via
  `&:nth-child(even) { flex-direction: row-reverse; }` inside that query, so mobile always
  stacks in source order.
- Role paragraph carries a `2px solid #dbd56e` left border — the one place Yrco's chartreuse
  appears as a structural accent.
- Links are underlined via `border-bottom`, matching the hover treatment in `_connect.scss`.

## Brand mark

Source: Figma `9M781fMdIKwG42o1X3y3jO`, page `Logotype`, symbol `logomark-individual`
(`1684:4705`) — the logomark as three separate overlapping capsules rather than one merged
black shape.

Saved to `src/_includes/icons/brand/yrco.svg`, alongside the existing brand icons. Two
changes from the Figma export: the `#F5F5F5` backing rectangle is removed so the mark sits on
any surface, and each capsule takes an explicit fill.

| Capsule | Fill |
| --- | --- |
| Vertical (drawn first) | `#453C62` plum |
| Horizontal | `#DBD56E` chartreuse |
| Diagonal 45° (drawn last, on top) | `#E37475` coral |

The pale colours sit underneath deliberately: chartreuse or lavender as the top shape washes
out against a white canvas.

## Files

| File | Change |
| --- | --- |
| `src/_data/projects.js` | new |
| `src/_includes/_sections/projects.njk` | `git mv` from `yrco.njk`, then rewritten |
| `src/_includes/icons/brand/yrco.svg` | new |
| `src/assets/styles/includes/sections/_projects.scss` | fill in (exists, empty) |
| `src/_includes/partials/nav.njk` | `#yrco` → `#projects`, "Yrco" → "Projects" |
| `src/index.njk` | include path `_sections/yrco.njk` → `_sections/projects.njk` |

`data-link-id` stays `4`; Connect stays `5`.

## Verification

No test suite exists — this is an Eleventy static site. Verification is:

1. `npm run build` completes without error, and `public/index.html` contains the rendered
   project entry (proves the data file was picked up, not silently skipped).
2. `npm run dev`, then confirm in the browser: nav "Projects" scrolls to the section and
   highlights on scroll (`_nav.js` matches `section.section` against `data-link-id`, so this
   is generic — but confirm, since the id changed).
3. Both links open the right targets in a new tab.
4. Check the tablet breakpoint boundary at 740px — row splits, and nothing overflows at 320px.

## Open items

None. Colourway and heading text were author-approved decisions recorded above.

---

## Revision, 2026-07-31 — stripped back to the page's vocabulary

Seeing the section rendered in place, the author judged it heavier than the rest of the
page. That was correct: every other section is plain text whose only decorative device is a
1px dashed rule. This section had filled colour tiles, a rounded palette strip, six
border-pilled tech items and a coloured left-border — it was the only section on the page
carrying chrome.

Superseded by this revision:

| Was | Now |
| --- | --- |
| Visual column: 4×2 grid of palette tiles + caption | Visual column: the coloured mark with the project name beneath, left of the copy |
| Palette strip above the copy | Removed |
| Name lockup inside the copy column | Removed — the mark now names the project from the left column, so it appears once, not twice |
| Tech as six dashed pills | `Built with` label + interpunct-separated line, styled as a near-copy of `.skills-group-label` |
| Role with a `#dbd56e` left border | Plain muted paragraph |
| `palette` field in the data file | Removed — nothing rendered it |

`links`, `tech`, `role`, `tagline`, `description` and `logomark` are unchanged, as is the
alternating `nth-child(even)` row direction for future projects. Yrco's colour now enters
the page through exactly one object: the three-capsule mark.
