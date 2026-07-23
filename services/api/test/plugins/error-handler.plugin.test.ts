import { Elysia, t } from 'elysia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '../../src/errors';
import { errorHandlerPlugin } from '../../src/plugins/error-handler.plugin';

const createRequest = (path: string, init?: RequestInit): Request =>
  new Request(`http://localhost${path}`, init);

describe('plugins/error-handler.plugin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return ApiError status and response payload for known API errors', async () => {
    const app = new Elysia().use(errorHandlerPlugin).get('/api-error', () => {
      throw new ApiError({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
        status: 404,
      });
    });

    const response = await app.handle(createRequest('/api-error'));
    const body = (await response.json()) as { code: string; message: string };

    expect(response.status).toBe(404);
    expect(body).toEqual({
      code: 'USER_NOT_FOUND',
      message: 'User not found',
    });
  });

  it('should map validation failures to a 422 response', async () => {
    const app = new Elysia()
      .use(errorHandlerPlugin)
      .post('/validation', ({ body }) => body, {
        body: t.Object({
          id: t.Number(),
        }),
      });

    const response = await app.handle(
      createRequest('/validation', {
        body: JSON.stringify({ id: 'not-a-number' }),
        headers: {
          'content-type': 'application/json',
        },
        method: 'POST',
      }),
    );
    const body = (await response.json()) as { code: string; message: string };

    expect(response.status).toBe(422);
    expect(body.code).toBe('VALIDATION_ERROR');
    expect(body.message.length).toBeGreaterThan(0);
  });

  it('should map unknown errors to a 500 response payload', async () => {
    const app = new Elysia()
      .use(errorHandlerPlugin)
      .get('/unknown-error', () => {
        throw new Error('Boom');
      });

    const response = await app.handle(createRequest('/unknown-error'));
    const body = (await response.json()) as { code: string; message: string };

    expect(response.status).toBe(500);
    expect(body).toEqual({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred.',
    });
  });
});
