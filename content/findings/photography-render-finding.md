# Real photography answers DESIGN §8, and `heroFor()` is mostly right

Found 2026-08-20, by rendering the 887 measured originals at 1440 on `localhost:8080`
and joining each look to `content/images/image-manifest.tsv` + the `heroFor()` score
in `lib/photos.ts`. This is the first time DESIGN §8’s square and full-bleed questions
have visible answers. Nothing here restyles the build.

## What's there

Direction A pillarboxes the four all-square projects (`HeroSlot` when
`direction === "a" && project.square`). B and C `object-cover` the same frame into
the remaining slot. Split-pair and a dedicated Pattern C vertical treatment from
DESIGN §8 are **not built**.

`heroFor()` scores: hero-capable +4e6, landscape +2e6, featured +1e6, then width.

Dump of the 17 named slugs (algorithm said this), 2026-08-20:

| slug | id | measured | hero | ori | featured | source_path |
|---|---|---|---|---|---|---|
| mackage-soho | 1951 | 4032×3024 | yes | landscape | yes | 2020/02/IMG_8648.jpg |
| lantern-house | 3956 | 2048×2048 | yes | square | yes | 2023/10/iUL4bg6I.png |
| 795-5th-ave-the-pierre | 3984 | 2048×2048 | yes | square | yes | 2023/10/UTt2aYWB.png |
| 652-hudson-st | 3916 | 2048×2048 | yes | square | yes | 2023/05/3jZi0pAh.png |
| 40-e66th-st | 3926 | 2048×2048 | yes | square | yes | 2023/05/5xCs3wN5.png |
| 12th-st-townhouse-greenwich-village | 2518 | 640×295 | no | landscape | yes | 2020/07/5th-Ave-Featured-copy.jpg |
| e63-st-penthouse | 541 | 640×392 | no | landscape | yes | 2019/12/Upper-East-Side-Penthouse-Featured.jpg |
| lexington-ave-townhouse | 1837 | 599×399 | no | landscape | yes | 2020/02/UES-8-e1595540404244.jpg |
| west-23rd-townhouse-2 | 538 | 990×740 | no | landscape | yes | 2019/12/W23-Featured.jpg.png |
| horatio-st-townhouse | 1083 | 990×740 | no | landscape | yes | 2019/12/tersigni-palachek-residential-west-village-02.png |
| free-people-retail-store | 1017 | 3024×4032 | yes | portrait | no | 2019/12/IMG_3444.jpg |
| spring-studios-spring-place | 1189 | 2625×675 | yes | landscape | no | 2019/12/8.75x2.25-spring-1.jpg |
| kith | 1152 | 3024×4032 | yes | portrait | no | 2019/12/IMG_1071.jpg |
| bad-roman-columbus-circle-mall | 3660 | 3600×2400 | yes | landscape | yes | 2023/05/20230310_10ColumbusBadRoman-1129.jpg |
| duane-street-penthouse | 3284 | 3600×2400 | yes | landscape | yes | 2019/12/20210310_129DuaneSt-3975-2.jpg |
| hudson-street-penthouse | 755 | 1280×854 | no | landscape | yes | 2019/12/Hudson-Featured-1.jpg |
| mint-kitchen-restaurant | 813 | 5600×3733 | yes | landscape | yes | 2019/12/Creme_Mint-Kitchen_HR-11.jpg |

## Measured evidence

Viewport 1440×900, `?d=` as named, tab foregrounded. Displayed hero slot after the
200px sidebar is **1240×900**. Joined to `img.naturalWidth/Height` from the same load.

### The four squares

All four galleries are 2048×2048. `heroFor()` has no landscape to prefer, so it
returns the featured square. A human would pick those same four frames.

- **Lantern House** (`/residential/lantern-house/?d=a|b|c`). The featured frame is
  the curved floor-to-ceiling window wall and city view. **A** pillarboxes it on
  `bg-sidebar`: at 1440 the square is ~900px on a side, dark ground left and right
  of the photo (plus the 200px sidebar, so the photo sits right of centre). It
  reads as a deliberate square, not a postage stamp. **B** cover-crops top and
  bottom; fireplace + city survive. **C** puts the photo in a vertical slot beside
  the white column and cover-crops the *sides* — the city view that is the reason
  for the frame is mostly gone. Pattern C as built is not DESIGN §8’s “photo slot
  is vertical anyway” kindness for this project.
