# Projects — a mobile-only caveat on Yrco's live link

**Date:** 2026-08-09
**Branch:** develop
**Status:** Approved, not implemented

## Goal

Yrco's entry offers `yrco.se` with nothing said about it. The app was built for
phones, so a reader who follows that link from a laptop — which is what a LIA
screener is reading this page on — meets a layout that was never drawn for the
window it opens in. The link is the section's one invitation to go and look at
the work, and it currently sets the reader up to see it at its worst.

The label is a courtesy attached to the link, not a disclosure about the build.
Two readings were rejected: stating it as an engineering fact alongside
Architecture, which buries a practical warning in a paragraph about monorepos,
and a badge beside the wordmark, which is read before the description and turns
a scope decision into the first thing the entry says about itself.

## Copy

```
Mobile only
```

Chosen by the author over `Built for phones`, `Best on a phone` and
`Phone-sized by design`.

## Placement

A trailing sibling after `.project-links`, still inside the entry's `<li>`.

Desktop is the constraint. `.projects-list > li` is `grid-template-rows:
subgrid` with `grid-row: span 6`, so logo, description, role, architecture,
stack row and links line up across both columns. The rule's own comment records
the hazard:

> The row count is the number of children an entry renders. Adding one without
> raising both numbers misaligns the columns silently: the build still passes
> and only the rendered page shows it.

A seventh child on Yrco alone is that case — except that subgrid fills rows in
child order from the first, so **a trailing optional child is safe**. Loopland
keeps rows 1–6 and leaves row 7 empty; nothing above it moves. The note has to
stay last for that to hold.

Two alternatives were rejected. Putting the note inside `.project-links` with
`flex-wrap: wrap` and `flex-basis: 100%` keeps the child count at six, but wins
on a wrapping trick and puts non-link text in the links container. Inlining it
beside `yrco.se` changes no structure at all, but sits it level with the GitHub
link and reads as a third link.

## Changes

### `src/_data/projects.js`

Yrco gains one optional field:

```js
liveNote: "Mobile only",
```

Named for the link it qualifies rather than as a general `note`, so it cannot
drift into an unbounded notes field.

### `src/_includes/_sections/projects.njk`

After the `.project-links` div, inside the `<li>`:

```njk
{% if project.links.live and project.liveNote %}
<p class="project-live-note" id="live-note-{{ loop.index }}">{{ project.liveNote }}</p>
{% endif %}
```

The live anchor gains the association when the note exists:

```njk
<a href="{{ project.links.live }}" target="_blank" rel="noopener noreferrer"{% if project.liveNote %} aria-describedby="live-note-{{ loop.index }}"{% endif %}>
```

Without `aria-describedby`, someone moving link to link hears "yrco.se, link"
and never meets the caveat — it exists only in linear reading order, which is
not how the links get used. `loop.index` gives a unique id without pulling in a
slugify filter.

### `src/assets/styles/includes/sections/_projects.scss`

```scss
.project-live-note {
    font-size: 1.125rem;
    margin-top: 0.75rem;
}
```

One step under the 1.25rem body paragraph, matching `.project-label`'s size. No
colour is set: it inherits the page ink and takes its quietness from size and
position. A muted grey would be a fourth hex in a file that documents every one
it introduces, and it would have to clear the 4.5:1 floor `utils/_colors.scss`
was written to hold — `#767676` is the lightest grey on white that does, which
is not far enough off the ink to be worth the entry.

The subgrid numbers move together:

```scss
grid-template-rows: auto auto auto auto auto auto auto;  // was six
> li {
    grid-row: span 7;                                    // was 6
}
```

The comment above the rule is updated to record that the seventh row belongs to
an optional child which must stay last.

## Known, not fixed

`role` and `architecture` are already rendered behind `{% if %}` guards and carry
the same child-count hazard — and unlike the note they are not trailing, so a
future project missing either would shift every row beneath it. Both current
entries carry both fields, so nothing is wrong on the page today. Recorded here
rather than fixed, to keep this change to the one thing it is.

## Verification

1. `pnpm run build` succeeds.
2. Built `public/index.html` contains `Mobile only` once, and one
   `aria-describedby="live-note-` whose value matches the note's `id`.
3. Loopland's entry contains no `project-live-note`.
4. At ≥ the `desktop` breakpoint, the two entries' link rows still sit on one
   line, and Loopland shows no gap below its links where the empty seventh row
   falls.
5. Below `desktop`, where subgrid does not apply, the note reads as a line under
   the two links.
