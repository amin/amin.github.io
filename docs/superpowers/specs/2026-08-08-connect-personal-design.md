# Connect — the ask, stated as a condition

**Date:** 2026-08-08
**Branch:** develop
**Status:** Implemented

## Goal

Connect stated the ask and nothing about the person making it:

> I’m looking for a LIA internship from 23 November 2026 to 28 May 2027 — six
> months where I can contribute to thoughtful software alongside people who care
> about what they’re building.

`contribute to thoughtful software` is a claim the section cannot support and the
reader cannot check. It fails the same test About failed in
`2026-08-05-about-personal-design.md`: any applicant could sign it unchanged.

## Copy

```
I’m looking for a LIA internship from 23 November 2026 to 28 May 2027 — six
months in a room that expects more of me than I can give yet, alongside people
who care about what they’re building.
```

Heading unchanged: `Open to what comes next.` Actions, platform links and both
`<time>` elements unchanged.

## Source

A LIA application letter written by the author, in Swedish. Four candidate
traits were drawn from it and one was selected:

- **Growth is the condition** — *selected*. `Jag är en person som mår som bäst
  när jag känner att jag utvecklas`, and the belief under it: `Jag tror att
  människor formas av de miljöer de befinner sig i`.
- **Curiosity you can verify** — the Figma MCP experiment (specification →
  design system via Claude → Figma → React components). Rejected: Skills already
  carries AI twice directly above.
- **The conversations you want** — AI and industrialisation, ownership and
  security, adapting to a more fragile world. Rejected: opinion, not evidence.
- **Ownership, early and real** — the Minecraft server, the web host, the
  hosting service. Rejected: About's second paragraph is already this.

## Why a condition rather than a disposition

`I want to grow` is true of every applicant and provable by none, so stating it
adds nothing a reader can act on. The letter's actual claim is causal — people
are shaped by the environments they are in — which makes the environment the
thing being chosen. `a room that expects more of me than I can give yet` states
that as a requirement on the workplace. A reader can hold it against their own
team and answer it, and one who cannot meet it self-selects out. That is the
whole function of the sentence.

`than I can give yet` over `than I have yet`, which was the first draft: the
verb was doing awkward work.

Two alternatives were written and rejected by the author:

- `six months on work a size bigger than I am` — shorter and more memorable, but
  a physical metaphor on a page whose other sections use none.
- A second sentence stating the belief outright (`People are shaped by the rooms
  they work in, so the room is what I’m choosing`) — the most distinctive
  option, at the cost of the section's one-sentence economy.

## What was given up

The old clause was the only place on the page naming what the author would
give. The replacement is entirely about what the six months does to him. This
was raised with the author and accepted: Connect is the ask, and the
contribution side is argued by Projects and the CV, which can show it rather
than assert it. A hedge preserving both — `six months of real work in a room
that expects more of me…` — was offered and declined.

## Structure

Unchanged. One paragraph, matching Home and Skills; About runs two. The
alternative shapes — a second paragraph carrying the thesis, or moving it into
the heading — were both rejected in favour of keeping the section's weight and
the invitation in `Open to what comes next.`

## Typography

Spaced em dash and curly apostrophes, per the site rule recorded in
`2026-08-05-about-personal-design.md`. Both already present in the retained
parts of the sentence.

## Verification

`pnpm build`, then in `public/index.html`:

- `#connect` holds exactly one `<p>`, reading the copy above.
- Both `<time>` elements intact with `datetime="2026-11-23"` and
  `datetime="2027-05-28"`, matching About's `Looking for` fact.
- `<h2>` still reads `Open to what comes next.`
- `.connect-cv`, `.connect-email` and both `.platform` links unchanged.
