# Reviewer fixes — role attribution, section order, Connect conversion

**Date:** 2026-08-05
**Branch:** develop
**Status:** Approved, implementing

## Goal

Three fixes from a portfolio review:

1. A reviewer cannot tell what the author personally wrote on either project.
2. Projects sit fourth, behind a twenty-item skills list — inventory before evidence.
3. Conversion is weak and buried: one email link at the very bottom, and the CV
   linked once in the topbar with no context or ask attached.

## Out of scope

Project screenshots. Raised in the same review and deliberately declined by the
author. Nothing here adds imagery.

## 1. Role attribution

### Evidence

Both project repos were cloned and read before any line was written, because a
role claim is a factual claim about a person and guessing at one is worse than
omitting it. Author names in git differ from the GitHub logins the API reports,
so counts are keyed on `%an`.

**Loopland** — 245 commits, three contributors. File touches by area:

| Author | `apps/api` | `apps/web` |
| --- | --- | --- |
| Amin El-Rifai | **233** | 56 |
| Nathalie Rosenkvist | 150 | **268** |
| Emilie Sengenbjerg | 50 | 17 |

`docs/centralbank-api.yaml`, the OpenAPI contract each group's amusement plugged
into, is solely the author's, as are both `railpack.json` files — the Railway
build config for the API and for the web app. `apps/api` is Laravel 13 on PHP 8.4
with Sanctum. The honest reading: he led the API, owned deployment, and was a
minority contributor on the web app.

**Yrco** — 454 commits, two contributors. Amin 433, Olof Björn 21. The author's
work spans client, server and packages; Olof's commits are onboarding copy,
Cloudinary videos and auth fixes. `apps/api` is Express with Mongoose.

### Copy

Author-ratified wording:

- **Loopland** — One of three. I led the Centralbank API — the Laravel service,
  its OpenAPI contract, and the deploys on Railway.
- **Yrco** — Built with one classmate. I owned the architecture and most of the
  implementation, and deployed it on Railway.

Deployment is stated in the role line because that is where "what the author did"
belongs. A `Railway` icon also joins the end of both tech rows, so the platform
appears as part of each stack as well — the role line carries the ownership, the
icon carries the fact.

`src/_includes/icons/railway.svg` is the official Simple Icons mark, taken from
source rather than redrawn, with `fill="#00808c"` applied to match every other
icon in the directory. Its `role="img"` and `<title>Railway</title>` give it an
accessible name, as with the rest of the tech row.

### The CV carried the same gap

`src/cv/amin_cv.tex` described both projects without ever saying what the author
did on either — the exact fault the review raised about the site. Both `\body`
entries now close with a role sentence mirroring the site's wording, and `Railway`
joins both `\cvproject` stack lists. Rebuilt with `pnpm cv`; `src/cv.pdf` is
regenerated and must be committed alongside the `.tex`.

Yrco's line leads with the collaboration rather than the 95% commit share. That
was a deliberate choice between three offered framings.

### Rendering

A `role` field returns to `src/_data/projects.js` — the field the 2026-07-31
revision removed. It comes back without the device that got it removed: that
version carried a `2px solid #dbd56e` left border and was the only structural
accent on the page.

Role carries a block label — `.skills-group-label` in the projects accent, at the
same 1.125rem size, tracking, weight, `padding-bottom` and `1px solid #dcdcdc`
hairline. Both sit on white and Projects runs directly into Skills, so a
near-miss on any of those would read as a mistake rather than a decision. It
differs in two values: colour, and a `margin-bottom` of `0.75rem` against Skills'
`1.25rem` (see the height pass below).

The size was arrived at over three passes: `0.8125rem` read too quiet against the
body text and the width of its own rule; `1rem` matched the other two labels but
left each of them smaller than the text underneath; `1.125rem` is where it sits.
That is the ceiling — `span.section-label` is `1.25rem`, and a sub-label at that
size stops being subordinate to the section heading above it.

The description carries no label. Sitting directly under the wordmark it is
self-evidently the description, and labelling it cost a rule and ~51px an entry
to say so. Role and Architecture are not self-evident, so they keep theirs.

### Height pass

With three labelled blocks per entry the section had grown to ~845px an entry on
desktop and ~1,080px on mobile — roughly 3.7 phone screens for a section sitting
third of five. The breakdown was the argument: 47% of an entry was body text and
**28% was label furniture**, chrome added over the preceding revisions rather than
content.

