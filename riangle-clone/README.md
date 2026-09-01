# riangle.com — clean static reconstruction

A hand-rebuilt, framework-free copy of the **riangle.com** home page, made for
studying how it's put together. Rebuilt with the creator's permission.

Hover + scroll motion is reconstructed. The hero mark is a **custom red ribbon
logo** (animated: intro rise → idle float → pointer parallax) that replaces the
original's WebGL prism. The **footer globe / CTA corner prism are deliberately
left empty**. There's also a **custom cursor** — a small dot with a red ring
that trails behind it with easing.

## Run it

```bash
npx serve .
# or
python -m http.server 4321
```

Open the printed URL. No build step — plain HTML/CSS/JS.

## What the original is

| Layer | Original | This reconstruction |
|---|---|---|
| Framework | Next.js (App Router, Turbopack) | none — static HTML |
| Styling | styled-components (hashed classes + CSS custom props) | plain CSS, semantic class names, same custom props |
| Fonts | `next/font` → Archivo (variable) + JetBrains Mono | same woff2 files, `@font-face` in `assets/css/fonts.css` |
| Images | Convex storage via `next/image` | downloaded to `assets/images/` |
| Auth / analytics | Clerk, PostHog | removed |
| Motion | GSAP + ScrollTrigger, smooth-scroll wrapper, WebGL "prism" marks, pointer math | vanilla JS + CSS: scroll reveals, parallax, count-up, magnetic button, custom cursor, SVG ribbon logo |

## File map

```
index.html                     one page, semantic sections
assets/css/
  fonts.css                    @font-face (Archivo + JetBrains Mono)
  tokens.css                   design tokens: colour ramps, light/dark,
                               per-section accent ("band"), type scale, spacing
  base.css                     reset + global rules + grain overlay + no-JS fallbacks
  components.css               every component + all HOVER micro-interactions
  animations.css               SCROLL reveals + hero-logo + custom-cursor styles
assets/fonts/                  6 woff2 subsets
assets/images/                 work thumbnails + studio photo + icons
js/
  theme-toggle.js              light/dark, persisted to localStorage
  menu.js                      mobile menu overlay open/close
  header.js                    scroll: frosted scrim + hide-on-scroll-down
  studio-clock.js              live "Studio time" (Europe/Zurich)
  animations.js                scroll reveals, parallax, count-up, hero-logo, magnetic button
  cursor.js                    custom dot + trailing red ring
_reference/                    the captured originals (page HTML, hydrated DOM,
                               the site's full styled-components CSS)
```

## The design system ("Cherry")

**Colour.** Two full sets. Light is default; `data-theme="dark"` on `<html>`
swaps them. Neutrals are tokens (`--ink*`, `--surface*`, `--line*`).

**Per-section accent.** Each section carries `data-band="violet|indigo|cyan|
emerald|amber|flare|brand"`, which re-points `--refract` / `--refract-soft` /
`--refract-strong` at that band's ramp. On a dark island (`data-ground="dark"`,
the CTA) the brighter "on-dark" ramp is forced. `--refract*` are registered with
`@property` so accent changes can be transitioned.

**Type.** Archivo is a *variable* font and the design leans on its **width**
axis: headlines sit at `wdth` 108–112, and Capabilities rows animate `wdth`
100 → 108 on hover. Labels/numbers are JetBrains Mono at `.6875rem` /
`letter-spacing: .14em` / uppercase, with a `padding-left: .14em` optical fix.

**Rhythm.** The whole layout is two fluid clamps:
`--pad-inline: clamp(20px, 4.5vw, 64px)` and
`--pad-block: clamp(96px, 10vw, 192px)`. Content max-width 1440px; header/hero
1760px. Breakpoints: 768px, 992px.

**Texture.** A fixed fractal-noise SVG (`.grain`) sits over everything at
2–3.5% opacity with `mix-blend-mode`.

