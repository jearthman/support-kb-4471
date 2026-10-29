import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { fileURLToPath } from 'node:url';

// The export ships src/ only. This is the smallest frame that renders it: .svx pages through
// mdsvex, `layout: runbook` from frontmatter, every page prerendered to plain HTML.
/** @type {import('@sveltejs/kit').Config} */
export default {
  extensions: ['.svelte', '.svx'],
  preprocess: [
    vitePreprocess(),
    mdsvex({
      extensions: ['.svx'],
      layout: { runbook: fileURLToPath(new URL('./src/lib/layouts/runbook.svelte', import.meta.url)) },
    }),
  ],
  kit: {
    // Built pages are committed under rendered/: the kb as the desk sees it.
    adapter: adapter({ pages: 'rendered', assets: 'rendered' }),
    prerender: { entries: ['/kb/'], handleHttpError: 'warn' },
  },
};
