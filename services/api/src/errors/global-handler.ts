import { Elysia } from 'elysia';
import { ApiError } from '../errors';

export const errorHandler = new Elysia({ name: 'error-handler' })
  .error({
    API_ERROR: ApiError,
  })
  .onError(({ code, error, status }) => {
    if (error instanceof ApiError) {
      error.log();
      return status(error.status, error.toResponse());
    }

    if (code === 'VALIDATION')
      return status(422, {
        code: 'VALIDATION_ERROR',
        message: error.message,
      });

    console.error(`\n\t[Unknown Error] ${String(error)} (code: ${code}, status: ${status})\n`);
    console.error(JSON.stringify(error, null, 2));

    return status(500, {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred.',
    });
  });
