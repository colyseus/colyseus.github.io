import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify/functions';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: 'https://colyseus.io',
  compressHTML: true,
  integrations: [mdx(), sitemap(), tailwind()],
  // adapter: netlify(),
});
