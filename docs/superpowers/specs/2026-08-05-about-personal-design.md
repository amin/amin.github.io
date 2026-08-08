# About — a bio a person could have written

**Date:** 2026-08-05
**Branch:** develop
**Status:** Implemented

## Goal

The About bio was well-formed and said nothing only its author could say:

> I've always wanted to understand what happens beneath the interface—how
> requests move, how users are authenticated, and how separate parts become one
> system.
>
> The parts I enjoy most are the ones other people build on: APIs, auth, and the
> foundations that keep everything connected.

Both sentences describe a disposition. Neither offers evidence for it, and any
careful backend-leaning developer could sign them unchanged. Give the claim
something to stand on.

## Copy

```
I’m interested in the whole system — not just what appears on the screen, but
where a request goes, what decides who gets in, and how separate parts become
one reliable product.

That started in high school, when I ran a Minecraft server hosting company for
paying customers and learned what breaks when no one is watching. Eight years at
Volvo showed me the same thing at scale. Today it draws me
toward services, integrations, and the infrastructure that connects them.
```

Heading unchanged: `A developer, end to end.` Facts unchanged: `Currently`,
`Based in`, `Looking for`.

## Word budget

The bio was capped at 50% growth for most of this work, measured with em dashes
normalised to separators on both sides — the old copy held the site's only tight
dash (`interface—how`), which `wc -w` scores as one token:

```sh
sed 's/—/ /g' bio.txt | wc -w
```

Original 45 words, cap 67.5. Three drafts were built to hit exactly 67.

**The cap was then lifted by the author**, whose own revision ran to 94 words.
Shipped copy is 82. It is recorded here because the cap shaped every earlier
draft — including two whose cuts are described below and which now read as
strangely terse without knowing why.

## Structure

**Amended 2026-08-08: same structure, new closing sentence.** The section lost
two sentences and gained one. Both losses were the sentences holding no concrete
noun — the Volvo clause (see below) and the close, `Today it draws me toward
services, integrations, and the infrastructure that connects them`, which
restated sentence one's triad in sentence one's shape two paragraphs later. That
is the fault the author named, and it is the one this spec's own Register
section invites: a triad resolving on the general case is the house
construction, and used twice in one section it reads as a tic rather than a
voice.

The bio was cut to a single paragraph and then split again within the hour. The
structure described below survives that round trip intact, and the reason is the
argument below: without a present-tense close the section ends in high school.

The new close:

```
Today it points at the whole of a product: the interface, the service under it,
and the deploy that puts it in front of people.
```

It lists things rather than ideas, and `the deploy` is the only claim on the
site made in prose rather than icons — both projects are live at their own
domains. Pairing an interface with the API behind it was the obvious
alternative and would have restated `home.njk`.

**Paragraph one answers the heading.** `A developer, end to end.` claims breadth,
so the first line stays on that axis: `the whole system`, then a triad tracing a
request across it. An earlier draft opened on `what is underneath`, which
promised depth against a heading claiming reach — the two ran on different axes
and the join was visibly hard. This was the last problem fixed and the one that
took longest to name.

**Paragraph two is the only history on the site, and it resolves to the
present.** It opens in the past (`That started in high school`) but closes on
`Today it draws me toward…`, landing in the same present tense Home, Skills and
Connect use throughout. The past is bracketed rather than narrated.

That bracketing is what makes the history admissible. An earlier draft told it as
a straight chronology across three paragraphs and read as lifted from a cover
letter. The diagnosis, which is the durable part of this spec:

- **Stance.** Every narrative paragraph on the page states what is currently true
  — `I'm a full-stack developer in training`, `I use AI throughout my workflow`,
  `I'm looking for a LIA internship`. A past-tense bio was the only paragraph
  describing what happened rather than what is.
- **Volume.** Home, Skills and Connect run one paragraph each. Three made About
  visibly a different kind of section.
- **Anchoring.** The only past tense elsewhere is in project role lines — `I led
  the Centralbank API` — where it attaches to a named artifact the reader can go
  and look at. A career narrative has no such anchor unless it earns one.

## The Volvo years

**Superseded 2026-08-08: the sentence was cut.** The reasoning below still
describes why it was written and why it named no role — both hold — but stripped
of a role it was left asserting an equivalence with nothing under it, and it was
the only sentence in the paragraph containing no concrete noun. That is what
made it read as machine-written, which is the fault the author identified. The
years stay on the CV. Restore them here only with a specific observation
attached; the rest of this section records what any such sentence must avoid.

Eight years assembling trucks (September 2016 – October 2024, per
`src/cv/amin_cv.tex`) were cut from an earlier draft and restored here. The cut
was right for that draft and wrong in general: stated as biography the years were
inert, a gap with nothing attached. Attached to the thesis — the same
interdependence at industrial scale — they become evidence that the interest
predates the career change by a decade.

