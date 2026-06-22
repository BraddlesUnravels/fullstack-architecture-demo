import { Elysia } from 'elysia';
import type { Context } from 'elysia';
import { ApiError } from '../errors';
import type { Logger } from 'pino';
import { baseLogger } from '../utils/logger';

type ErrorParams = {
  code: string | number;
  error: unknown;
  status: Context['status'];
  logger?: Logger;
};

const errorHandle = ({ code, error, status, logger }: ErrorParams) => {
  const isError = error instanceof Error;
  const isApiError = error instanceof ApiError;

  const log = logger ?? baseLogger;

  if (isApiError && isError) {
    log.warn({ code, status: error.status }, error.message);
    return status(error.status, error.toResponse());
  }

  if (code === 'VALIDATION') {
    log.warn({ code, error: isError ? error.message : error }, 'Validation error occurred');
    return status(422, {
      code: 'VALIDATION_ERROR',
      message: isError ? error.message : 'Validation error',
    });
  }

  log.error(
    {
      code,
      error: isError ? error.stack : error,
    },
    `Unknown error occurred`,
  );

  return status(500, {
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred.',
  });
};

export const errorHandlerPlugin = new Elysia({ name: 'error-handler' })
  .error({ API_ERROR: ApiError })
  .onError({ as: 'scoped' }, errorHandle);
