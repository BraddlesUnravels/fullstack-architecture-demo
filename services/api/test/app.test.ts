import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ApplicationSummary } from '@app/types';
import { createApp } from '../src/app';
import {
  createApplicationRow,
  createCredentialRow,
  createSessionRecord,
  createUserRow,
} from './helpers/factories';
import { UserTier } from '@app/constants';

const {
  applicationRepoMock,
  consumePendingRegistrationMock,
  createPendingRegistrationMock,
  createSessionMock,
  createSessionTokenMock,
  credentialRepoMock,
  deleteSessionMock,
  emailServiceMock,
  hashNewPasswordMock,
  hashSessionTokenMock,
  isPasswordMatchMock,
  readPendingRegistrationMock,
  readSessionMock,
  setSessionCookieMock,
  userRepoMock,
} = vi.hoisted(() => ({
  applicationRepoMock: {
    createApplication: vi.fn(),
    findApplicationById: vi.fn(),
    findApplicationByUserId: vi.fn(),
    listAllApplicationSummaryByUserId: vi.fn(),
    updateApplication: vi.fn(),
  },
  consumePendingRegistrationMock: vi.fn(),
  createPendingRegistrationMock: vi.fn(),
  createSessionMock: vi.fn(),
  createSessionTokenMock: vi.fn(),
  credentialRepoMock: {
    createCredential: vi.fn(),
    findCredentialByUserId: vi.fn(),
  },
  deleteSessionMock: vi.fn(),
  emailServiceMock: {
    sendAccountCreated: vi.fn(),
    sendConfirmEmail: vi.fn(),
  },
  hashNewPasswordMock: vi.fn(),
  hashSessionTokenMock: vi.fn(),
  isPasswordMatchMock: vi.fn(),
  readPendingRegistrationMock: vi.fn(),
  readSessionMock: vi.fn(),
  setSessionCookieMock: vi.fn(),
  userRepoMock: {
    createUser: vi.fn(),
    findUserByEmail: vi.fn(),
    findUserById: vi.fn(),
    updateUser: vi.fn(),
  },
}));

vi.mock('@app/db', () => ({
  applicationRepo: applicationRepoMock,
  credentialRepo: credentialRepoMock,
  userRepo: userRepoMock,
}));

vi.mock('@app/redis', () => ({
  consumePendingRegistration: consumePendingRegistrationMock,
  createPendingRegistration: createPendingRegistrationMock,
  createSession: createSessionMock,
  deleteSession: deleteSessionMock,
  readPendingRegistration: readPendingRegistrationMock,
  readSession: readSessionMock,
}));

vi.mock('../src/services', () => ({
  createSessionToken: createSessionTokenMock,
  emailService: emailServiceMock,
  hashNewPassword: hashNewPasswordMock,
  hashSessionToken: hashSessionTokenMock,
  isPasswordMatch: isPasswordMatchMock,
  setSessionCookie: setSessionCookieMock,
}));

const createRequest = (path: string, init?: RequestInit): Request =>
  new Request(`http://localhost${path}`, init);

const parseBody = async <T>(response: Response): Promise<T> =>
  (await response.json()) as T;

