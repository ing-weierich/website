// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    // GitHub Pages Projektseite: https://ing-weierich.github.io/website/
    // Beim Umzug auf eine eigene Domain: site anpassen und base auf '/' setzen.
    site: 'https://ing-weierich.github.io',
    base: '/website',
    output: 'static',
    outDir: './dist',
    build: {
        format: 'directory',
    },
});
