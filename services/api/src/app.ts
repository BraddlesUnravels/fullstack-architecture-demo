import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { Elysia, t } from 'elysia';
import type { ApiEnv } from './config/env';
import { healthRoutes } from './routes/health';

const notFoundResponseSchema = t.Object({
  message: t.String(),
});

type CreateAppOptions = {
  corsOrigin: ApiEnv['corsOrigin'];
};

export const createApp = ({ corsOrigin }: CreateAppOptions) =>
  new Elysia({ name: 'job-application-tracker-api' })
    .use(
      cors({
        origin: corsOrigin,
      }),
    )
    .use(
      swagger({
        path: '/docs',
        documentation: {
          info: {
            title: 'Job Application Tracker API',
            version: '0.1.0',
          },
        },
      }),
    )
    .get('/', () => ({
      name: 'job-application-tracker-api',
      status: 'ok',
    }))
    .use(healthRoutes)
    .all(
      '*',
      ({ path, set }) => {
        set.status = 404;

        return {
          message: `Route not found: ${path}`,
        };
      },
      {
        response: notFoundResponseSchema,
      },
    );