describe('app', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return health payload from GET /health/', async () => {
    const app = createApp({ corsOrigin: true });

    const response = await app.handle(createRequest('/health/'));
    const body = await parseBody<{
      service: string;
      status: string;
      timestamp: string;
    }>(response);

    expect(response.status).toBe(200);
    expect(body.service).toBe('job-application-tracker-api');
    expect(body.status).toBe('ok');
    expect(typeof body.timestamp).toBe('string');
  });

  it('should return fallback 404 payload for unknown routes', async () => {
    const app = createApp({ corsOrigin: true });

    const response = await app.handle(createRequest('/missing-route'));
    const body = await parseBody<{ code: string; message: string }>(response);

    expect(response.status).toBe(404);
    expect(body).toEqual({
      code: 'ROUTE_NOT_FOUND',
      message: 'Route not found: /missing-route',
    });
  });

  it('should return registration payload from POST /auth/register', async () => {
    const app = createApp({ corsOrigin: true });

    userRepoMock.findUserByEmail.mockResolvedValue([]);
    createPendingRegistrationMock.mockResolvedValue(undefined);
    emailServiceMock.sendConfirmEmail.mockResolvedValue(undefined);

    const response = await app.handle(
      createRequest('/auth/', {
        body: JSON.stringify({
          email: 'new-user@example.com',
        }),
        headers: {
          'content-type': 'application/json',
        },
        method: 'PUT',
      }),
    );
    const body = await parseBody<{ id: string }>(response);

    expect(response.status).toBe(200);
    expect(body).toEqual({
      email: 'new-user@example.com',
      message:
        'Registration started. Please check your email to verify your account.',
    });
  });

  it('should return unauthorized response for protected user route without session cookie', async () => {
    const app = createApp({ corsOrigin: true });
    const user = createUserRow();

    const response = await app.handle(createRequest(`/users/${user.id}`));
    const body = await parseBody<{ code: string; message: string }>(response);

    expect(response.status).toBe(404);
    expect(body).toEqual({
      code: 'AUTH_SESSION_NOT_FOUND',
      message: 'Session not found',
    });
  });

  it('should return protected user payload with a valid session cookie', async () => {
    const app = createApp({ corsOrigin: true });
    const user = createUserRow();

    hashSessionTokenMock.mockReturnValue('hashed-session-token');
    readSessionMock.mockResolvedValue(
      createSessionRecord({
        userId: user.id,
      }),
    );
    userRepoMock.findUserById.mockResolvedValue([user]);

    const response = await app.handle(
      createRequest(`/users/${user.id}`, {
        headers: {
          cookie: 'sid=raw-session-token',
        },
      }),
    );
    const body = await parseBody<{ id: string }>(response);

    expect(response.status).toBe(200);
    expect(body.id).toBe(user.id);
  });

  it('should return protected application list when session cookie is valid', async () => {
    const app = createApp({ corsOrigin: true });
    const user = createUserRow();
    const application = createApplicationRow({
      userId: user.id,
    });

    hashSessionTokenMock.mockReturnValue('hashed-session-token');
    readSessionMock.mockResolvedValue(
      createSessionRecord({
        userId: user.id,
        createdAt: new Date().toISOString(),
        lastSeenAt: new Date().toISOString(),
        tier: UserTier.FREE,
      }),
    );
    applicationRepoMock.listAllApplicationSummaryByUserId.mockResolvedValue([
      {
        company: {
          abn: undefined,
          jobDescription: 'Platform role',
          name: 'Acme',
          website: undefined,
        },
        createdAt: application.createdAt,
        id: application.id,
        notes: application.notes,
        role: application.role,
        status: application.status,
        updatedAt: application.updatedAt,
      },
    ]);

    const response = await app.handle(
      createRequest('/applications/', {
        headers: {
          cookie: 'sid=raw-session-token',
        },
      }),
    );
    const body = await parseBody<ApplicationSummary[]>(response);

    expect(response.status).toBe(200);
    expect(body).toHaveLength(1);
    expect(body[0]?.id).toBe(application.id);
  });

  it('should return login payload from POST /auth/', async () => {
    const app = createApp({ corsOrigin: true });
    const user = createUserRow();
    const credentials = createCredentialRow({
      userId: user.id,
    });

    userRepoMock.findUserByEmail.mockResolvedValue([user]);
    credentialRepoMock.findCredentialByUserId.mockResolvedValue([credentials]);
    isPasswordMatchMock.mockResolvedValue(true);
    createSessionTokenMock.mockReturnValue('raw-session-token');
    hashSessionTokenMock.mockReturnValue('hashed-session-token');
    createSessionMock.mockResolvedValue(undefined);

    const response = await app.handle(
      createRequest('/auth/', {
        body: JSON.stringify({
          email: user.email,
          password: 'password-1234',
        }),
        headers: {
          'content-type': 'application/json',
        },
        method: 'POST',
      }),
    );
    const body = await parseBody<{
      success: boolean;
      token: string;
      exp: Date | string;
    }>(response);

    expect(response.status).toBe(200);
    expect(setSessionCookieMock).toHaveBeenCalledTimes(1);
    expect(body.success).toBe(true);
    expect(body.token).toString();
    expect(body.exp).toBeTruthy();
  });
});
