# Duolingo live component + database access

## 1. Database access (Neon)
- This project reads the database through the Lovable Neon connection in preview. I'll open the Neon connect card so you can pick or create the connection. Your connection string stays inside Lovable and never shows up in chat.
- Once it's linked, I can look at the real tables, run the waiting migrations (including the YouTube one) and fix tables or the Better Auth setup where needed.
- I'll also ask for `BETTER_AUTH_SECRET` through the secure form if it isn't saved yet. That way sign-in keeps the same secret it uses now.
- Please don't paste a Neon API key or password in chat. If you still want a Neon API key saved (for example for deploy scripts), I'll open the secure form for it.

## 2. Duolingo in the catalogue and the vault
- New service "Duolingo" under Culture & leisure, live, with the Duolingo logo.
- In the vault you only enter your Duolingo username. It's saved like the other services, under `duolingo`.
- It can be added as a live component in your profile hub and opens the same panel as the others.
- Switches for what to show: streak, the language you're learning, total XP.

## 3. Fetching the live data
- On the server, fetch `https://www.duolingo.com/2017-06-30/users?username=…` and take the first user.
- Read three things: the current streak, the active language (the course matching `learningLanguage`, otherwise the first course) and total XP.
- Cached briefly, with a timeout. If Duolingo can't be reached or the username doesn't exist, the card simply doesn't show.

## 4. Profile card
- "🔥 14 dagen streak", "Leert momenteel Spaans" (language names in Dutch) and optionally "12.340 XP".
- Same compact look as the other live cards on the profile. Steam and Trakt don't exist in the code yet; your notes on those (and on WakaTime OAuth) come after this.

## 5. Checks
- Run the code check and all tests. Add tests: the right course is picked, the streak and XP are read correctly, and an empty or broken answer from Duolingo shows no card.
- About GitHub: I can't push myself. Changes go to GitHub automatically once the project is connected under Settings → Git (you're looking at that section now).

## Technical details
- `integrations-catalog.ts`: `duolingo` entry (icon `siDuolingo`, mode `handle`), stats `streak | language | xp` added to `LiveStatKey`/`LIVE_STATS`. Add it to `LIVE_COMPONENTS` and `LIVE_CAPABLE_PROVIDERS`.
- `duolingo-rules.ts` (browser-safe, tested): `parseDuolingo(json)` → `{ streak, language, languageName, totalXp } | null`, plus a language code → Dutch name map.
- `duolingo.server.ts`: fetch with `AbortSignal.timeout(6000)`, User-Agent header, handle validation (`^[A-Za-z0-9_.-]{1,40}$`). Wired into the existing `case` switch in `integrations.server.ts` next to lichess/chesscom, plus handle normalisation in `integrations-rules.ts`.
- `ProfileIntegrations.tsx`: a duolingo renderer that respects `shownLiveStats`.
- Neon: `standard_connectors--connect` (`neon`). Migrations go through `scripts/migrate-gateway.ts` as described in AGENTS.md.
