import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { Elysia } from 'elysia';
import type { ApiEnv } from './constants';
import { apiErrorResponseSchema } from '@app/schemas/typebox';
import { observabilityPlugin } from './plugins/observability.plugin';
import { errorHandlerPlugin } from './plugins/error-handler.plugin';
import { healthRoutes } from './modules/health';
import { users } from './modules/user';
import { auth } from './modules/auth';

type CreateAppOptions = {
  corsOrigin: ApiEnv['corsOrigin'];
};

export const createApp = ({ corsOrigin }: CreateAppOptions) =>
  new Elysia({ name: 'job-application-tracker-api' })
    .use(observabilityPlugin)
    .use(errorHandlerPlugin)
    .use(cors({ origin: corsOrigin }))
    .use(swagger({ path: '/docs' }))
    .use(auth)
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
