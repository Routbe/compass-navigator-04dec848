# Workspaces & teamrollen + Developer Console-upgrade

Twee briefs, in deze volgorde: eerst de console-verbeteringen (klein, los), daarna workspaces (raakt het datamodel).

## Deel A — Developer Console (DX)

1. **Foutdetails bij verkeerd terugkeeradres** — op de "Deze aanvraag klopt niet"-pagina blijft de gewone melding staan. Eronder komt "Foutdetails weergeven (voor ontwikkelaars)" met: `redirect_uri_mismatch`, de toegestane adressen van die app en het ontvangen adres. Alleen tonen voor een bestaande app-ID, zodat niemand zo andermans configuratie kan aftasten zonder geldige client.
2. **Eén keuze voor assistent en stack** — de keuzeknoppen (Cursor, Lovable… / Next.js, Express…) staan bovenaan de AI-promptpagina, en alle drie de prompts passen zich meteen aan.
3. **Webhook-activiteit** — een tabel op de API & Webhooks-pagina met tijdstip, eventtype, status (groen/rood) en duur; klik op een rij voor details. We gebruiken de echte afleverlogs die al bestaan, geen nepdata (projectregel). Omdat we bewust geen berichtinhoud opslaan, toont de detailweergave de metadata en niet de volledige inhoud.
4. **Secret vernieuwen** — op de Credentials-pagina een rode knop "Secret vernieuwen" met een bevestigingsvenster ("je huidige integraties breken direct"). Daarna wordt het nieuwe secret één keer getoond.

## Deel B — Workspaces & rollen

1. **Gegevens** — nieuwe tabellen voor workspaces (naam, korte naam, avatar, plan) en leden (persoon + rol: eigenaar, admin, developer, editor). Bestaande bedrijfsaccounts krijgen automatisch een workspace met de huidige eigenaar als eigenaar.
2. **Workspace-wisselaar** linksboven: "Persoonlijk" plus elke workspace waar je lid van bent. Je keuze wordt onthouden.
3. **Team-tabblad** in de instellingen (alleen eigenaar/admin): ledenlijst, iemand uitnodigen via e-mail + rol (voorlopig zonder uitnodigingsmail, die volgt later), rol wijzigen, lid verwijderen. De laatste eigenaar kan niet verwijderd of gedegradeerd worden.
4. **Toegang per rol** — Developer Console en API & Webhooks alleen voor eigenaar, admin en developer; voor editors verdwijnen die menu-items en wordt de toegang ook op de server geweigerd.

Eerste stap: de console, de API-sleutels en de statistieken lezen per actieve workspace. Profiel-editor en andere dashboardonderdelen volgen in een tweede ronde, zodat er niets tegelijk breekt.

## Technische details

- Er is geen Supabase/RLS: toegang wordt in de serverfuncties gecontroleerd met een nieuwe `assertWorkspaceRole(userId, workspaceId, roles[])` (pure regels in `workspace-rules.ts` met tests). De actieve workspace staat in een HttpOnly-cookie `active_workspace_id`, op de server altijd opnieuw nagekeken tegen het lidmaatschap.
- Migratie `db/96_workspaces.sql` (idempotent, enum `workspace_role`, unieke (workspace_id, user_id), backfill vanuit de bestaande business-velden uit db/41), toegepast met `scripts/migrate-gateway.ts`.
- `oauth_clients` krijgt een optionele `workspace_id`; apps zonder blijven persoonlijk.
- Uitnodigingen in `workspace_invites` (e-mail, rol, status); aanvaarden bij aanmelden met dat e-mailadres.
- Secret-rotatie: nieuw secret hashen, oude hash meteen ongeldig, actie loggen in de bestaande auth-logs.
- Tests: rolmatrix (wie mag console/team), laatste-eigenaar-regel, redirect-mismatch-details alleen bij geldige client.
- Afsluiten met `tsgo --noEmit` en de volledige testsuite; AGENTS.md krijgt een regel over workspace-toegang.
