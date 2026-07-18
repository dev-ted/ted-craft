import react from '@vitejs/plugin-react';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import mdx from 'fumadocs-mdx/vite';
import { nitro } from 'nitro/vite';

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
    // traceDeps: Nitro otherwise ships an incomplete tslib package (missing modules/index.js),
    // which crashes SSR when Radix/cmdk resolve the Node "import" export condition.
    // See https://github.com/fuma-nama/fumadocs/issues/3104
    nitro({
      preset: 'vercel',
      traceDeps: ['tslib*'],
    }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
});