The clause names no role, after three that each misrepresented something.
`production systems` reads to a developer as prod environments, implying software
experience at Volvo the CV does not support. `assembly line` and `building trucks`
both reduce the eight years to assembling, when `src/cv/amin_cv.tex` also carries
Union Representative (Sep 2022 – Oct 2024) and Team Leader (Oct 2024 – Feb 2025).
Naming the union role here would be wrong regardless: it sits under IF Metall, not
Volvo, and Team Leader falls after the eight years rather than inside them.

The sentence exists for the observation, not the résumé. A role invites the reader
to weigh it; none keeps the focus on what the years showed, and the CV is one
click away for the rest.

## Provenance

A bio is a set of factual claims about a person, so each is sourced rather than
inferred. The hosting company comes from the author directly. `high school` is
NTI Gymnasiet Johanneberg, 2011–2014, per `src/cv/amin_cv.tex`, as are the Volvo
dates. `paying customers` is literal and load-bearing: it separates a company
from a hobby, and it is why `what breaks when no one is watching` was a
consequence rather than an abstraction.

## Register

The page voice: full declarative sentences, no fragments, concrete enumeration
after a colon, and a triad resolving on the general case — the construction
`projects.js` already uses.

`not just what appears on the screen` is the one line pitched at a reader who is
not a developer. A LIA application is screened before it is read by engineers,
and nothing else in the section is legible to that reader.

Two register experiments were written and reverted at the author's direction: one
warmed the voice (contractions, short sentences, a fragment carrying the turn),
another added a `Hi, I’m Amin!` greeting to the heading. Both were rejected as not
fitting the page.

## Facts sidebar

Unchanged — `Currently`, `Based in`, `Looking for`, in that order.

`Looking for` stays last. It is the ask, last is the strongest slot, and anything
appended after it buries what the page exists for. A template comment records
this. A `Daily driver — Linux, on everything I own.` entry was added third and
then removed at the author's direction. Skills later took `Linux` on its own
mark, so the distro name no longer appears anywhere.

## Adjacent fixes

Not About, but shipped alongside it.

### Connect — the CV button

`Download CV (PDF)` becomes `View CV`, at the author's direction. The link still
points at `/cv.pdf` and browsers render it inline, so the label is accurate, and
it now matches the topbar's bare `CV`.

Dropping `(PDF)` also dropped the cue telling a user what would open, so the
accessible name carries it instead: `aria-label="View CV (PDF)"`. The label
contains the visible text verbatim, which is what WCAG 2.5.3 (Label in Name)
requires of any `aria-label` placed over visible words — a speech-input user
saying "view CV" still matches. No CSS was needed, so no visually-hidden utility
was introduced for a single use.

### Header — the logotype was lazy-loaded

`loading="eager"`, overriding the image plugin's global `defaultAttributes:
{ loading: "lazy" }` in `.eleventy.js`. The logotype sits at the top of a sticky
header and is above the fold on every load; deferring it only delayed it. This is
the same bug `home.njk` already documents fighting for the hero — that fix was
applied per-image, so the logo never received it.

No `fetchpriority`. The hero is the LCP element and already asks for `high`;
raising a 231px logo to match would put the two in competition for the same early
bandwidth.

### Considered and rejected: the hero's intrinsic dimensions

The hero `<img>` carries `width="1125" height="750"` while CSS renders it
`375×375` (desktop) and `250×250` (mobile), square, under `object-fit: cover`.
The mismatch is real and was investigated as a CLS risk. It is inert:

- `app.css` is a render-blocking `<link>` in `<head>`, so nothing paints before
  CSS applies.
- The CSS sets *both* dimensions explicitly at both breakpoints, so the
  attribute-derived aspect ratio is never consulted for layout.
- There is no correct replacement value. Two breakpoints render two different
  squares; the attributes take one pair. Any choice would be wrong at one
  breakpoint and false about the file at both.

`1125×750` is the honest intrinsic size of the JPEG, which is what the attributes
are for. Left alone deliberately.

## Typography

- Curly apostrophes (`’`, U+2019), matching existing copy.
- Em dashes spaced, matching every other one in `src/`. The rewrite retires
  `about.njk:7`'s tight dash, previously the only exception on the site.

## Verification

`pnpm build`, then in `public/index.html`:

- `<h2>` reads `A developer, end to end.`
- Two paragraphs inside `.about-bio`, the second closing on `in front of
  people.` — see the 2026-08-08 amendment under Structure.
- Exactly three `.about-fact` entries, `Looking for` last. No `Linux` in the
  section.
- Both `<time>` elements in `Looking for` intact. They pair with identical values
  in `connect.njk`; the two must not drift.
- `.connect-cv` reads `View CV` and still points at `/cv.pdf`.
- No `.about-fact-label` markup changed — uncommitted work on that rule at
  1.125rem is in the tree and must survive untouched.

## Risks

The bio grows by 84% against a sidebar that did not grow, so the bio column runs
the taller of the two by more than before. `.about-grid` is
`align-items: flex-start` and nothing depends on them ending level, but the
balance is worth a look at tablet width.
