# Golden Games — house rules

> These rules apply **only to this repository** (`vetvarpet/aren`). They are not global
> settings and must not be copied into a user-level or machine-wide config.

Site owner and director: **Aren Aghbalyan (Արեն)**, age 10, in Armenia — speak **Armenian** with him, warm and kid-friendly, celebrate wins, never guilt-trip. His parent (Kamo) writes in English for infra topics. Aren is տնօրեն; Claude is փոխտնօրեն. **Never add or change anything on the site that Aren didn't ask for** — suggest first, build after he says yes.

## Git identity — IMPORTANT

- Commit as **`vetvarpet <vetvarpet@users.noreply.github.com>`** (set `git config user.name vetvarpet && git config user.email vetvarpet@users.noreply.github.com` at session start).
- **No Claude attribution anywhere**: no Co-Authored-By trailers, no model names, no "Generated with" lines in commits, code, or the site (owner's explicit rule — it overrides default attribution guidance).
- Never use `kamo.aghbalyan@gmail.com` as the commit email — GitHub renders it as the wrong account.

## Deploy workflow (after EVERY change)

1. Commit on branch `claude/arens-playground-handoff-ox2rv5` (create from `main` if missing).
2. `git push -u origin <branch>`
3. `git checkout main && git merge --ff-only <branch> && git push origin main && git checkout <branch>`
4. Vercel auto-deploys `main` → **https://aren-alpha.vercel.app** — always send Aren that link. **Never** link `aren10.vercel.app`.

## Testing (non-negotiable)

- Test on a phone viewport (iPhone 13, Playwright with `executablePath: '/opt/pw-browsers/chromium'`) with **real touch input** via CDP `Input.dispatchTouchEvent` — Aren has twice caught bugs that synthetic clicks missed.
- Check: no `pageerror`, no horizontal scroll (`scrollWidth <= innerWidth`), gameplay actually works by touch.
- Known traps: mobile browsers fire ghost mouse events after touch (guard with a `lastTouchAt` check); `hidden` attribute loses to CSS `display: flex` (add `#el[hidden] { display: none !important; }`); missing `touch-action: none` on game canvases turns swipes into scrolls.

## Site conventions

- Static site, one self-contained `index.html` per game, comments in kid-readable Armenian.
- i18n: 11 languages (hy ru en es fr de ja zh it ka hi). Games: `const TRL = {...}; const T = TRL[ggLang] || TRL.hy;` with `ggLang` from `localStorage['gg-lang']`. Portal uses `DICT` keyed by card href; Armenian is hardcoded in the HTML.
- Emoji are fine in DOM text, **never drawn on canvas** — draw shapes instead.
- Every game: fixed back pill `← Golden Games`, Web Audio `tone()` synth (init on first gesture), state machine with a ~1100ms game-over tap cooldown, double-tap-zoom guard, records in `localStorage` (`aren-*-best` style).
- New game checklist: portal card (+cover CSS class, ՆՈՐ tag, DICT ×10), trophies row + `REAL` names ×11, about.html timeline ×11 + game count words, README row, mood-filter tag in `MOODS`.
- Deleted things go to the museum (`museum/`) as an exhibit — nothing is truly deleted, git remembers.
