import { createRequire } from 'node:module';
import react from '@vitejs/plugin-react';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import mdx from 'fumadocs-mdx/vite';
import { nitro } from 'nitro/vite';

const require = createRequire(import.meta.url);

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    mdx(),
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: false,
      },
    }),
    react(),
    // Vercel detects TanStack Start + Nitro and uses the Build Output API (.vercel/output).
    // See https://tanstack.com/start/latest/docs/framework/react/guide/hosting#nitro
    nitro(),
  ],
  resolve: {
    tsconfigPaths: true,
    alias: {
      tslib: require.resolve('tslib/tslib.es6.js'),
    },
  },
});
