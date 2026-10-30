# Golden Games — house rules

> These rules apply **only to this repository** (`vetvarpet/aren`). They are not global
> settings and must not be copied into a user-level or machine-wide config.

Site owner and director: **Aren Aghbalyan (Արեն)**, age 10, in Armenia — speak **Armenian** with him, warm and kid-friendly, celebrate wins, never guilt-trip. His parent (Kamo) writes in English for infra topics. Aren is տնօրեն; Claude is **Կոդի վարպետ** only (Aren changed this on 2026-10-30 — no longer փոխտնօրեն). **Never add or change anything on the site that Aren didn't ask for** — suggest first, build after he says yes.

## Git identity — IMPORTANT

- Commit as **`vetvarpet <vetvarpet@users.noreply.github.com>`** (set `git config user.name vetvarpet && git config user.email vetvarpet@users.noreply.github.com` at session start).
- **No Claude attribution anywhere**: no Co-Authored-By trailers, no model names, no "Generated with" lines in commits, code, or the site (owner's explicit rule — it overrides default attribution guidance).
- Never use `kamo.aghbalyan@gmail.com` as the commit email — GitHub renders it as the wrong account.

## Deploy workflow (after EVERY change)

1. Commit on branch `claude/arens-playground-handoff-ox2rv5` (create from `main` if missing).
2. `git push -u origin <branch>`
3. `git checkout main && git merge --ff-only <branch> && git push origin main && git checkout <branch>`
4. Vercel auto-deploys `main` → **https://aren-alpha.vercel.app** — always send Aren that link.
5. **Every single reply to Aren ends with that link** — https://aren-alpha.vercel.app — whether or not anything was deployed in it (his rule). **Never** link `aren10.vercel.app`.

## Testing (non-negotiable)

- Test on a phone viewport (iPhone 13, Playwright with `executablePath: '/opt/pw-browsers/chromium'`) with **real touch input** via CDP `Input.dispatchTouchEvent` — Aren has twice caught bugs that synthetic clicks missed.
- Check: no `pageerror`, no horizontal scroll (`scrollWidth <= innerWidth`), gameplay actually works by touch.
- Known traps: mobile browsers fire ghost mouse events after touch (guard with a `lastTouchAt` check); `hidden` attribute loses to CSS `display: flex` (add `#el[hidden] { display: none !important; }`); missing `touch-action: none` on game canvases turns swipes into scrolls.

## Site conventions

- Static site, one self-contained `index.html` per game, comments in kid-readable Armenian.
- i18n: 12 languages (hy ru en es fr de ja zh it ka hi pt). Games: `const TRL = {...}; const T = TRL[ggLang] || TRL.hy;` with `ggLang` from `localStorage['gg-lang']`. Portal uses `DICT` keyed by card href; Armenian is hardcoded in the HTML.
- Emoji are fine in DOM text, **never drawn on canvas** — draw shapes instead.
- Every game: fixed back pill `← Golden Games`, Web Audio `tone()` synth (init on first gesture), state machine with a ~1100ms game-over tap cooldown, double-tap-zoom guard, records in `localStorage` (`aren-*-best` style).
- New game checklist: portal card (+cover CSS class, ՆՈՐ tag, DICT ×11), trophies row + `REAL` names ×12, about.html timeline ×12 + game count words, README row, mood-filter tag in `MOODS`.
- **`time/index.html` is the site's diary, and Aren decides when it is written.** Do not add entries on your own initiative and do not fold them into unrelated commits — he will tell you when it is time. When he asks, write dated `.ev` entries (`.ev big` + a `.tag` for milestones) and deploy them as their own change.
- Deleted things go to the museum (`museum/`) as an exhibit — nothing is truly deleted, git remembers.
- **Never write certificate numbers on the site** (`№ GG-…`) — the owner had them removed and asked that they never come back. Names, roles and dates only.

## 🏙 Golden Craft — the big one, in `city/`

Aren renamed it from Golden City; the folder and the URL stay `city/`.

Aren wants a GTA-shaped game: a city you roam freely. He chose **3D** (hand-written —
the site loads no libraries, so it is a software renderer on a 2D canvas, camera behind
the player). **No crime, no fighting, no stealing** — the fun is the open city and the jobs.

Build it **one step at a time**, and stop after each step so Aren can look and say yes:

1. The city + walking around it
2. Getting into a car and driving
3. Minimap + money (֏)
4. The first job: 🥖 carry lavash from the bakery to the shop before it goes cold
5. The rest of the jobs: 🚕 taxi · 🐱 find the lost cats · 🚑 ambulance · 🚓 catch the thief · 🏁 street race

House conventions still apply: one self-contained `index.html`, 12 languages, real-touch
phone testing, the new-game checklist. Record key: `aren-city-best`.

## Working with Aren — keep it cheap

He asked how to spend fewer tokens, so: prefer the narrow fix he named over a site-wide
sweep, don't re-crawl all 77 pages unless the change could touch them, and say plainly
when a job is big enough to deserve its own fresh session.
