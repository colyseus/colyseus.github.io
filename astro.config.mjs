import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";
import react from '@astrojs/react';
import expressiveCode from "astro-expressive-code";

// https://astro.build/config
export default defineConfig({
  outDir: "./docs",
  site: 'https://colyseus.io',
  compressHTML: true,
  integrations: [expressiveCode(), mdx(), sitemap(), tailwind(), react()],

  //
  // Syntax Highlight docs:
  // ----------------------
  // https://docs.astro.build/en/guides/markdown-content/#syntax-highlighting
  //

});
