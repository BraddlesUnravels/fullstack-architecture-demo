import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { Elysia } from 'elysia';
import type { ApiEnv } from './config';
import { ApiError, apiErrorResponseSchema } from './errors';
import { healthRoutes } from './modules/health';
import { users } from './modules/user';

type CreateAppOptions = {
  corsOrigin: ApiEnv['corsOrigin'];
};

export const createApp = ({ corsOrigin }: CreateAppOptions) =>
  new Elysia({ name: 'job-application-tracker-api' })
    .error({
      APP_ERROR: ApiError,
    })
    .onError(({ code, error, status }) => {
      if (error instanceof ApiError) {
        return status(error.status, error.toResponse());
      }

      if (code === 'VALIDATION') {
        return status(422, {
          code: 'VALIDATION_ERROR',
          message: error.message,
        });
      }

      return status(500, {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Unexpected server error',
      });
    })
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
