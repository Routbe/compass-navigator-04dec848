# Profielhub opruimen, sociale koppelingen, workspaces, ontwikkelaarsportaal en ROUT-login

## 1. Eén plek om toe te voegen: "Component toevoegen"
- De losse knoppen "+ Link", "+ Socials", "+ Matrix/Fediverse" en "+ vCard" verdwijnen. Alles zit dan in "Component toevoegen".
- Meer tabbladen in de sociale media, naast "Aanbevolen" en "Alles":
  - **Soeverein & Europees** (Eyou, W.social, Mastodon, Matrix, Signal, Pixelfed, Bluesky enz.)
  - **Populair** (Instagram, TikTok, YouTube, X, Facebook, LinkedIn, Snapchat ...)
  - **Video & streaming**, **Berichten & chat**, **Werk & creators**
- De platforms die nog ontbreken komen erbij, zoals Tumblr, Vimeo, Dailymotion, PeerTube, Lemmy, Misskey, Behance, Dribbble, Patreon, Ko-fi, Spotify-artiest, SoundCloud, Steam en Viber.

## 2. Sociale component: gebruikersnaam en uitklapbare instellingen
- Je vult de gebruikersnaam in, zoals nu.
- Daaronder kun je "Extra instellingen" openklappen met:
  - de knop **Koppel je account** (via de officiële login van het platform waar die bestaat: YouTube, Snapchat, GitHub, Bluesky, Mastodon, Twitch ...). Bij platforms zonder login: verificatie via een code in je bio.
  - na het koppelen een **groen vinkje "Geverifieerd"**, op het profiel en in de hub;
  - de schakelaar **Aantal volgers tonen** (alleen voor gekoppelde accounts).
- **YouTube** wordt een gewone component in de lijst, net als de rest. De aparte YouTube-kaart onderaan verdwijnt. Nu opent de YouTube-tegel in de lijst per ongeluk een melding over het prikbord; dat wordt ook opgelost.

## 3. "Totaal bereik" en badges
- Het vak "Totaal bereik" gaat weg. Het aantal volgers staat voortaan per sociaal kanaal (zie punt 2).
- "ROUT badges" verhuist naar een nieuwe map onder Links & componenten: **Badges & diploma's**.

## 4. Workspace-wisselaar
- De knop "Persoonlijk / wisselen" verschijnt alleen als je lid bent van minstens één andere workspace.
- In het ontwikkelaarsportaal blijft hij altijd zichtbaar.

## 5. Rondleiding in het ontwikkelaarsportaal
- Wie het portaal voor het eerst opent, krijgt een interactieve rondleiding van 5 à 6 stappen: "Klik hier" wijst telkens het juiste onderdeel aan, zoals workspace aanmaken of joinen, apps, API-sleutels, documentatie en instellingen.
- Je kunt de rondleiding overslaan en later opnieuw starten via een knop "Rondleiding".

## 6. Foutmelding "Het terugkeeradres van deze app klopt niet"
- Eerst nagaan waarom het misgaat. Het foutscherm toont al welk adres de app stuurt en welk adres geregistreerd is; met een voorbeeld daarvan vind ik de oorzaak.
- Daarnaast verbeteringen die zeker helpen:
  - bij het registreren een adres met verborgen inloggegevens weigeren, zodat het geen adres oplevert dat nooit werkt;
  - in de console een duidelijke vergelijking tonen: "jouw app stuurt X, geregistreerd is Y", met een knop "Dit adres toevoegen" voor de eigenaar van de app;
  - controleren dat apps met de officiële ROUT-loginbibliotheek het juiste adres sturen.

## Technische details
- In `AddComponentModal.tsx` komen tabbladen voor sociale media (tags in `src/lib/profile.ts`). De snelknoppen in `ProfileLinksManager.tsx` gaan weg, en de YouTube-afhandeling in `ProfileEditor.tsx` wordt gerepareerd.
- Koppelen hergebruikt de bestaande stromen: `social-verify.server.ts` (bio-code), `integrations.server.ts`, `youtube.server.ts` en `snapchat.server.ts`. In het blok komt een gekoppelde `social_link`/integratie met de vlag `showFollowers`. Het vinkje komt alleen uit de verificatie aan de serverkant.
- `TotalReachToggle` gaat uit de hub. De gegevens blijven bewaard; er wordt niets verwijderd uit de database.
- `WorkspaceSwitcher`: verbergen als `workspaces.length === 0`, behalve met de eigenschap `alwaysShow` in de console.
- De rondleiding is een lichte, eigen spotlight-component. "Gezien" wordt per account bewaard.
- OAuth: `isValidRedirectUri` krijgt dezelfde regels als `redirect-match.ts`, en er komt een test voor elke matchregel.
