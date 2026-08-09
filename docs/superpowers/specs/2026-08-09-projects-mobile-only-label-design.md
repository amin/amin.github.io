# Projects — a mobile-only caveat on Yrco's live link

**Date:** 2026-08-09
**Branch:** develop
**Status:** Implemented

## Goal

Yrco's entry offers `yrco.se` with nothing said about it. The app was built for
phones, so a reader who follows that link from a laptop — which is what a LIA
screener is reading this page on — meets a layout that was never drawn for the
window it opens in. The link is the section's one invitation to go and look at
the work, and it currently sets the reader up to see it at its worst.

The caveat is a courtesy attached to the link, not a disclosure about the build.
Two readings were rejected early: stating it as an engineering fact alongside
Architecture, which buries a practical warning in a paragraph about monorepos,
and a badge beside the wordmark, which is read before the description and turns
a scope decision into the first thing the entry says about itself.

## Form

A phone mark prefixing the live link, and nothing else on screen.

```
▮ yrco.se     ⃝ GitHub
```

Four passes reached that, and the three discarded ones are the useful part of
this document. Each failed differently and the sequence is the argument.

**Plain text under the row.** Body ink on its own line, on the reasoning that it
should be quiet and introduce no new colour. The fault was not the placement but
the absence of any treatment: the links are held together by their dashed
underlines, and two words of unstyled ink beneath them had no relationship to
anything on the page. It read as a stray sentence. Quiet has to be designed; it
is not what is left over when nothing is specified.

**A bordered tag in `#dcdcdc`.** Legible as an object, but drawn in the value
the rules under ROLE and ARCHITECTURE use in order to recede — furniture weight
for something whose job is to be noticed on the way to a link.

**The same tag with an accent wash.** Visible, and still wrong, because the
problem had stopped being weight. Nothing else in this section is a filled box.
Projects speaks in hairline rules, dashed underlines and letterspaced accent
caps; a rounded rectangle with a fill is a loanword, and sitting between two
links it takes on the one meaning it must not have, which is "button".

**Glyph and caps, stacked under the link.** Correct vocabulary, right
attachment, and still one element too many. The words duplicated what the mark
already said, and the extra line pushed the two desktop columns out of level.

The mark alone is the end of that line of reasoning. It says what the words said,
it needs no container, no wrapper and no second element, and it prefixes the link
exactly as GitHub's octicon prefixes its own — the idiom the file already had.
Removing the visible text also removed every layout consequence: the row is one
line again, the columns finish level, and `.project-links` is back to the three
properties it had before any of this.

## Accessibility

The words survive as the link's own accessible name. A `visually-hidden` span
inside the anchor makes it read "yrco.se, mobile only", so an icon is never the
only carrier of the meaning.

This replaced an `aria-describedby` pointing at the visible note, and is better
than what it replaced: the caveat is now part of the link rather than a
reference to a sibling element, so it needs no `id`, cannot be orphaned by
markup moving around it, and survives the link being read out of context in a
links list.

The mark itself stays `aria-hidden` with no `<title>`, so it adds nothing to
that name — the same treatment `brand/github.svg` gets.

## Placement

Inside the existing live-link anchor, before the domain text. Nothing is added
to the entry, so it renders the same six children the desktop subgrid counts,
and the shared row heights are untouched.

## Changes

### `src/_data/projects.js`

Yrco gains one optional field:

```js
liveNote: "Mobile only",
```

Named for the link it qualifies rather than as a general `note`, so it cannot
drift into an unbounded notes field. Both the mark and the hidden text are
guarded on it, so a project without one renders exactly as before.

### `src/_includes/_sections/projects.njk`

```njk
<a href="{{ project.links.live }}" target="_blank" rel="noopener noreferrer">{% if project.liveNote %}{% include "icons/phone.svg" %}{% endif %}{{ project.links.live | replace("https://", "") }}{% if project.liveNote %}<span class="visually-hidden">, {{ project.liveNote | lower }}</span>{% endif %}</a>
```

Lowercased, because it is being spoken as the tail of a sentence rather than set
as a label.

### `src/_includes/icons/phone.svg`

A filled mark on the set's 24-unit grid, screen cut out with `fill-rule:
evenodd`. Filled rather than stroked for two reasons: `.project-links a svg`
already sets `fill`, so a filled mark needs no rule of its own, and an outline
would read a weight lighter than the solid octicon two positions along the same
row. It ships with no colour, `aria-hidden="true"` and no `<title>`.

### `src/assets/styles/includes/sections/_projects.scss`

Nothing added. `.project-links a svg` already sizes and colours any mark a link
carries, and its comment now records that this covers the phone as well as the
octicon. The `.project-live` and `.project-live-note` rules written for the
earlier attempts are deleted, and `.project-links` returns to `display: flex`,
`gap: 2rem`, `margin-top: 2.25rem`.

## Known, not fixed

`role` and `architecture` are rendered behind `{% if %}` guards and carry the
child-count hazard the subgrid comment describes: they sit in the middle of the
entry, so a future project missing either would shift every row beneath it. Both
current entries carry both fields, so nothing is wrong on the page today.
Recorded here rather than fixed, to keep this change to the one thing it is.

## Verification

1. `pnpm run build` succeeds.
2. Yrco's live link renders the mark before `yrco.se`, followed by a
   `visually-hidden` `, mobile only`; its accessible name is "yrco.se, mobile
   only".
3. Loopland's links are byte-identical to before the change.
4. Both entries render six children, so the subgrid numbers stay at six.
5. The compiled CSS contains no `.project-live` or `.project-live-note` rules.
6. At ≥ the `desktop` breakpoint both entries' link rows sit on one line and the
   two columns finish level.
