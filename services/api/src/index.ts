import { createApp } from './app';
import { apiEnv } from './config/env';

const app = createApp({ corsOrigin: apiEnv.corsOrigin });

app.listen({
  hostname: apiEnv.host,
  port: apiEnv.port,
});

console.log(
  `[api] Listening on http://${apiEnv.host}:${apiEnv.port} (docs at /docs, health at /health)`,
);