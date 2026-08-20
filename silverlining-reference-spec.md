# silverlininginc.com — Reference Capture

Measured from the live site, August 19 2026. Every value below is read from computed styles or the rendered page, not estimated. This is the build spec for Directions A and B.

Platform: Fastboil. URL pattern `/en/<id>-<slug>/`, projects at `/en/project-<id>-<slug>?p=<n>`.

---

## 1. The format, in one sentence

A **fixed 200px sidebar** holding the entire navigation, with the rest of the viewport given to full-bleed photography — and, on content pages, a narrow white column floating between the two.

There is no header. No footer. No hero section. No scrolling homepage. That is the whole idea, and it's why it reads expensive.

---

## 2. Design tokens (measured)

### Colour — monochrome, no accent

| Token | Value | Use |
|---|---|---|
| ink | `#000000` | body text (102 elements) |
| ink-soft | `#1F1F1F` | secondary text (24 elements) |
| paper | `#FFFFFF` | content column, nav text |
| sidebar | `rgba(121, 121, 121, 0.95)` | the sidebar scrim over photography |
| overlay | `rgba(31, 31, 31, 0.7)` | image overlays |
| rule | `#EFEFEF` | hairlines |

**There is no brand colour anywhere on the site.** Not one saturated pixel of chrome. This is the single biggest thing to resolve before Phase 3 — see §6.

### Type

- **Headings / nav / UI: `BenchNine`** (Google Font — condensed, humanist, geometric caps)
- **Body: `Lato`**; Arial and Times as fallbacks
- **Weight 300 on essentially everything.** No bold anywhere in the measured set.
- Sizes: `14.56px` · `16px` · `19.2px` · `20.8px` — a four-step scale, top to bottom
- `letter-spacing: normal`, `line-height: normal`
- **Sentence case, not uppercase** — "About Us", "Portfolio", "References"

### Motion

- `transition: all 0.8s` — one global transition, unusually slow
- 800ms is most of the luxury signal. Cross-fades and hover states drift rather than snap. Copy this exactly; at 200ms the same layout feels cheap.

### Grid & images

- Sidebar: exactly **200px**, full viewport height, fixed
- Portfolio: **3 columns**, tiles rendered at **332px** wide, gutters ~4px
- Tiles keep **native aspect ratios** — measured 1.50, 1.37, 1.27, 1.16 — so rows are ragged, not a uniform grid
- Source images served at **480×N**, displayed at 332px (1.45× density), `object-fit: fill`
- 65 images on the portfolio index
- No `srcset`, no responsive images, no lazy-load attributes

---

## 3. The three layout patterns

Everything on the site is one of these.

### Pattern A — Landing (homepage)

```
┌────────┬───────────────────────────────────────┐
│ 200px  │                                       │
│        │                                       │
│ logo   │      full-bleed photograph            │
│        │      edge to edge, no crop marks      │
│ nav    │      fills 100% of remaining vw/vh    │
│ (7)    │                                       │
│        │                                       │
│ social │                                       │
│ email  │                                       │
│ phone  │                                       │
│ ©      │                                       │
└────────┴───────────────────────────────────────┘
```

`document.body.scrollHeight === innerHeight` — **the homepage does not scroll.** One image, one screen.

Sidebar contents, top to bottom: wordmark + two-line tagline in tiny letterspaced caps · seven nav items at ~52px vertical rhythm · three outlined social icons · email · phone · copyright. All centred, all weight 300.

Notable: the homepage photograph when captured was an **aerial drone shot of a job site under construction** — framing, foundation, dirt. Not a finished interior. For a firm selling to designers, leading with the build rather than the styling is a deliberate and confident choice.

### Pattern B — Index (Portfolio)

```
┌────────┬───────────────────────────────────────┐
│        │ FILTER                                │  ← thin bar, uppercase, letterspaced
│ side   ├───────────┬───────────┬───────────────┤
│ bar    │           │           │               │
│        │  332px    │  332px    │  332px        │  ← native aspect ratios
│ fixed  ├───────────┼───────────┴───────────────┤
│        │           │           │               │
│        │  (scrolls internally, sidebar fixed)  │
└────────┴───────────────────────────────────────┘
```

No titles, no captions, no metadata on the grid. Pure image wall. The only chrome is the word FILTER.

### Pattern C — Content page (Videos, Services, About)

This is the one worth stealing.

```
┌────────┬──────────────┬─────────────────────────┐
│        │              │                         │
│ side   │  ~400px      │   full-bleed photo      │
│ bar    │  WHITE       │   static, full height   │
│        │  column      │                         │
│ fixed  │  scrolls     │   ~600px                │
│        │              │                         │
│        │  title       │                         │
│        │  content     │                         │
└────────┴──────────────┴─────────────────────────┘
```

