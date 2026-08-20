# Live link-check snapshots

Dated TSV tables here are measured-from-live snapshots of `https://www.streamlineusa.com` (www), not a redirect plan and not a source of record for slugs.

Command pattern: sequential `curl -sS -L -o /dev/null -D headers --max-time 15 -w '%{http_code}\t%{url_effective}\t%{num_redirects}' URL`, then sleep 400ms. One request at a time; identical URLs are fetched once and reused. Timeout ~15s; a hang is skipped and noted.

`http_status` is the first hop (keep this for 301 rows). `final_url` is `url_effective` after following redirects. `ok=yes` means that outcome matched the check for the row's set (live 200, SKIP live project 200, litter still present, etc.).

Current file: `2026-08-20.tsv` (2026-08-20). Re-run a gentle sequential sweep to refresh; do not hand-edit; do not parallel-flood production.
