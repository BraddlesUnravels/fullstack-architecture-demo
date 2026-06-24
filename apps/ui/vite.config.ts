import { fileURLToPath } from 'node:url';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig, loadEnv } from 'vite';
const ROOT_ENV_DIR = fileURLToPath(new URL('../..', import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ROOT_ENV_DIR, '');
  const apiUrl = env.API_URL || 'http://localhost:3000';
  return {
    envDir: ROOT_ENV_DIR,
    plugins: [qwikCity(), qwikVite(), tsconfigPaths()],
    server: {
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