A narrow white content strip between the dark sidebar and a full-height photograph. Page title in light type, content stacked beneath, text centred. On the Videos page: thumbnail images with captions below, linking out rather than embedding players.

**This solves the problem I flagged earlier.** Streamline's pitch to architects is verbal — estimating, schedules, self-performed trades, $10M GL, 7-day pricing. Pattern C is where that copy lives, and the photography still gets half the screen.

### Project detail — full-bleed lightbox

Clicking a portfolio tile opens a lightbox filling the content area; **the sidebar stays put**.

- Thin white chevrons at vertical centre, left and right, for paging
- Bottom bar: project title, bottom-left, light weight
- Bottom-right: × to close, ⌃ to expand info
- Expanding reveals exactly **two lines**:
  - `Architect/Designer: Meyer Davis`
  - `Photographer: Weird Village`

That's the entire project metadata. Two credits.

This matches your Builder note verbatim — *"when you tap on the image, the menu bar disappears so you get a full screen image display, and you can use the arrows on the sides to click through."* You were already building toward this.

### Mobile (390px)

Sidebar collapses to a **dark top bar** — wordmark left, hamburger right — then content stacks: photo full-width, then the content column. Conventional, no surprises. The three-zone desktop layout becomes a single column.

---

## 4. Information architecture

```
About Us ▾
   Company Profile
   Team
   In-House Millwork + Cabinet Shop
Services
Portfolio            ← filterable image wall
References           ← what Streamline calls "Testimonials"
Videos               ← Streamline has none; Eric's top ask
Press                ← Streamline has none
Contact
```

Seven items, one dropdown. Millwork gets **top-level nav placement** — on Streamline it's service #4 of 6, and it's the actual differentiator.

---

## 5. Where a literal copy breaks against Streamline's content

| Silver Lining does | Streamline has | Problem |
|---|---|---|
| 2 metadata fields per project | 10 ACF fields incl. sqft, role, location, mission | A 2-field lightbox discards most of your data |
| No accent colour | `#D42E12` as brand core | Nothing to map it onto — see §6 |
| Residential only | 27 commercial / 31 residential | One undifferentiated "Portfolio" buries Momofuku, Kith, Free People, Hudson Yards |
| Near-wordless | Operational proof points that must be read | Pattern C absorbs this; Patterns A and B don't |
| Credits the photographer | No photographer field | Worth adding — it's how the credit line reads professional |
| BenchNine 300, sentence case | Montserrat 700, uppercase | Full typographic inversion |

---

## 6. The one decision that has to happen before any pixels

Silver Lining is monochrome. Streamline's brand is a saturated red. You asked to *"put the colors of the streamline business onto this other site style"* — but there is no colour slot in this design to put it in. Any red you add will be the only chroma on screen, so it becomes the loudest element by default.

Three coherent resolutions:

1. **Red as a single accent.** Monochrome shell, `#D42E12` reserved for one job only — active nav item, or the FILTER control, or link hover. Closest to the reference, and the red still reads as brand.
2. **Red in the sidebar.** Replace the grey scrim `rgba(121,121,121,0.95)` with a near-black and put the red in the wordmark and hairlines. Keeps the format, gives Streamline its own presence.
3. **Red-forward sidebar.** Sidebar carries brand colour properly. Furthest from the reference, most obviously Streamline, and the loudest.

Contrast constraint that applies to all three: `#D42E12` measures **5.0:1 on white** (passes) and **4.2:1 on black** (fails normal text). On the dark sidebar it needs lightening to roughly `#E8492B` or it can only be used for large type and non-text elements.

This is the one thing worth showing Eric as swatches before building anything, because all three are defensible and only he can pick.

---

## 7. Build notes

Reproducible in Tailwind with no exotic dependencies:

- Sidebar: `fixed left-0 top-0 h-screen w-[200px]` + backdrop scrim
- Pattern C: `grid grid-cols-[200px_400px_1fr]` at `lg`, single column below
- Portfolio: CSS columns or a masonry grid — must preserve native aspect ratios, and use `object-cover` rather than their `fill` so images aren't distorted
- Global transition duration **800ms** — set it as a token, don't let it drift
- BenchNine + Lato from Google Fonts; check the licence covers your use
- Improve on the reference where it's free to: proper `srcset` and `next/image` (they serve 480px into a 332px slot with no responsive images at all), and real alt text

Two things not worth copying: `object-fit: fill` distorts every non-conforming photo, and the missing `srcset` is a straightforward performance loss.
