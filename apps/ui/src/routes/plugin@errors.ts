import { randomUUID } from 'crypto';
import { isDev } from '@builder.io/qwik/build';
import type { RequestHandler } from '@builder.io/qwik-city';
import {
  RedirectMessage,
  ServerError,
} from '@builder.io/qwik-city/middleware/request-handler';
import { ErrorDefaults } from '@app/types';
import { serverLogger } from '../lib/logger';

export const onRequest: RequestHandler = async (event) => {
  const requestId = randomUUID();

  const logger = serverLogger.child({
    requestId,
    method: event.request.method,
    pathname: event.url.pathname,
    component: 'plugin@errors',
    errror: {},
  });

  try {
    return await event.next();
  } catch (error: unknown) {
    if (error instanceof RedirectMessage) {
      throw error;
    }

    if (error instanceof ServerError) {
      throw error;
    }

    logger.error(error, 'Unhandled Qwik server error');

    if (isDev) {
      throw error;
    }

    const fallback = ErrorDefaults[500];

    throw new ServerError(fallback.status, {
      code: fallback.code,
      message: fallback.message,
      requestId,
    });
  }
};
