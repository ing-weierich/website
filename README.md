# ING WEIERICH

Statische Website auf Basis von [Astro](https://astro.build) (SSG). Die Inhalte liegen als
JSON in `data/`, das Rendering erfolgt über Astro-Komponenten in `src/`.

## Struktur

```
data/pages/*.json        Seiten (Slug = Dateiname), Sections mit Modulen
data/navigation/*.json   Haupt- und Footer-Navigation
src/pages/[slug].astro   erzeugt eine Seite pro data/pages/*.json
src/pages/index.astro    Startseite (rendert data/pages/startseite.json)
src/components/modules/  ein Astro-Modul je Modultyp (stage, text, cards, ...)
src/lib/content.ts       lädt die JSON-Daten und stellt Helper bereit
src/styles/styles.css    Tailwind + Komponenten-Styles
public/                  Assets, Fonts, Favicons (werden 1:1 nach dist/ kopiert)
```

Ein neuer Modultyp braucht eine Komponente in `src/components/modules/` und einen Eintrag
in der `modules`-Map in `src/components/PageSections.astro`.

Tailwind scannt auch `data/**/*.json` — Klassen, die nur im HTML der `html`-Module
vorkommen (z.B. `.steps`, `.usp-band` auf der Gewässerschutz-Seite), bleiben dadurch
im Build erhalten.

## Cookie-Banner und Analytics

`src/scripts/cookie-consent.ts` verwaltet die Einwilligungen und rendert die
Kategorie-Schalter in [CookieConsent.astro](src/components/CookieConsent.astro). Die
Entscheidung liegt im `localStorage` unter `cookie-consent`. Jedes Element mit dem Attribut
`data-cookie-open` öffnet die Einstellungen erneut — im Footer sitzt dafür der Button
"Cookie-Einstellungen".

Banner und Footer-Button erscheinen nur, wenn mindestens eine **optionale** Kategorie
registriert ist. Ist nur die notwendige Kategorie vorhanden — etwa weil keine
`PUBLIC_GA_MEASUREMENT_ID` gesetzt ist — speichert die Seite nichts Einwilligungspflichtiges,
und es wird kein Banner gezeigt.

Weitere Kategorien meldet man über die API an — das Analytics-Skript ist genau so
angebunden:

```ts
import consent from './cookie-consent';

consent.register({ id: 'maps', title: 'Karten', description: '…' });
consent.onConsent('maps', () => { /* erst jetzt laden */ });
```

Google Analytics lädt ausschließlich nach Einwilligung in die Kategorie "Statistik".
Die Measurement-ID kommt aus `PUBLIC_GA_MEASUREMENT_ID` und steht in `.env.production`,
die nur von `astro build` gelesen wird — `npm run dev` sendet also nie etwas an Google.
Ohne gesetzte ID wird weder die Kategorie registriert noch `gtag.js` geladen.

## Lokale Entwicklung

Node-Version steht in `.nvmrc` (Node 22):

```bash
nvm use
npm install
npm run dev
```

Öffnen: `http://localhost:4321/`.

Weitere Skripte: `npm run check` (Astro-/TypeScript-Diagnostics), `npm run preview`
(baut nicht, sondern serviert den vorhandenen `dist/`-Build).

## Production Build

```bash
npm run build
```

Die Ausgabe landet in `dist/`, Vorschau des Builds mit `npm run preview`.

## Deploy (GitHub Pages)

Gearbeitet wird direkt auf `main`. Deployt wird per GitHub Actions
(`.github/workflows/deploy.yml`) — ausgelöst durch jeden Push auf `main` oder manuell über
*Actions → Deploy to GitHub Pages → Run workflow*. Voraussetzung: unter *Settings → Pages*
ist als Source **GitHub Actions** eingestellt.

Live-URL: `https://www.ing-weierich.de/`

Die eigene Domain ist unter *Settings → Pages → Custom domain* eingetragen (bei einem
Actions-Deploy wird keine `CNAME`-Datei benötigt). DNS beim Domain-Hoster:

- `www` — CNAME auf `ing-weierich.github.io`
- `@` — A-Records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`,
  `185.199.111.153` und AAAA-Records `2606:50c0:8000::153`, `2606:50c0:8001::153`,
  `2606:50c0:8002::153`, `2606:50c0:8003::153` (GitHub leitet auf `www` weiter)
- MX- und SPF-Einträge für die E-Mail bleiben unverändert.

Interne Links und Asset-Pfade laufen über `withBase()` aus `src/lib/content.ts` bzw. über
`toURL()`. Bei `base: '/'` geben sie die Pfade unverändert zurück; sie bleiben trotzdem
nötig, falls die Seite wieder unter einem Unterpfad laufen soll. Läuft die Seite unter
einem Unterpfad, setzt `BaseLayout.astro` automatisch `noindex`.