- **The Pierre** (`/residential/795-5th-ave-the-pierre/?d=a|b`). Featured is the
  marble double vanity. **A** keeps the whole square and looks finished. **B**
  crops top/bottom; faucets, sconces, and the marble block still read. This frame
  survives cover-crop.
- **652 Hudson** (source `2023/05/3jZi0pAh.png`). Open-plan dining → living → nook
  under white beams. The subject is the *width* of the room. Cover-crop will lose
  the table or the beams; pillarbox keeps the plan. Same failure mode as Lantern.
- **40 E 66th** (source `2023/05/5xCs3wN5.png`). Fireplace is centred; marble
  tables sit in the lower third. Cover-crop keeps the fireplace and cuts the
  tables. Survivable, like Pierre.

DESIGN §8’s four options, after contact:

| Option | Built? | Survives these four? |
|---|---|---|
| Centre-crop with protected subjects | B/C crop, no subject protection | Pierre and 40 E 66th yes; Lantern and 652 Hudson no |
| Pillarboxed duotone ground | A pillarboxes on `#1A1A1A`, not a duotone | All four yes |
| Split-pair (two squares side by side) | **Not built** | — |
| Pattern C vertical slot | C exists; it `object-cover`s, it does not letterbox | Pierre maybe; Lantern no |

### The unusable-at-full-bleed set, honestly, at 1440

Same slot 1240×900, direction A. `next/image` upsizes; nothing is letterboxed.

| Project | source measured | displayed | scale (h) | Honest look |
|---|---|---|---|---|
| 12th st townhouse | 640×295 | 1240×900 | 3.05× | Soft. The living room is a real photograph; at full-bleed it is a 640px file stretched across a 1240px slot. DESIGN §8 was right. |
| e63rd st Penthouse | 640×392 | 1240×900 | 2.30× | Soft. Open living/dining still reads as a room, not as a hero. |
| Lexington Ave Townhouse | 599×399 | 1240×900 | 2.26× | Softest of the set. Dark library/dining is a good *picture* at native size and a mush at 1440. |
| West 23rd St. Townhouse | 990×740 | 1240×900 | 1.22× | Grainy, not broken. Spiral stair + dog + Crittall window still read. ~25% upscale. |
| Horatio St. Townhouse | 990×740 | 1240×900 | 1.22× | Same class as West 23rd. Living room + stair is usable. |
| Free People (featured) | 513×601 | *not the hero* | — | Featured is unused. `heroFor()` picked the only ≥1920 file, a 3024×4032 stair (id 1017), displayed 1240×900. Sharp. Cover-crop shows the filigree risers and loses the landing. |
| Spring Studios (featured) | 640×360 | *not the hero* | — | Featured is unused. `heroFor()` picked a 2625×675 panorama (id 1189), served 1440×370 into 1240×900. Cover-crop shows a centre strip of red carpet and lights; the lounge→restaurant depth is gone. |

West 23rd and Horatio are the ones DESIGN §8 overstated. They are short of 1920 and
they look it, but they are not in the same class as the three 640px projects.

### `heroFor()` vs a human (17)

**14 of 17** are the frame a human would pick, or the only honest frame in a
small/square set.

**Misses / overrides (not applied):**

| slug | algorithm | human would pick | why |
|---|---|---|---|
| spring-studios-spring-place | 1189 2625×675 | **1902** `2019/12/Spring-Studio.jpg` 1880×1058 | Width-only scoring treats a 3.89:1 strip as a hero. On the commercial wall that tile is 332×85. |
| free-people-retail-store | 1017 3024×4032 portrait | **1022** `2019/12/Free-People-by-Streamline-USA-5.65x4.11-1.jpg` 1695×1233 | The stair is the best *file*. A landing wants landscape. 1022 is under 1920. |
| kith | 1152 3024×4032 portrait neon | no landscape ≥1920 (max 1695×1200) | At 1440 the cover-crop shows “Ki” and almost none of the sneaker wall. Keep 1152 only if the neon is the point; otherwise a sub-1920 landscape, or pillarbox the portrait. |

