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

## Lokale Entwicklung

Node-Version steht in `.nvmrc` (Node 22):

```bash
nvm use
npm install
npm run dev
```

Öffnen: `http://localhost:4321/website/` (Basispfad, siehe Deploy).

Weitere Skripte: `npm run check` (Astro-/TypeScript-Diagnostics), `npm run preview`
(baut nicht, sondern serviert den vorhandenen `dist/`-Build).

## Production Build

```bash
npm run build
```

Die Ausgabe landet in `dist/`, Vorschau des Builds mit `npm run preview`.

## Deploy (GitHub Pages)

Deployt wird per GitHub Actions (`.github/workflows/deploy.yml`) — ausgelöst durch Pushes
auf den Branch `develop` oder manuell über *Actions → Deploy to GitHub Pages → Run workflow*.
Voraussetzung: unter *Settings → Pages* muss als Source **GitHub Actions** eingestellt sein.

Live-URL: `https://ing-weierich.github.io/website/`

Weil die Seite unter einem Unterpfad läuft, ist in `astro.config.mjs` `base: '/website'`
gesetzt. Alle internen Links und Asset-Pfade laufen deshalb über `withBase()` aus
`src/lib/content.ts` bzw. über `toURL()` — hartkodierte Pfade wie `/logo.svg` würden
unter dem Basispfad ins Leere zeigen.

### Umzug auf eine eigene Domain

1. `astro.config.mjs`: `site` auf die Domain setzen, `base: '/'`.
2. `public/CNAME` mit der Domain anlegen (eine Zeile, z.B. `www.ing-weierich.de`).
3. DNS auf GitHub Pages zeigen lassen und die Domain unter *Settings → Pages* eintragen.

`withBase()` bleibt dabei unverändert nutzbar — bei `base: '/'` gibt es die Pfade
unverändert zurück.
