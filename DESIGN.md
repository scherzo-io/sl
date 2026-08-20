# Streamline USA — Design Brief

For a Claude Design session (or any designer) building the three directions. Decisions cited
as `PLAN §1 row N` are settled — do not re-litigate them here; if one must change, add a
superseding row to PLAN §1 first.

---

## 1. Who this site must convince

**Architects.** They hold the client relationships and carry the risk of recommending a GC.
The site's job is to make recommending Streamline feel safe: estimating reliability, schedule
discipline, self-performed trades (in-house millwork shop and carpenters), $10M GL
("almost every building in the city and 5 boros"), pricing for **most** projects in 7 working
days — keep the qualifier, architects notice overclaims. Secondary audiences: owners, reps,
designers, developers (the deck's own RFP header order).

The proof has to be *worn lightly*: the reference format is near-wordless luxury, and the
operational copy lives in Pattern C's white column, not in banners.

## 2. Tokens (locked — PLAN §1 rows 11–12, §5)

| Token | Value | Use | Contrast, computed |
|---|---|---|---|
| `ink` | `#000000` | body text on white | 21:1 |
| `ink-soft` | `#2D2D2D` | secondary text | 13.4:1 |
| `paper` | `#FFFFFF` | content column | — |
| `sidebar` | `#1A1A1A` | fixed sidebar ground | — |
| `rule` | `#FAFAFA` | hairlines on white | non-text |
| `red` | `#DA2128` | wordmark · hairlines · red text on white | 4.97:1 on white (AA) · 3.51:1 on sidebar (large/non-text only) |
| `red-on-dark` | `#E25257` | normal-size red text on `#1A1A1A` | 4.62:1 (AA) |
| `motion` | `all 0.8s` | one global transition | — |

Never introduce `#D42E12`, `#E8492B`, `#E85A3C`, `#FF0000`, `#990000` — all retired or
superseded (`#E8492B` fails AA on the sidebar at 4.49:1; that's why it died). `#808285` fails
on white (3.85:1) — use `ink-soft` instead.

## 3. Type

**BenchNine 300** display/nav/UI, sentence case ("About us", not "ABOUT US"). **Lato 300–400**
body, **16px minimum**. Scale: 14.56 / 16 / 19.2 / 20.8. No bold anywhere in the reference's
measured set; emphasis comes from size, spacing, and the red. Letterspaced tiny caps only for
the wordmark tagline slot.

## 4. Layout patterns (from the measured spec — see silverlining-reference-spec.md §3)

- **A — Landing.** Sidebar + one full-bleed photograph. `scrollHeight === innerHeight`; does not scroll.
- **B — Index.** Sidebar + 3-column image wall, 332px tiles, native aspect ratios (ragged rows),
  ~4px gutters, one FILTER control, no captions. Grid scrolls internally.
- **C — Content.** Sidebar + ~400px white column + full-height photograph. This is where the
  architect-facing copy lives while photography keeps half the screen.
- **Project detail.** Full-bleed lightbox inside the persistent sidebar; thin chevrons; title
  bottom-left; × close, ⌃ expand → panel: location · sq ft · role · designer · architect ·
  description. Architect line renders only when present (8 of 58 have none — PLAN §1 row 19).
- **Mobile 390px.** Sidebar → dark top bar + hamburger; single column.

Sidebar contents top-to-bottom: wordmark (+optional tagline) · nav (~52px rhythm) · social ·
email · phone · ©. All centred, weight 300.

## 5. Navigation IA (default variant; 3 alternates in §7)

About Us ▾ (Company Profile · Team · **In-House Millwork + Cabinet Shop**) · Services ·
Portfolio · Testimonials (`/clients/`) · Videos · Contact · Request For Pricing.
Millwork gets top-level placement inside About — it's the differentiator and the reference
does exactly this. No Press. Property Management stays.

## 6. The three directions (all fully built — PLAN §1 rows 7, 9)

**A — Faithful.** The reference executed with Streamline's tokens and photography. Non-scrolling
landing, ragged image wall, two-line-feel lightbox (ours shows the full panel on expand),
800ms drift. The literal answer to what Eric asked for.

**B — Faithful shell, Streamline's depth.** Same shell; the difference is *words in the right
places*: full project metadata in the lightbox panel, operational proof points in Pattern C
columns (estimating, schedule, self-performed millwork, $10M GL, 7-day pricing), two-level
filter on the index, deck mission copy woven into descriptions. Fixes the reference's real
faults: `object-cover`, `next/image` + `srcset`, 16px body, real alt text.

**C — Independent, editorial case-study.** Different premise: the archive is the argument.
58 projects, 880 photographs, names architects already respect — Momofuku, Kith, Free People,
Bad Roman, The Pierre, Grand Ole Opry. Project-first navigation; long-form case studies with
full-bleed sequences; typography-led; filterable index by category, sub-category, sqft, and
self-performed trade; client logo wall as ambient proof; services demoted to one supporting
page. The language of the architecture sites his audience reads all day. A and B win on
familiarity; C wins bids.

## 7. Variants (build switchable; Eric picks — PLAN §5)

- **Homepage ×4:** non-scrolling video loop · non-scrolling rotating stills · scrolling video hero · single still
- **Nav ×4:** mirror reference (7) · +Partners logo wall (8) · Commercial/Residential split top-level · minimal five
- **Testimonials ×4:** quotes w/o contact details · quotes pending re-consent · everything from decks · logos only

## 8. Imagery rules

- Sources: Streamline's own photography only. Reference-site photography is out of scope.
- Hero-capable projects: the 34 flagged `YES` in `content/image-audit.tsv`. Never stretch the
  others to full-bleed (worst: 12th St Townhouse, all 12 at 640×295).
- **Square problem:** Lantern House, The Pierre, 652 Hudson, 40 E 66th are entirely 2048×2048 —
  the newest, best work. Options to design deliberately: center-crop with protected subjects ·
  pillarboxed duotone ground · split-pair layout (two squares side by side) · Pattern C
  placement where the photo slot is vertical anyway. Pick per direction, show Eric.
- Filter/grid tiles keep native aspect ratios; `object-cover`, never `fill`.
- Alt text: 878/880 currently missing — every migrated image ships with descriptive alt
  (written at migration; template in CLAUDE.md).
- Hidden originals give retina-quality sources for the 34 heroes (up to 5600×3733).

## 9. Kill-list — invented content that must not survive (PLAN §1 row 22)

Verified live on the Builder prototype (20 Aug 2026):

| Invented | Reality |
|---|---|
| Project "Upper East Side Penthouse" | no such project; slug not in the 58 |
| Stock hero photography (eucalyptus-garden modern house) | Streamline's own 880 images |
| "123 Construction Ave, New York, NY 10001" | 483 10th Ave, Suite 205, NY 10018 |
| "(212) 555-1234" (contact panel) | real phone from `siteSettings` (Alexey to supply) |
| "(123) 456-7890" (footer) | same |
| Business hours "M–F 8–6, Sat 9–2, Sun closed" | never stated anywhere; drop unless Eric supplies real hours |
| "© 2024 Streamline USA" | © current year, automatic |
| Tab title "Hello world project" | real titles via Metadata API |

Rule: **every displayed fact traces to `content/content-inventory.tsv`, a capability deck, or
the live site.** If a fact isn't in one of those, it doesn't render — no placeholder text, no
lorem, no "example.com", no invented emails (the only email domain is `streamlineusa.com`;
treat any hyphenated or variant domain as invented). The one unconfirmed report — a hyphenated
email domain somewhere in the prototype — is moot under this rule.

Also never rendered: the decks' REFERENCES block (architect direct contacts — PLAN §1 row 21),
and anything from the July 10 transcript beyond decisions (no revenue, spend, staffing,
ownership content anywhere near the site).

## 10. Accessibility gates

AA for normal text (≥4.5:1) with the §2 tokens only; large-type/non-text red on dark uses
`red` (3.51:1 ≥ 3:1). Visible focus states on nav, filter, lightbox controls, and the RFP
form. Lightbox: Esc closes, arrows page, focus trapped, title announced. The 800ms transitions
respect `prefers-reduced-motion`. RFP form fields labeled, errors described in text.
Alt text per §8. Body never below 16px (the old site's 13–14px is one of the faults we're fixing).
