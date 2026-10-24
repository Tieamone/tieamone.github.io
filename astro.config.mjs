// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://tieamone.github.io',
  integrations: [sitemap({ filter: (page) => !new URL(page).pathname.startsWith('/admin') })],
});
