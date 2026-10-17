# Cadeaubonnen en uitgereikte badges vernieuwen

## Uitgangspunten
- **Iedere gebruiker mag uitreiken**, zoals je koos. Een uitreiking is geen identiteitsverificatie: een uitgever krijgt hierdoor nooit automatisch een overheidslabel of blauw vinkje.
- Nieuwe badges, certificaten en diploma’s zijn **standaard volledig onzichtbaar op het openbare profiel**. Alleen de ontvanger bepaalt daarna de weergave.
- De bestaande stijl van het adminportaal blijft behouden. Alle nieuwe teksten komen in Nederlands, Engels, Frans en Duits.

## 1. Cadeaubonnen en persoonlijke kortingscodes
- Herstel het aanmaken en activeren van cadeaubonnen. Toon een duidelijke fout wanneer opslaan of activeren mislukt; zeg niet dat een e-mail is verstuurd als dit niet bevestigd is.
- Eén overzichtelijk formulier met keuze **vast bedrag** of **percentage**. Een vaste cadeaubon blijft een bon met geldwaarde; een percentage wordt een kortingscode, niet een fictief saldo.
- Zoek op `@gebruikersnaam` en vul de gevonden naam en het e-mailadres automatisch in. Deze gegevens blijven bewerkbaar; rechtstreeks een e-mailadres invullen blijft mogelijk. Bij wijziging van de geselecteerde gebruiker mogen oude gegevens niet blijven staan.
- Ondersteun persoonlijk bericht, vervaldatum, gebruikslimiet en bij percentages een optioneel maximumbedrag. Houd huidige toegestane bedragen aan.
- Laat vóór bevestiging de ontvanger, waarde en voorwaarden zien. Na aanmaken: code kopiëren en de werkelijke verzendstatus bekijken. Opnieuw mailen maakt geen nieuwe bon.
- Optionele verzorgde ROUT-e-mail voor een verwachte persoonlijke gift of compensatie, met waarde, voorwaarden, bericht en duidelijke gebruikslink. Geen nieuwsbrieven, bulkverzending of promotionele campagnes.
- Gebruik de bestaande kortings- en checkoutwerking. De genoemde GitHub-versie is als referentie bekeken; daarin ontbreekt de huidige directe admin-uitreiking. We hergebruiken de bestaande vaste/procentuele kortingsmogelijkheden in dit project in plaats van de oudere cadeaucode blind te kopiëren.

## 2. Wapenschilden & badges binnen het portaal
- Geef de badgepagina dezelfde zijbalk, titelruimte en navigatie als de andere adminpagina’s. Alle interne links blijven binnen hetzelfde venster.
- Behoud naam, afbeelding, soort, motto, verhaal en website. Voeg badge, certificaat en diploma als herkenbare uitreikingsvormen toe zonder ROUT-verificatiemarkeringen te veranderen.
- Een familiewebsite of organisatiewebsite invoeren als `familie.be` volstaat: automatisch een veilige HTTPS-link opslaan. Ongeldige of onveilige adressen worden geweigerd.
- Na een upload automatisch een passende accentkleur uit de afbeelding voorstellen; de kleur blijft handmatig aanpasbaar. Toon het resultaat direct.
- Scheid de website/omschrijving van de echte uitgever: vrije tekst zoals “Belgische overheid” mag geen bewijs van verificatie worden.

## 3. Ontvangen marks, badges, certificaten en diploma’s
- Voeg bij **Marks / Badges & diploma’s** een ontvangen-overzicht toe, ook voor items die nog privé zijn.
- Per item twee onafhankelijke keuzes: **naast mijn naam tonen** en **in mijn badges tonen**. Beide staan bij een nieuwe uitreiking uit. De bestaande algemene profielkeuzes blijven gelden.
- Een ingeschakelde mark staat naast de naam, naast een eventueel blauw vinkje of privacyschild, nooit in de plaats ervan. Bij veel marks blijft de naam leesbaar; overige marks blijven bereikbaar.
- Een zichtbare badge toont altijd **Uitgereikt door @uitgever**, met een klikbare link naar het echte ROUT-profiel. Toon uitsluitend diens bestaande verificatiestatus; verzin geen officiële labels.
- De ontvanger kan items weer verbergen of afwijzen. Intrekken door de uitgever stopt openbare weergave, met een duidelijke status voor de ontvanger.
- Nieuwe uitreiking: een persoonlijke ROUT-melding en een verzorgde e-mail met het item, de uitgever en een link naar de privé-keuzes. Een e-maillink publiceert niets automatisch.
- Ook bestaande uitreikingen krijgen ontvangercontrole en echte uitgeververmelding waar die betrouwbaar bekend is. Ontbrekende herkomst niet invullen met een verzonnen uitgever. Bestaande en nieuwe items mogen niet zichtbaar worden door een ontbrekende voorkeur.

