import { isDev } from '@builder.io/qwik/build';
import type { RequestHandler } from '@builder.io/qwik-city';
import {
  RedirectMessage,
  ServerError,
} from '@builder.io/qwik-city/middleware/request-handler';

type InternalServerError = {
  code: 'INTERNAL_SERVER_ERROR';
  message: string;
  requestId: string;
};

export const onRequest: RequestHandler = async (event) => {
  const requestId =
    event.request.headers.get('x-request-id') ?? crypto.randomUUID();

  try {
    return await event.next();
  } catch (error: unknown) {
    /*
     * Redirects are implemented through thrown RedirectMessage objects.
     * They are control flow rather than application errors.
     */
    if (error instanceof RedirectMessage) {
      throw error;
    }

    /*
     * Preserve errors deliberately created with:
     *
     * throw event.error(...)
     * throw new ServerError(...)
     */
    if (error instanceof ServerError) {
      throw error;
    }

    /*
     * Log the original error on the server.
     * Do not send this information to the browser in production.
     */
    console.error(
      {
        requestId,
        method: event.request.method,
        pathname: event.url.pathname,
      },
      error,
    );

    /*
     * Preserve the full error during development so Qwik's development
     * error output remains useful.
     */
    if (isDev) {
      throw error;
    }

    const response: InternalServerError = {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred. Please try again.',
      requestId,
    };

    throw new ServerError(500, response);
  }
};
