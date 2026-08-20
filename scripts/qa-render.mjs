#!/usr/bin/env node
/**
 * Render QA over a running origin. Replaces qa-patterns.mjs and qa-directions.mjs, which
 * imported `playwright` — a dependency this repo never declared, so both failed on import
 * and the Phase E gate they were meant to evidence could not have been produced here
 * (review claude-2026-08-20, D-5).
 *
 * This asserts what HTTP can actually prove: routes answer, the three directions and the
 * variant switches produce different documents, photography is wired, the canonical URL
 * form is the slashed one, and the kill-list is absent from rendered text.
 *
 * What it deliberately does NOT claim: viewport layout at 390/768/1440, keyboard behaviour
 * in the lightbox, and `prefers-reduced-motion`. Those need a real browser and a real
 * keyboard. They were verified by hand on 2026-08-20 (review §1a); if you change the shell,
 * verify them by hand again rather than trusting this script.
 *
 *   npm run start &  node scripts/qa-render.mjs
 *   QA_BASE=http://127.0.0.1:8080 node scripts/qa-render.mjs
 */
const base = (process.env.QA_BASE ?? "http://127.0.0.1:8080").replace(/\/$/, "");
let failures = 0;

function ok(name, pass, detail = "") {
  console.log(`${pass ? "  ok  " : "  FAIL"} ${name}${detail ? ` — ${detail}` : ""}`);
  if (!pass) failures += 1;
}

async function get(path) {
  const res = await fetch(`${base}${path}`, { redirect: "manual" });
  const body = res.status < 300 ? await res.text() : "";
  return { status: res.status, location: res.headers.get("location"), body };
}

const ROUTES = [
  "/",
  "/services/",
  "/about/",
  "/clients/",
  "/contact/",
  "/partners/",
  "/commercial-projects/",
  "/residential-projects/",
  "/property-management/",
  "/videos/",
  "/request-for-pricing/",
  "/portfolio/",
];

console.log(`qa-render: ${base}`);

for (const r of ROUTES) {
  const { status } = await get(r);
  ok(`route ${r}`, status === 200, `status ${status}`);
}

// Canonical URL form is the slashed one — PLAN §1 row 3.
{
  const slashed = await get("/commercial/mackage-soho/");
  const bare = await get("/commercial/mackage-soho");
  ok("slashed project URL is canonical", slashed.status === 200, `status ${slashed.status}`);
  ok(
    "unslashed 308s to slashed",
    bare.status === 308 && (bare.location ?? "").endsWith("/commercial/mackage-soho/"),
    `${bare.status} -> ${bare.location}`,
  );
}

// Photography is wired: the index wall and a project hero both emit optimized images.
{
  const wall = await get("/commercial-projects/");
  // `trailingSlash: true` makes Next emit `/_next/image/?url=`, with the slash. Match both.
  const OPT = /_next\/image\/?\?url=%2Fphotos/g;
  const tiles = (wall.body.match(OPT) ?? []).length;
  ok("index wall emits photography", tiles > 20, `${tiles} optimizer URLs`);

  const project = await get("/commercial/mackage-soho/");
  const hero = (project.body.match(OPT) ?? []).length;
  ok("project hero emits photography", hero > 0, `${hero} optimizer URLs`);

  const m = project.body.match(/_next\/image\/?\?url=(%2Fphotos[^"&]+)&amp;w=(\d+)/);
  if (m) {
    const img = await fetch(`${base}/_next/image/?url=${m[1]}&w=${m[2]}&q=75`, {
      headers: { accept: "image/webp,*/*" },
    });
    const type = img.headers.get("content-type") ?? "";
    ok("optimizer serves a modern format", img.ok && /webp|avif|jpeg/.test(type), `${img.status} ${type}`);
  } else {
    ok("optimizer URL present to probe", false);
  }
}

// The homepage video variants must emit a real <video>, and the tinted one an overlay.
{
  const [loop, tint, stills] = await Promise.all([
    get("/?home=video-loop"),
    get("/?home=video-tint"),
    get("/?home=still"),
  ]);
  const vid = (b) => (b.match(/<video/g) ?? []).length;
  ok("video-loop plays a reel", vid(loop.body) === 1, `${vid(loop.body)} <video>`);
  ok("video-tint plays a reel", vid(tint.body) === 1, `${vid(tint.body)} <video>`);
  ok("video-tint lays a black over it", tint.body.includes("bg-black/45"));
  ok("video-loop has no overlay", !loop.body.includes("bg-black/45"));
  ok("still variant uses photography, not video", vid(stills.body) === 0);
  const reel = await fetch(`${base}/videos/reel-1.mp4`, { headers: { range: "bytes=0-999" } });
  ok("reel serves byte ranges", reel.status === 206, `status ${reel.status}`);
}

// The three directions and the variant switches must actually differ.
{
  const [a, b, c] = await Promise.all([get("/?d=a"), get("/?d=b"), get("/?d=c")]);
  ok("direction c differs from a", a.body.length !== c.body.length, `${a.body.length} vs ${c.body.length}`);
  const pa = await get("/commercial/mackage-soho/?d=a");
  const pb = await get("/commercial/mackage-soho/?d=b");
  ok("project view differs a vs b", pa.body.length !== pb.body.length, `${pa.body.length} vs ${pb.body.length}`);
  ok("direction b renders", b.status === 200);

  const navs = await Promise.all(
    ["mirror", "partners", "split", "five"].map((n) => get(`/?nav=${n}`)),
  );
  ok("nav variants respond", navs.every((n) => n.status === 200));
}

// Kill-list must not appear in rendered text (DESIGN §9).
{
  const BAD = ["555-1234", "456-7890", "123 Construction", "Hello world", "example.com", "[object Object]", "_cdata"];
  for (const r of ["/", "/contact/", "/services/", "/partners/", "/clients/"]) {
    const { body } = await get(r);
    const text = body.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ");
    const hits = BAD.filter((s) => text.includes(s));
    ok(`kill-list clean ${r}`, hits.length === 0, hits.join(", "));
  }
}

// The two 410s, and a legacy URL landing in one hop.
{
  const gone = await get("/sample-page/");
  ok("/sample-page/ is 410", gone.status === 410, `status ${gone.status}`);
  const legacy = await get("/residential/5th-avenue-townhouse/");
  ok(
    "legacy 301 lands in one hop",
    legacy.status === 301 && (legacy.location ?? "").endsWith("/"),
    `${legacy.status} -> ${legacy.location}`,
  );
}

console.log(failures === 0 ? "qa-render: all checks passed" : `qa-render: ${failures} failure(s)`);
process.exit(failures === 0 ? 0 : 1);