## 4. Zelf uitreiken en automatiseren
- Iedere aangemelde gebruiker kan eigen badges, certificaten en diploma’s beheren en onder de eigen ROUT-identiteit aan een bekende `@gebruikersnaam` uitreiken.
- Voor een organisatie-workspace geldt de bestaande rolverdeling: alleen bevoegde teamleden handelen namens die organisatie. Iedereen mag persoonlijk uitreiken, maar niet namens een ander.
- Ontvanger zoeken door gebruikers geeft geen privé-e-mailadres prijs. Alleen de server bepaalt naar welk account de persoonlijke melding gaat.
- Voeg in de ontwikkelomgeving een werkende koppeling toe voor uitreiken, eigen uitreikingen bekijken en intrekken, met voorbeelden die overeenkomen met de daadwerkelijke werking.
- Sleutels krijgen expliciet uitreikingsrecht. Elke aanvraag controleert uitgever, eigendom en actuele rechten. Herhaalde aanvragen met hetzelfde kenmerk maken geen dubbele badge of dubbele melding.
- Een online platform kan zo na een echte gebeurtenis automatisch een privé-item bij de juiste ROUT-gebruiker toevoegen. Daarnaast een ontvanger-bevestigde toevoeglink voor platforms die hun gebruikers zelf laten toevoegen.
- Beperk misbruik met verzendlimieten, blokkeren van ongewenste uitgevers en intrekbare sleutels. Een publiek profiel toont uitsluitend door de ontvanger vrijgegeven items.

## Technische uitvoering
- Behoud **Neon**, Better Auth, de bestaande adminrechten, workspace-controles en centrale e-mailvoorziening. Geen tweede database, geen nieuwe authenticatiestroom en geen vermenging met inloggen via ROUT.
- Cadeaubonnen: verbeter `AdminGiftCards`, de admin-uitreiking en activatie; gebruik bestaande promo-logica voor procentuele codes. Controleer de werkelijke fout via het verzoek en redacted logs voordat de reparatie als opgelost geldt.
- Navigatie: `AdminCustomBadges` mist momenteel de gedeelde `AppLayout`; voeg die toe en vervang de interne gewone link door bestaande router-navigatie.
- Breid badge-definities en uitreikingen uit met eigenaar/uitgever, soort, intrekking en afzonderlijke ontvangerkeuzes. Maak een idempotente Neon-migratie en zorg dat oude grants en claim-links dezelfde veilige regels volgen.
- Openbare lezers handhaven zichtbaarheid server-side, inclusief mark-weergave, badgeverzameling, houderlijsten/tellingen en profielvarianten. Privé-items mogen niet via een ander openbaar pad uitlekken.
- Houd ROUT’s interne verificatiebadges apart van door gebruikers uitgereikte credentials. Gebruik geen zelfgebouwde cryptografie of claim dat dit cryptografisch gecertificeerde diploma’s zijn.
- Ontwikkelkoppelingen komen onder beveiligde publieke API-paden met inputvalidatie, sleutelcontrole, beperkte bevoegdheden, limieten en idempotentie. Documenteer de werkende koppeling; vervang de bestaande aspiratieve badge-API-voorbeeldtekst.
- Gebruik de bestaande lokale e-mailtemplates en centrale verzender. In dit project is geen Lovable-e-maildomein ingesteld; de bestaande app gebruikt een eigen mailvoorziening. Verifieer die voordat verzending als werkend wordt gemeld. E-mailfalen mag een geslaagde uitreiking niet terugdraaien.

## Controle en oplevering
- Tests voor vaste/procentuele waarde, activatiefouten, ontvangerselectie en geen dubbele uitreiking.
- Tests voor standaard privé, afzonderlijke naam-/badgekeuzes, echte uitgever, eigendomscontrole, intrekken en API-rechten.
- Controleer binnen een echte adminsessie aanmaken → opgeslagen code → bruikbaarheid, en uitreiken → privé ontvangen → keuze wijzigen → openbare weergave teruglezen.
- Controleer portaalnavigatie, afbeelding/kleursuggestie, website zonder voorvoegsel en naamweergave op smalle en brede schermen.
- Als een echte ROUT-sessie of e-mailinstelling ontbreekt, benoem precies welke ingelogde of verzendcontrole nog niet uitgevoerd kon worden; geen volledigheidsclaim op basis van alleen een lege of uitgelogde pagina.