import { Elysia } from 'elysia';
import { randomUUID } from 'node:crypto';
import { baseLogger } from '../utils/logger';

export const observabilityPlugin = new Elysia({ name: 'observability' })
  .decorate('baseLogger', baseLogger.child({ plugin: 'observability' }))
  .derive({ as: 'scoped' }, ({ request, headers, baseLogger }) => {
    const startedAt = performance.now();
    const requestId = headers['x-request-id'] ?? randomUUID();

    const logger = baseLogger.child({
      requestId,
      method: request.method,
      path: new URL(request.url).pathname,
    });

    logger.info('Request received');

    const path = new URL(request.url).pathname;

    return {
      requestId,
      logger,
      startedAt,
      path,
    };
  })
  .onAfterResponse({ as: 'scoped' }, ({ logger, set, startedAt }) => {
    const durationMs = Math.round(performance.now() - startedAt);
    logger.info(
      {
        res: {
          statusCode: set.status ?? 200,
        },
        durationMs,
      },
      'Request completed',
    );
  });
