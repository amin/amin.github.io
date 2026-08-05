# About — a bio a person could have written

**Date:** 2026-08-05
**Branch:** develop
**Status:** Approved, implementing

## Goal

The About bio is well-formed and says nothing only its author could say:

> I've always wanted to understand what happens beneath the interface—how
> requests move, how users are authenticated, and how separate parts become one
> system.
>
> The parts I enjoy most are the ones other people build on: APIs, auth, and the
> foundations that keep everything connected.

Both sentences describe a disposition. Neither offers evidence for it, and any
careful backend-leaning developer could sign them unchanged. Replace the
assertion with the fact that proves it, in a register a person recognises as
speech.

## Out of scope

The `<h2>`, the three existing facts, `.about-grid`, and `_about.scss`. The
sibling sections keep their voice — a warmer About against a measured Projects
and Skills is the intent, not a seam to be closed later. A sitewide voice pass
was considered and declined.

## Constraint

The bio grows by at most 50%. Measured on words, with em dashes normalised to
separators on both sides — today's copy contains the site's only tight dash
(`interface—how`), which `wc -w` scores as a single token and which would
otherwise flatter the rewrite by two points:

```sh
sed 's/—/ /g' bio.txt | wc -w
```

Current 45 words. Cap 67.5. Delivered 67, a 48.8% increase.

The cap is the binding constraint on this spec. Every cut below follows from it.

## Copy

```
I ran a Minecraft server hosting company in high school — paying customers,
other people’s worlds on my machines, and a fast education in what breaks when
nobody’s watching.

Then eight years at Volvo, building trucks instead of software. The pull never
left.

Now I’m back, drawn to the work nobody sees: APIs, auth, the layer everything
sits on. I build things because I like watching them work.
```

### Provenance

A bio is a set of factual claims about a person, so each is sourced rather than
inferred. The hosting company comes from the author directly. The Volvo span is
`src/cv/amin_cv.tex`: Truck Assembler, September 2016 – October 2024, which is
eight years. "High school" is NTI Gymnasiet Johanneberg, 2011–2014, from the same
file. Nothing here is rounded up.

The CV also lists Union Representative and Team Leader at Volvo. "Building
trucks" flattens both. This is a deliberate compression accepted by the author:
the paragraph exists to mark a gap and a pull, not to summarise a career, and the
CV carries the full record one link away.

### Why the arc

Three beats — ran servers young, left, came back wanting the same thing — rather
than the fact appended to the existing thesis. The company is what makes the
claim credible, and its date is what makes it interesting: the curiosity predates
the career change by a decade, so the reader meets someone returning to
something rather than starting from scratch. Stated beside the thesis it is
trivia; stated before it, it is the reason.

This also answers, without raising it, the question a LIA reader will otherwise
form about a career-changer's CV.

### Register

Warmer than the sibling sections and deliberately so. Contractions throughout,
no passive voice, sentence lengths varied hard — a fourteen-word paragraph
between two long ones. `The pull never left.` carries the turn alone.

The old copy's tell was its symmetry: three balanced clauses in the first
sentence, a matched construction in the second. Polish that even reads as
composed rather than spoken. None of the new sentences are parallel to each
other.

### What the cap cost

The budget would not hold both the story and the technical detail. Cut:

- `Where a request went, what decided you were allowed in, why separate parts
  hold together as one thing` — the most concrete line in the current bio.
- `Get that right and every other part gets easier.`

The triad went rather than the story because the brief was personal, and the
triad is the part any developer could have written. The rejected alternative,
recorded because it remains available: drop the Volvo paragraph instead, keeping
the origin and the triad and losing the return arc.

`that's the bit I enjoy` was also dropped from the final paragraph. It and
`I build things because I like watching them work` are both motive statements,
and back to back they blunt each other. The stronger one closes.

## Facts sidebar

One addition, third of four:

| Label | Value |
| --- | --- |
| Currently | unchanged |
| Based in | unchanged |
| **Daily driver** | **Linux, on everything I own.** |
| Looking for | unchanged, stays last |

Third, not fourth. `Looking for` is the ask, last is the strongest slot, and
anything appended after it buries the thing the page exists for.

`Linux`, not `Fedora`, at the author's direction. Skills keeps `Fedora (Linux)`:
there the entry is a tool and the distro is the useful detail, here it is a
statement about how its author works. The two are not in conflict, and the
difference is intended.

The label joins the `Currently` / `Based in` family — a status phrase, not a
noun. The entry reuses `.about-fact` and `.about-fact-label`; no new class, no
new rule.

### Why the sidebar and not the bio

Under a 67-word cap, a clause explaining Linux would cost the Volvo paragraph.
The sidebar is where small true facts already live, and it has the room: the bio
roughly doubles in height while `.about-facts` gains one entry, so the column
that was the taller of the two stops being so.

The spacing note in `_about.scss` — that three labels stack tight in a 320px
sidebar — was written when the bio was two paragraphs. A fourth entry needs no
CSS change; `.about-facts` is an unconstrained flex column with `gap: 2rem`.

## Typography

- Curly apostrophes (`’`, U+2019), matching existing copy.
- Em dashes spaced, matching every other one in `src/`. This retires
  `about.njk:7`'s tight dash, currently the only exception on the site.

## Verification

`pnpm build`, then in `public/index.html`:

- Three paragraphs inside `.about-bio`.
- Four `.about-fact` entries, in the order above, `Looking for` last.
- Both `<time>` elements in `Looking for` intact, values unchanged. They pair
  with the identical values in `connect.njk`; the two must not drift.
- No `.about-fact-label` markup changed — uncommitted work on that rule at
  1.125rem is in the tree and must survive untouched.

## Risks

The bio roughly doubles in height while the sidebar grows by one entry, so at
tablet width the two columns end at visibly different heights. `.about-grid` is
`align-items: flex-start`, so nothing breaks and nothing depends on them ending
level, but the balance changes and is worth looking at before the commit.