Hudson’s featured living room (755, 1280×854) beats the wider bedroom (745, 1600×1069).
That is correct: the living room is the project.

### The ragged wall at 1440

`/commercial-projects/?d=a` and `/residential-projects/?d=a`. Every tile is
**332px** wide (`md:w-tile`). `aspect-ratio` is the hero’s `measured_w / measured_h`.
Not a 4:3 grid.

Join, residential wall vs dump:

- Lantern House / The Pierre / 652 Hudson / 40 E 66th: `2048 / 2048` → **332×332**
- 12th st townhouse: `640 / 295` → **332×153**
- e63rd: `640 / 392` → **332×203**
- West 23rd / Horatio: `990 / 740` → **332×248**

Commercial wall: Mint `5600 / 3733` → 332×221; Free People `3024 / 4032` → 332×443;
Spring `2625 / 675` → 332×85. Rows are ragged. Spring’s ribbon is the wall telling
the same story as the hero miss.

## The catch

- These looks are direction A/B/C as built, not DESIGN §8’s unbuilt options.
  Split-pair was not mocked up.
- `lib/projects.ts` still sets `heroCapable` from `image-audit.tsv` (34). The
  photographs themselves come from the manifest. C-2 is still a trap inside F.
- West 23rd and Horatio are “unusable at full-bleed” in the audit and merely
  short in the browser. Do not silently promote them to hero-capable; they are
  still under 1920.
- No screenshot binaries are committed (CLAUDE.md). Reproduction is the URLs
  and the dump above.

## Decision / rule

1. **Do not restyle.** Eric still picks a direction. This finding is input.
2. **Direction A’s pillarbox is the only built treatment that keeps all four
   squares intact.** B/C crop Lantern House and 652 Hudson badly. Pattern C as
   built is a vertical cover-crop, not a square-friendly slot.
3. **The three 640px projects stay off full-bleed.** West 23rd and Horatio are
   the mild cases (≈1.22×). Do not upscale the files.
4. **`heroFor()` matches a human on 14 of 17.** Proposed overrides (session log,
   not a column): Spring 1902; Free People 1022 if the landing must be landscape;
   Kith is a judgment, not a data fix. Do not add `heroOverride` until Alexey
   wants it.

## Reproducing

```bash
lsof -ti:8080 | xargs kill 2>/dev/null
npm run photos:link
npm run build && npm run start
# 1440×900, tab in the foreground (lazy images lie in a background tab)

# squares
open "http://localhost:8080/residential/lantern-house/?d=a"
open "http://localhost:8080/residential/lantern-house/?d=b"
open "http://localhost:8080/residential/lantern-house/?d=c"
open "http://localhost:8080/residential/795-5th-ave-the-pierre/?d=a"
open "http://localhost:8080/residential/795-5th-ave-the-pierre/?d=b"

# unusable
open "http://localhost:8080/residential/12th-st-townhouse-greenwich-village/?d=a"
open "http://localhost:8080/residential/e63-st-penthouse/?d=a"
open "http://localhost:8080/residential/lexington-ave-townhouse/?d=a"
open "http://localhost:8080/residential/west-23rd-townhouse-2/?d=a"
open "http://localhost:8080/residential/horatio-st-townhouse/?d=a"
open "http://localhost:8080/commercial/free-people-retail-store/?d=a"
open "http://localhost:8080/commercial/spring-studios-spring-place/?d=a"

# wall
open "http://localhost:8080/commercial-projects/?d=a"
open "http://localhost:8080/residential-projects/?d=a"
```

Hero dump: the Python in `workorders/cursor-plan.md` Task 3. Displayed sizes:
`document.querySelector('img')` → `naturalWidth/Height` vs `clientWidth/Height`.
Wall: `a[aria-label]` `style.aspectRatio` and `getBoundingClientRect().width`
must be 332.
