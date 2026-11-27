// Astro settings. The site renders on the server (SSR) on every page load,
// so a new story shows up on the next refresh without rebuilding.
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// Reads SITE_URL from a .env file, if you made one (one line: SITE_URL=https://your-domain.com).
try {
  process.loadEnvFile();
} catch {
  /* no .env file: use the default below */
}

export default defineConfig({
  // Your public web address. Set SITE_URL once you buy the domain.
  site: process.env.SITE_URL || 'http://localhost:4321',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
});
