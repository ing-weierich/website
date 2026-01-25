# ING WEIERICH

## Local development

### 1) Build assets/CSS

```bash
npm install
npm run build:css
```

### 2) Start the dev server

SSGO provides a dev server. It renders HTML on the fly and also serves files from `dist/`.

```bash
SSGO_DEV=1 go run main.go
```

Open: `http://localhost:8080`

> Note: The dev server does not build Tailwind automatically. Run `npm run build:css` first.

## Production build

```bash
npm run build:all
```

Output is written to `dist/`.

## Deploy (Vercel)

- Build Command: `npm run build:all`
- Output Directory: `dist`
