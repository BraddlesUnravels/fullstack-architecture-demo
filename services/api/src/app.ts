import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { Elysia } from 'elysia';
import type { ApiEnv } from './config';
import { apiErrorResponseSchema } from '@app/schemas';
import { observabilityPlugin } from './plugins/observability.plugin';
import { errorHandlerPlugin } from './plugins/error-handler.plugin';
import { auth } from './modules/auth';
import { users } from './modules/user';
// import { applications } from './modules/application';
import { healthRoutes } from './modules/health';

type CreateAppOptions = {
  corsOrigin: ApiEnv['corsOrigin'];
};

export const createApp = ({ corsOrigin }: CreateAppOptions) =>
  new Elysia({ name: 'job-application-tracker-api' })
    .use(observabilityPlugin)
    .use(errorHandlerPlugin)
    .use(cors({ origin: corsOrigin }))
    .use(swagger({ path: '/docs' }))

    // Public routes
    .use(auth)
    .use(healthRoutes)

    // Protected routes
    .use(users)
    // .use(applications)

    // Public fallback route for 404
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
