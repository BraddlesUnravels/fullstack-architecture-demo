import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { Elysia } from 'elysia';
import type { ApiEnv } from './config';
import { apiErrorResponseSchema } from './errors';
import { observabilityPlugin } from './plugins/observability.plugin';
import { healthRoutes } from './modules/health';
import { users } from './modules/user';
import { errorHandlerPlugin } from './plugins/error-handler.plugin';

type CreateAppOptions = {
  corsOrigin: ApiEnv['corsOrigin'];
};

export const createApp = ({ corsOrigin }: CreateAppOptions) =>
  new Elysia({ name: 'job-application-tracker-api' })
    .use(observabilityPlugin)
    .use(errorHandlerPlugin)
    .use(cors({ origin: corsOrigin }))
    .use(swagger({ path: '/docs' }))
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
