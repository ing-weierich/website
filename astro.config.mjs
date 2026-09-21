// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    // GitHub Pages mit eigener Domain (Settings → Pages → Custom domain).
    site: 'https://www.ing-weierich.de',
    base: '/',
    output: 'static',
    outDir: './dist',
    build: {
        format: 'directory',
    },
});
