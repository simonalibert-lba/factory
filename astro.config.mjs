// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// Site statique ; seule la route /api/contact est exécutée côté serveur (fonction Vercel).
export default defineConfig({
  // site: 'https://…', // domaine définitif à fournir (sitemap, URL canoniques)
  output: 'static',
  adapter: vercel(),
  i18n: { defaultLocale: 'fr', locales: ['fr', 'en', 'ar'], routing: { prefixDefaultLocale: false } },
});
