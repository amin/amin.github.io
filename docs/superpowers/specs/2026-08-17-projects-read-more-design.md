# Projects — Role and Architecture behind a Read more

**Date:** 2026-08-17
**Branch:** develop
**Status:** Implemented

## Goal

An entry currently says everything it knows the moment it is on screen. Logo,
description, Role, Architecture, stack, links — five blocks deep before the
next project starts, and on desktop two of those columns run side by side for
the better part of a screen each. The section is called "A few things that
shipped", and it reads like two case studies.

Role and Architecture are the two blocks a reader should be able to ask for.
The description is what the entry is selling; the monorepo layout and the token
design are what a developer wants after deciding the project is interesting.
Folding them away puts the whole section back within a screen and leaves the
detail one click from anyone who wants it.

## Form

A native `<details>`, with the summary drawn as a typographic disclosure: the
label in accent caps, the chevron inside a small outlined disc.

```
A digital amusement park assembled from
games each group in our class built on
its own.

R E A D  M O R E   (⌄)

[php][laravel][react][ts][…]

loopland.se     GitHub
‧‧‧‧‧‧‧‧‧‧‧     ‧‧‧‧‧‧
```

**Native `<details>` at the base.** The element is the control; script only
adds a height transition on top of it. That keeps three things nothing had to
be written for: it works with JavaScript off, the browser owns the keyboard
handling and the expanded state, and find-in-page opens it to reach the text
inside.

**The label is uppercase, at the smallest of the section's three cap sizes.**
1rem, 1.75px tracking, weight 500, in `$projects-accent`. That is the nav's
size with slightly tighter tracking and one weight more. `.project-label`
(ROLE, ARCHITECTURE) is 1.125rem at 2.5px, and `span.section-label` is 1.25rem
at 2px — so the control sits below both. It speaks the page's uppercase
language without competing with the two labels it reveals.

**The disc is what makes it a control.** A 1.75rem circle, 1px `#928da1`, the
chevron inset by `0.4rem`. The border is deliberately lighter than the label:
3.21:1 against white, perceivable without carrying the weight of a filled
object. On hover the disc fills with the accent and the chevron flips to white
— the one place the control raises its voice, and only for as long as the
pointer is on it.

### The four drafts before it

The sequence is the useful part, because each failure was a different one.

- *Short, dashed underline, sized to its two words.* It borrowed the exact
  size, colour, tracking and underline of `.project-links`, so it landed two
  lines above two links drawn identically — and, being the shortest of the
  three, the entry's primary action was the least conspicuous thing in the
  column.
- *The same underline running the `60ch` measure, chevron pushed to the far
  end.* Width was meant to do the separating. Instead the mark ended up some
  700px from its label and the row stopped reading as one thing: a heading, a
  long dotted divider, and a stray chevron at the edge. That layout is an
  accordion header, and an accordion header needs a container to hold its two
  ends together. This section has no containers.
- *The same rule with the chevron back beside the words.* The marooning was
  fixed and the underlying fault was not: a full-measure dashed line above the
  stack row reads as a divider between the control and what it opens, and the
  control still wore the links' clothes.
- *A filled block in the accent, white label, 2px corners.* This one solved the
  problem it was aimed at — nothing could confuse it with a link — and
  introduced a worse one. It is a large new shape in a section built from
  hairlines, dashed underlines and letterspaced caps, and at that size it
  competed with the wordmark above it for the entry's first look. Emphasis was
  never the actual requirement; distinctness was.

The first three share one fault: a treatment borrowed from the links cannot be
made to outrank the links. No amount of width changes what kind of object a
dashed accent underline is on this page. The fourth overcorrected — it stopped
being a link by becoming a button, which this section has no vocabulary for.

Caps plus a disc is the resolution. The type is drawn entirely from language
the page already speaks, and the disc — small, outlined, hollow — is the only
new mark, doing the one job the type cannot: saying this is a thing you press.

## Desktop alignment

The two entries share row heights through `grid-template-rows: subgrid`. A fold
one entry can enter and the other can leave has to give somewhere.

The first build gave each element a row of its own — logo, description, fold,
stack, links, five rows shared across both columns — on the reasoning that the
alignment was worth an empty row in the shut entry. On the page it was
indefensible. Open Yrco and Loopland's control sat marooned above most of a
screen of nothing, with its stack row and links pinned to the bottom of it. The
alignment was intact and the entry looked broken. Whitespace between a control
and the things it belongs to does not read as alignment; it reads as content
that failed to load.

