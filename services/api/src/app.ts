import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { Elysia } from 'elysia';
import type { ApiEnv } from './config';
import { apiErrorResponseSchema } from './errors';
import { errorHandler } from './errors/global-handler';
import { healthRoutes } from './modules/health';
import { users } from './modules/user';

type CreateAppOptions = {
  corsOrigin: ApiEnv['corsOrigin'];
};

export const createApp = ({ corsOrigin }: CreateAppOptions) =>
  new Elysia({ name: 'job-application-tracker-api' })
    .use(errorHandler)
    .use(cors({ origin: corsOrigin }))
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
    .use(users)
    .use(healthRoutes)
    .all(
      '*',
      ({ path, status }) =>
        status(404, {
          code: 'ROUTE_NOT_FOUND',
          message: `Route not found: ${path}`,
        }),
      {
        response: {
          404: apiErrorResponseSchema,
        },
      },
    );
