# Finish live components in the profile hub

Note: the GitHub code I imported doesn't include the half-built panel from your notes. There is no live-component panel and no "integration component" type in it yet. So this plan builds it from scratch, following your notes (section 3–5).

## 1. Check first
- Run the type check, the tests and the build. Fix anything that stops the app from starting before adding anything new.

## 2. Live integration becomes a real component
- Adding a live integration (YouTube, GitHub, chess.com, Lichess, Mastodon, Bluesky, WakaTime, RSS, Spotify) creates a component in your list. You can move it and it shows on your profile in that spot. It no longer just scrolls the page.
- The YouTube card on the profile only shows through its component, so it never appears twice.

## 3. Panel when you tap a live component (wired into the list)
- Compact row: icon, name, account, status badge, arrow to expand.
- Expanded:
  - Link by username
  - Connect officially (only where needed: YouTube stats, Spotify now playing)
  - Disconnect (only when connected)
  - Switches for which stats to show, per platform
- Show/hide and the delete button stay as they are.

## 4. YouTube controls and video count
- The YouTube component shows its own connect, show/hide and disconnect controls when opened.
- Add the "number of videos" stat. It reads the channel's video count from YouTube and only shows once YouTube is officially connected.

## 5. Verify
- Run the checks again. Add small tests: each platform only allows its own stats, and YouTube's officially-connected-only stats stay hidden until you connect.
- In the browser: add a component, open it and flip a switch, then check the profile.

## Technical details
- New block kind `widget:integration` `{ provider, integrationId, stats[], visible }` in `profile-section-blocks.ts`. The per-provider stat allowlist lives in `integrations-catalog.ts` and is filtered server-side when the public profile is rendered.
- `AddComponentModal` creates the block plus the integration row via `saveIntegration`. `ProfileLinksManager` renders the blocks with the `LiveIntegrations` `Row` pattern.
- `youtube.server.ts`: add `videos: statistics.videoCount` next to subscribers/views. `YouTubeCard` renders it when the stat is enabled.
- Remove the unconditional YouTube card from `ProfileView`.
- Update roadmap.md.