What was wrong was the granularity, not the subgrid. An entry now hands the
grid three rows — logo, description, and `.project-body`, which carries
everything under the description. The wordmarks still sit on a shared baseline
and both descriptions still start on the same line, which is what the alignment
was ever really for. The third row is still shared and still sized to whichever
entry is taller, but it holds a block instead of a single element, so a shut
entry packs its control, stack row and links together directly under its
description and lets the leftover height fall away below them — off the end of
the column, where there is nothing to notice.

Two alternatives were considered and dropped. **Both open together**, one
control per row, never misaligns and never gaps, but gives up the per-project
control that is the point. **Dropping subgrid entirely** also closes the gap,
at the cost of the logo baseline and the shared description line, and it lets
one entry's fold shift the other's wordmark.

## Copy

`Read more` closed, `Read less` open. `Close` held the open state for a while,
on the reasoning that naming the action is shorter on the way out; the mirror
won because it reads as one control in two states rather than two controls, and
because only the mirror lets both states take the same hidden tail — "Read more
about Loopland", "Read less about Loopland". `Role and architecture` as the
closed label, which would tell the reader what is behind the fold before they
open it, was offered and declined.

## Accessibility

**Two real text nodes, swapped with `display`.** The obvious implementation is
`content:` on a pseudo-element switched by `[open]`, and it is wrong twice over:
generated content is not reliably announced, and browser translation never
touches it. Both labels are in the markup and the inactive one is removed from
the document — `display: none` rather than `.visually-hidden`, because the
inactive label must leave the accessibility tree, which is the opposite of what
that class is for.

**Each label names its project, hidden.** Two entries offering nothing but
"Read more" are two identically named controls in a controls list, with no way
to tell which is which. A `visually-hidden` tail inside each label fixes that
per state: "Read more about Loopland", "Read less about Loopland". This is the
idiom the file already had — the same tail rides inside Yrco's live link to say
"mobile only".

**The chevron says nothing.** `aria-hidden`, no `<title>`, like `phone.svg` and
`brand/github.svg`. The summary's own text is the accessible name, and the
browser supplies the expanded state.

**`min-height: 2.75rem` on the summary.** The label is 1rem on a single line,
which would leave the target well under 44px. The height is set on the control
rather than padded in, so the text sits where it sits and only the hit area
grows.

**The keyboard path survives the script.** The enhancement calls
`preventDefault()` on the summary's click and drives `details.open` itself, and
Enter and Space on a focused `<summary>` dispatch that same click — so keyboard
operation runs through the same path as the pointer, with the browser still
supplying the expanded state from `[open]`.

**Focus is drawn clear of the mark.** `outline: 2px solid $projects-accent`
with `outline-offset: 3px`, so the ring never sits on the disc's own border.

## Motion

The panel animates its measured height. `.project-details-content` wraps the
two paragraphs and carries `overflow: hidden`, which clips them while the
wrapper grows and also contains their margins, so `scrollHeight` is an accurate
endpoint rather than a number that stops short by one margin.

`_projects.js` drives it with the Web Animations API: read the current height,
open the element if it is shut (a closed `<details>` cannot be measured), read
`scrollHeight`, and animate between the two over 250ms. The animation is
installed in the same frame the element opens in, so the natural-height state is
never painted.

Three things the straightforward version gets wrong, all handled:

- **`[open]` cannot come off at the start of a close.** A shut `<details>` has
  nothing left to animate, so the attribute has to survive until the collapse
  finishes. Left alone, that meant opening turned the label and chevron
  immediately while closing left them 250ms behind the panel, and a label
  changing after the motion has stopped reads as lag. `.is-closing` marks that
  window and the CSS keys off `[open]:not(.is-closing)`, so both directions turn
  at the same moment. The class only ever exists while the script is running,
  which is why the rule still reads correctly as plain `[open]` without it.
- **Firefox reports the natural rectangle of descendants inside a closed
  `<details>`.** They are not painted, but they measure, so the closed endpoint
  is taken from the semantic state rather than from a rect.
- **The browser can open a disclosure on its own**, most obviously while
  revealing a find-in-page match. A `toggle` listener resyncs the script's
  target whenever no animation is in flight, so the next click goes the right
  way.

Reduced motion is honoured at the top of the click handler: the animation is
skipped entirely and the panel jumps to its end state. Anything without
`Element.animate` — or without JavaScript at all — falls through to the native
element, which opens and closes at once. The transitions on the disc are
themselves cancelled under `prefers-reduced-motion: reduce`.

A previous version used `::details-content` with `interpolate-size:
allow-keywords`, which is fewer lines but only animates in browsers that
implement the pseudo-element. The measured-height version behaves the same
everywhere.

## Changes

### `src/_includes/_sections/projects.njk`

The two guarded paragraphs move inside one guarded `<details>` under a
measurable wrapper, and everything below the description moves inside one
wrapper of its own:

