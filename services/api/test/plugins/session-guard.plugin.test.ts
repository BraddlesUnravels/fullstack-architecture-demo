import { Elysia } from 'elysia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createSessionRecord } from '../helpers/factories';
import { sessionGuard } from '../../src/plugins/session-guard.plugin';

const { readSessionMock } = vi.hoisted(() => ({
  readSessionMock: vi.fn(),
}));

vi.mock('@app/redis', () => ({
  readSession: readSessionMock,
}));

const createRequest = (cookieHeader?: string) =>
  new Request('http://localhost/protected', {
    headers: cookieHeader
      ? {
          cookie: cookieHeader,
        }
      : undefined,
  });

const createProtectedApp = () =>
  new Elysia().use(sessionGuard).get('/protected', ({ session }) => ({
    success: true,
    userId: session.userId,
  }));

describe('plugins/session-guard.plugin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return session not found when cookie is missing', async () => {
    const app = createProtectedApp();

    const response = await app.handle(createRequest());
    const body = (await response.json()) as { code: string; message: string };

    expect(response.status).toBe(404);
    expect(body).toEqual({
      code: 'AUTH_SESSION_NOT_FOUND',
      message: 'Session not found',
    });
  });

  it('should return session expired when redis record is missing', async () => {
    const app = createProtectedApp();

    readSessionMock.mockResolvedValue(undefined);

    const response = await app.handle(createRequest('sid=valid-token'));
    const body = (await response.json()) as { code: string; message: string };

    expect(response.status).toBe(401);
    expect(body).toEqual({
      code: 'AUTH_SESSION_EXPIRED',
      message: 'Session has expired',
    });
  });

  it('should return session expired when inactivity timeout is exceeded', async () => {
    const app = createProtectedApp();
    const fiveHoursAgo = Date.now() - 5 * 60 * 60 * 1000;

    readSessionMock.mockResolvedValue(
      createSessionRecord({
        lastSeenAt: String(fiveHoursAgo),
      }),
    );

    const response = await app.handle(createRequest('sid=valid-token'));
    const body = (await response.json()) as { code: string; message: string };

    expect(response.status).toBe(401);
    expect(body).toEqual({
      code: 'AUTH_SESSION_EXPIRED',
      message: 'Session has expired',
    });
  });

  it('should allow request when session exists and is active', async () => {
    const app = createProtectedApp();
    const activeLastSeen = Date.now() - 30 * 60 * 1000;

    readSessionMock.mockResolvedValue(
      createSessionRecord({
        lastSeenAt: String(activeLastSeen),
      }),
    );

    const response = await app.handle(createRequest('sid=valid-token'));
    const body = (await response.json()) as { success: boolean; userId: string };

    expect(response.status).toBe(200);
    expect(body).toEqual({
      success: true,
      userId: '6f4eff7c-6e9f-4223-a52f-4d45ecf95e51',
    });
  });
});