**Spectrum rule.** The rainbow hairline divider is one `linear-gradient` across
all six band colours at 45% mix.

**Duotone.** The studio photo runs through an inline SVG `<filter
id="riangle-duotone">` (desaturate → per-channel table transfer) mapping it onto
ink → accent.

## Motion

### Hover (pure CSS — `components.css`)
- **Nav links** — label rolls up to a duplicate copy (`overflow:hidden` + `translateY(-100%)`).
- **Text links** — accent underline wipes in from the left (`scaleX` + `transform-origin` flip).
- **Arrow links** — the `→` glyph nudges right; external links rotate it 45°.
- **Work rows** — image `scale(1.05)`, top rule fills with the accent, tags + arrow turn accent.
- **Capability rows** — a 3px accent bar grows from the top, the title's Archivo **width axis**
  goes `wdth 100 → 108`, the note brightens, `→` appears.
- **Primary button** — background → `--refract-strong` + an accent glow (`box-shadow`).
- **Theme toggle** — thumb slides, ring tints.

### Scroll (`animations.js`, gated by `html.js-anim`)
- `[data-reveal]` — fade + `translateY(22px)` → 0, staggered per shared parent.
  Hairlines (`.draw-rule`, `.spectrum-rule`) wipe horizontally (`scaleX`) instead.
- `[data-reveal-heading]` — hero `<h1>`, one `<span>` per line, `clip-path` wipe + rise,
  90 ms stagger.
- `.reveal-media` (work images + studio photo) — `clip-path: inset(0 0 100% 0)` opens while
  the inner `<img>` settles from `scale(1.08)`.
- `.parallax-layer` — work media/text translate at opposite rates vs. scroll (±38 px).
- `.stat__value[data-count]` — counts `0 → data-count` (ease-out cubic) then appends the suffix.
- A scroll-position sweep is used (not `IntersectionObserver`) so fast scrolling never
  strands a hidden element.

### Hero logo (`animations.css` + `animations.js`)
`index.html` → `svg.hero__logo`: three `<use>` copies of one ribbon path, red gradient
fill + clipped white fold highlight.
- **Intro** — blades rise / un-rotate / scale up, 130 ms stagger, when `.hero` gets `.is-in`.
- **Idle** — each `.blade__float` does a slow out-of-phase `translateY` + tilt loop.
- **Pointer parallax** — `mousemove` sets `--px/--py`; each blade shifts by a depth
  proportional to its index.
- **Scroll** — the whole mark fades as the hero leaves.

### Custom cursor (`cursor.js` + `animations.css`)
`html.js-cursor` hides the native cursor (fine pointers only). A 6 px red dot catches up
fast (`lerp 0.4`); a 34 px red ring trails with delay (`lerp 0.14`). Ring grows over
anything clickable, shrinks on press, hides when the pointer leaves the window.
Disabled on coarse pointers and `prefers-reduced-motion`.

### Kept as-is
- `.hero__cue-segment` — pure-CSS falling scroll cue.
- `.site-header[data-scrolled|data-hidden]` — real scroll logic in `header.js`.
- `#smooth-wrapper` / `#smooth-content` — structure kept for a smooth-scroll lib.

### Not implemented (on purpose)
- **Footer globe** (`.footer-globe`) and **CTA corner prism** (`[data-prism-corner]`) —
  left as empty reserved space.

## Reduced motion / no JS
`html.js-anim` / `html.js-cursor` are only added when JS runs and
`prefers-reduced-motion` is not set. Without them, `base.css` renders everything
visible and static, and the native cursor is used.

## Known differences from the original
- Hero mark is a custom SVG ribbon logo, not the original WebGL prism.
- Footer globe + CTA corner prism are absent.
- Work-row overlap (`margin-top: -8vh`) is kept; it reads best with a scroll-pin
  which isn't reproduced.
- Inner pages (`/work`, `/about`, …) are not included — links point at original paths.
- Content (projects, stories, stats) is a snapshot from the capture date.
