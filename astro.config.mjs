// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  adapter: cloudflare(),

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    }
  }
});