```njk
<div class="project-body">
    {% if project.role or project.architecture %}
    <details class="project-details">
        <summary>…Read more…Read less…{% include "icons/chevron.svg" %}</summary>
        <div class="project-details-content">
            {% if project.role %}<p class="project-role">…</p>{% endif %}
            {% if project.architecture %}<p class="project-architecture">…</p>{% endif %}
        </div>
    </details>
    {% endif %}
    <ul class="project-tech">…</ul>
    <div class="project-links">…</div>
</div>
```

An entry renders three children where it rendered six.

### `src/_includes/icons/chevron.svg`

A filled chevron on the set's 24-unit grid, `aria-hidden`, no `<title>`.
Filled rather than stroked for `phone.svg`'s reason: a fill needs no rule of its
own beyond the `fill` the summary already sets, and a stroked mark would need
its own width to survive being inset in a 1.75rem disc.

### `src/assets/styles/includes/sections/_projects.scss`

- `grid-row: span 6` → `span 3`, and six `auto` rows → three. The comment above
  them records why the stack row and the links do not get rows of their own,
  since giving them rows is the change someone will try to make.
- `.project-body` is `display: flex; flex-direction: column`. Flex packs its
  children at the top of a row taller than they are, which is the whole point of
  the wrapper, and it stops `.project-details`' top margin collapsing out
  through the wrapper's own edge — which would move the wrapper rather than the
  gap under the description.
- `.project-details` carries the `1.75rem` that `.project-role` used to carry
  against the description, so the gap under the description is the same open or
  shut. `.project-role`'s own `1.75rem` now measures from the summary, which
  leaves the rhythm inside an open entry exactly as it was before the fold.
- `summary` is `inline-flex`, `width: fit-content`, `min-height: 2.75rem`, with
  the label at 1rem / 1.75px / 500 uppercase in the accent and a `0.625rem` gap
  to the disc. It kills the native marker twice: `list-style` for Firefox and
  current Chrome, `::-webkit-details-marker` for older WebKit.
- The chevron's `svg` is the disc: `1.75rem` square, `0.4rem` of padding,
  `border-radius: 50%`, `1px solid #928da1`, accent fill, `box-sizing:
  border-box` so the border does not push it past 1.75rem.
- Hover is gated on `@media (hover: hover)`. A tap leaves `:hover` applied until
  the next tap lands elsewhere, so on a phone the disc stayed filled after the
  panel had shut — the control showing a state the section was no longer in.
  It reads worse here than on the dashed links below, because filling the disc
  is the same emphasis the control uses to say it is being acted on. Nothing
  replaces it for touch: the panel moving is the feedback, and it arrives on the
  same tap.
- `.project-details-content` is `overflow: hidden`, for the enhancement to
  measure against.
- The label swap and the chevron's rotation hang off `[open]:not(.is-closing)`.

### `src/assets/js/includes/partials/sections/_projects.js`

New. Exports `initializeProjectDetails`, which gives every `.project-details`
the measured height transition described under Motion. It bails out per element
if the summary, the content wrapper or `Element.animate` is missing, leaving
that disclosure entirely native.

### `src/assets/js/app.js`

One import and one call, alongside the nav and the typewriter.

## Known, not fixed

The child-count hazard the previous spec logged is gone. Every optional field
now lives inside `.project-body`, which always renders, so an entry is three
children whatever `projects.js` does or does not carry. A project with no role
and no architecture simply has no control — it does not take the columns with
it.

## Verification

1. `pnpm run build` succeeds.
2. Both entries render exactly three direct children — `h3.project-logo`,
   `p.project-description`, `div.project-body` — matching `span 3` and the
   three `auto` rows.
3. The compiled CSS carries `grid-row:span 3` and three `auto` rows.
4. Each summary's accessible name is "Read more about &lt;project&gt;" closed
   and "Read less about &lt;project&gt;" open.
5. Every `transition: none` rule sits inside
   `@media (prefers-reduced-motion: reduce)`, and the hover block sits inside
   `@media (hover: hover)`.
6. At ≥ the `desktop` breakpoint, with both entries shut, the two wordmarks sit
   on a shared baseline, the two Read more controls sit on one line, and the two
   link rows finish level.
7. With one entry open, the shut entry's control, stack row and links stay
   packed directly under its description, and the leftover height falls below
   its links rather than above them.
8. With JavaScript disabled, both controls still open and close.
9. The control is accent caps beside an outlined disc, the disc filling with the
   accent on hover on a pointer device only, with a focus ring standing clear of
   the disc's border.
10. Opening and closing animate over 250ms, and the label and chevron turn at
    the same moment in both directions.
11. Under `prefers-reduced-motion: reduce`, both directions are instant.