Two changes, no copy touched:

| | Before | After |
| --- | --- | --- |
| Entry, desktop | 845px | ~754px |
| Entry, mobile | 1,080px | ~989px |
| Label furniture | 233px (28%) | 142px (~19%) |

1. The `About` label removed, as above.
2. The gap between blocks pulled from `2.5rem` to `1.75rem`, and the label's
   `margin-bottom` from `1.25rem` to `0.75rem`. These two move together: shrink
   the label's own gap alone and it stops attaching to the paragraph it
   introduces and starts floating between two.

The label's `padding-bottom` was tried at `0.5rem` and put back to Skills'
`0.875rem` — the label's internal proportions are what tie it to Skills, so the
saving is taken from the gaps around it instead.

Mobile is still long, and what remains is text. Any further reduction costs the
engineering detail section 1b exists to surface, so it stops here.

The first cut set the label inline, and it read badly: the label sat left of the
first line while every wrapped line ran back underneath it, leaving the text
ragged against two different left edges. Block fixes that and matches how every
other labelled block on the page is built.

Each label is a `display: block` span **inside** its paragraph, not a sibling.
A sibling would add a child per label and silently break the desktop subgrid —
see below.

Order within an entry: **logo → description → role → architecture → tech → links.**

The field degrades like every other: omit `role` and the paragraph is skipped.

### Subgrid

`_projects.scss` pins each entry to a subgrid so both columns align at desktop.
The row count is the number of children an entry renders, and adding one without
raising both `grid-template-rows` and `grid-row` breaks alignment silently — the
columns simply stop lining up, with no build error and no console warning. It
went four → five with `role`, then five → six with `architecture`.

## 1b. Loopland described as integration work

The original copy described the product — an amusement park with stamps, currency
and a leaderboard — and left the engineering untold. The actual problem was
integration: one API consumed by clients that other groups wrote, on a schedule
nobody controlled, with no ability to review or change the calling code.

Evidence in the repo: `docs/centralbank-api.yaml` is 1,646 lines of OpenAPI 3
across 20 paths. Amusements are third-party apps registered through the API, each
issued its own `api_key` (shown once, regenerable via
`POST /amusements/{id}/regenerate-key`). To act for a player, a game is handed a
short-lived identity token minted by the web app rather than any player
credential. That is the design constraint worth stating: the contract had to be
published first because the code on the other side was being written elsewhere.

Rather than swell the description to hold this, each entry gains a third labelled
block. An entry is now **About** (what the product is) → **Role** (what the author
owned) → **Architecture** (how it is built). About returns to a short product
description; Architecture carries the engineering.

`Architecture` was chosen over `Challenge` and `Engineering`: one word, matching
the rhythm of the two labels beside it, and accurate for both entries — Loopland's
OpenAPI contract across an org boundary, Yrco's shared Zod schema package across
the client/server boundary. Role stays second because "a reviewer can't tell what
you wrote" was the original complaint, and Architecture sits directly above the
tech icon row it pairs with.

Yrco's role line dropped its stack list — "React, Express, MongoDB, LinkedIn
OAuth" — which both the Architecture block and the icon row now carry. It states
ownership only.

It keeps the word *architecture*, by the author's preference, even though the
label directly beneath it repeats the word. Read in order the repetition works as
a hand-off: Role claims ownership of the architecture, and the block under it is
that architecture. The CV uses the same word for the same reason.

The subgrid moves from five rows to six. Both entries define `architecture`, so
the columns stay aligned.

The CV carries a compressed version of the same story. It had to be compressed:
the full wording pushed the document to two pages, spilling the Languages section
alone onto page 2. `delegated identity tokens` replaces the sentence explaining
what they do, and the site keeps the full explanation. Page count is part of
verification for any future CV edit.

## 2. Projects above Skills

`src/index.njk` include order changes; `nav.njk` swaps its two list items.
`data-link-id` renumbers so Projects is `3` and Skills is `4`, keeping the ids in
document order. `_nav.js` matches sections to links by that attribute alone, so
either numbering works — this one stays readable.

Section backgrounds are unaffected: Skills and Projects are both white, so the
page rhythm remains white → teal → white → white → orange.

