import { fileURLToPath } from 'node:url';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';
const ROOT_ENV_DIR = fileURLToPath(new URL('../..', import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ROOT_ENV_DIR, '');
  const apiUrl = env.API_URL || 'http://api:4000';
  return {
    envDir: ROOT_ENV_DIR,
    plugins: [qwikCity(), qwikVite(), tailwindcss()],
    server: {
      port: 3000,
      strictPort: true,
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    ssr: {
      noExternal: ['@elysia/eden'],
    },
  };
});
