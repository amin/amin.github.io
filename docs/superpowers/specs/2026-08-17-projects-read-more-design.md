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

A native `<details>` wrapping both blocks, with the summary drawn as a filled
block in the projects accent.

```
A digital amusement park assembled from
games each group in our class built on
its own.

┏━━━━━━━━━━━━━━━━━┓
┃  Read more   ⌄  ┃   #453c62, white text
┗━━━━━━━━━━━━━━━━━┛

[php][laravel][react][ts][…]

loopland.se     GitHub
‧‧‧‧‧‧‧‧‧‧‧     ‧‧‧‧‧‧
```

**Native `<details>`, not a scripted toggle.** The button version has to earn
back three things the element gives away: it works with JavaScript off, the
browser owns the keyboard handling and the expanded state, and find-in-page
opens it to reach the text inside. Nothing about this control is unusual enough
to pay for that.

**A filled block, arrived at by exhausting the alternatives.** Three drafts
wore the dashed underline before this one, and the sequence is the argument.

- *Short, sized to its two words.* It borrowed the exact size, colour, tracking
  and underline of `.project-links`, so it landed two lines above two links
  drawn identically — and, being the shortest of the three, the entry's primary
  action was the least conspicuous thing in the column.
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

The fault common to all three is that a treatment borrowed from the links
cannot be made to outrank the links. No amount of width or weight changes what
kind of object a dashed accent underline is on this page.

A solid surface is not foreign to the site, only to this section: About is a
teal band, Connect an orange one, and the stack row directly below the control
carries filled tiles of its own. What is new here is the scale, not the device.
White on `#453c62` is 10.1:1, `#342d4c` on hover deepens it, and the corner
radius is 2px — enough to take the bite off, not enough to read as a pill
borrowed from another design system.

It is sized to its content rather than to the measure. A block of accent
running the full `60ch` would outweigh the wordmark above it, and the wordmark
is what names the entry.

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

`Read more` closed, `Close` open. Mirrors were considered and passed over —
"Read less" reads as the same control in two states, "Close" names the action
and is shorter on the way out. `Role and architecture` as the closed label,
which would tell the reader what is behind the fold before they open it, was
offered and declined.

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
per state: "Read more about Loopland", "Close Loopland's role and
architecture". This is the idiom the file already had — the same tail rides
inside Yrco's live link to say "mobile only".

**The chevron says nothing.** `aria-hidden`, no `<title>`, like `phone.svg` and
`brand/github.svg`. The summary's own text is the accessible name, and the
browser supplies the expanded state.

## Motion

`::details-content` transitions `block-size` from `0` to `auto`. `auto` is only
interpolable because the reset sets `interpolate-size: allow-keywords` on
`<html>`, and it sets it behind `prefers-reduced-motion: no-preference` — so
that preference is already honoured without this file asking a second time.

The transition is still turned off explicitly under `reduce`, for the discrete
half of it: `content-visibility` with `allow-discrete` flips at the halfway
mark, so a snapped-open panel would sit invisible for 125ms after arriving at
full height.

Browsers with no `::details-content` drop the rule as an unknown selector and
snap open, which is the behaviour being improved on rather than a fallback that
needed designing.

## Changes

### `src/_includes/_sections/projects.njk`

The two guarded paragraphs move inside one guarded `<details>`, and everything
below the description moves inside one wrapper:

```njk
<div class="project-body">
    {% if project.role or project.architecture %}
    <details class="project-details">
        <summary>…Read more…Close…{% include "icons/chevron.svg" %}</summary>
        {% if project.role %}<p class="project-role">…</p>{% endif %}
        {% if project.architecture %}<p class="project-architecture">…</p>{% endif %}
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
own beyond the `fill` the summary already sets, and an outline would read a
weight lighter than the marks it sits above in the same column.

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
- `summary` is a filled block: `$projects-accent` behind white text,
  `0.75rem 1.25rem` of padding, `border-radius: 2px`, `width: fit-content`, and
  `$projects-accent-hover` (`#342d4c`) on hover. It kills the native marker
  twice: `list-style` for Firefox and current Chrome,
  `::-webkit-details-marker` for older WebKit.
- `:focus-visible` gets an explicit ring with `outline-offset: 3px`. The
  browser default is drawn against the fill, where it is nearly invisible;
  offset, it lands on white.
- The chevron's `fill` is white rather than the accent, since it now sits on
  the accent.

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
   and "Close &lt;project&gt;'s role and architecture" open.
5. Both `transition: none` rules sit inside
   `@media (prefers-reduced-motion: reduce)`.
6. At ≥ the `desktop` breakpoint, with both entries shut, the two wordmarks sit
   on a shared baseline, the two Read more controls sit on one line, and the two
   link rows finish level.
7. With one entry open, the shut entry's control, stack row and links stay
   packed directly under its description, and the leftover height falls below
   its links rather than above them.
8. With JavaScript disabled, both controls still open and close.
9. The control is a filled accent block sized to its own label, white text and
   white chevron, deepening on hover, with a visible focus ring sitting clear
   of the fill.