## 3. Connect

The pitch states the ask with the author's real dates, which until now lived only
in the About sidebar:

> I'm looking for a LIA internship from 23 November 2026 to 28 May 2027 — six
> months where I can contribute to thoughtful software alongside people who care
> about what they're building.

Dates are wrapped in `<time datetime>` matching About's markup.

CV and email become one action row directly under the pitch, above the social
icons. The CV link is labelled and states its format; the email stays plain text
so the address itself is readable and copyable.

The topbar CV link stays. It costs nothing, gives persistent access from any
scroll position, and Connect now carries the labelled contextual one.

## Files

| File | Change |
| --- | --- |
| `src/_data/projects.js` | `role` field and `railway.svg` on both entries |
| `src/_includes/icons/railway.svg` | new — Simple Icons mark in the house teal |
| `src/cv/amin_cv.tex` | role sentences, Railway in both stacks |
| `src/cv.pdf` | rebuilt from the above |
| `src/_includes/_sections/projects.njk` | render role; `data-link-id` 4 → 3 |
| `src/_includes/_sections/skills.njk` | `data-link-id` 3 → 4 |
| `src/_includes/_sections/connect.njk` | new pitch, CV + email action row |
| `src/index.njk` | projects include above skills |
| `src/_includes/partials/nav.njk` | swap items, renumber ids |
| `src/assets/styles/includes/sections/_projects.scss` | 5-row subgrid, `.project-role`, `.project-label` |
| `src/assets/styles/includes/sections/_connect.scss` | `.connect-actions` |
| `src/assets/styles/includes/sections/_about.scss` | `.about-fact-label` to 1.125rem |

`.about-fact-label`, `.skills-group-label` and `.project-label` now share one
size, `1.125rem`. They are the same object on three surfaces — teal, white and white — so a
size that drifted between them read as an inconsistency rather than a choice.
About keeps tighter spacing below its rule: three facts stack in a 320px sidebar,
where the other two labels' `0.875rem` / `1.25rem` would push the last fact past
the bio beside it.

## 4. Accessibility pass

**Doubled skill labels.** Every file in `_includes/icons` carries a `<title>`,
because the projects tech row shows those icons with no visible label and the
title is their only accessible name. Skills shows the same icons beside a text
label, so each item's text content read `JavaScriptJavaScript`. The wrapper's
`aria-hidden` kept the duplicate out of the accessibility tree but not out of
`textContent`, so anything working from text — audits, extraction, indexing —
still saw both.

A `decorative` filter in `.eleventy.js` strips `<title>` from an included icon;
an `icon()` macro at the top of `skills.njk` applies it. That is the inline-SVG
equivalent of `alt=""`. The projects row deliberately keeps its titles, so the
same asset serves both uses without one breaking the other.

`Railway` also joins the Workflow group, beside Cloudflare.

**Portrait alt.** `alt=""` on the hero photo made it decorative, but it is the
only element on the page that shows whose site this is, and the `<h1>` beside it
never states a name. It is now `alt="Amin El-Rifai"`.

**`<h1>` at load.** No change required — this was already correct. The heading
ships complete in the markup:

```html
<h1>I translate <span class="hero-accent">visions&nbsp;</span><br class="break-mobile">into <span class="typewriter" style="color:#00808C">reality</span>.</h1>
```

Text content in the built file is `I translate visions into reality.` before any
script runs, so crawlers, no-JS readers and anyone with `prefers-reduced-motion`
get the full sentence. The typewriter swaps only the final word, and each word it
cycles to also completes the sentence.

The residual, not addressed here: for JS users who have not asked for reduced
motion, the `<h1>`'s accessible name changes every few hundred milliseconds and
is truncated mid-keystroke. Making the name static would mean hiding
`.typewriter` from assistive tech and pairing it with a visually hidden word —
a behaviour change beyond this pass.

## Verification

No test suite — this is a static Eleventy site. Verification is:

1. `pnpm build` succeeds and `public/index.html` contains both role lines, the
   dated ask, and `/cv.pdf` inside the Connect section.
2. Projects precedes Skills in the built HTML, and nav order matches.
3. Nav highlighting still tracks the right section after the id renumber.
4. At desktop width both project columns still align row for row — the subgrid
   change is the one failure that is invisible to a build.
