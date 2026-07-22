import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createCredentialRow, createUserRow } from '../../helpers/factories';
import { authService } from '../../../src/modules/auth/service.auth';

const {
  credentialRepoMock,
  createSessionMock,
  createSessionTokenMock,
  deleteSessionMock,
  hashSessionTokenMock,
  isPasswordMatchMock,
  userRepoMock,
} = vi.hoisted(() => ({
  credentialRepoMock: {
    findCredentialByUserId: vi.fn(),
  },
  createSessionMock: vi.fn(),
  createSessionTokenMock: vi.fn(),
  deleteSessionMock: vi.fn(),
  hashSessionTokenMock: vi.fn(),
  isPasswordMatchMock: vi.fn(),
  userRepoMock: {
    findUserByEmail: vi.fn(),
  },
}));

vi.mock('@app/db', () => ({
  credentialRepo: credentialRepoMock,
  userRepo: userRepoMock,
}));

vi.mock('@app/redis', () => ({
  createSession: createSessionMock,
  deleteSession: deleteSessionMock,
}));

vi.mock('../../../src/services', () => ({
  createSessionToken: createSessionTokenMock,
  hashSessionToken: hashSessionTokenMock,
  isPasswordMatch: isPasswordMatchMock,
}));

describe('modules/auth/service.auth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should return session `success: true` token and cookie expiry user when credentials are valid', async () => {
      const user = createUserRow();
      const credentials = createCredentialRow({ userId: user.id });

      userRepoMock.findUserByEmail.mockResolvedValue([user]);
      credentialRepoMock.findCredentialByUserId.mockResolvedValue([
        credentials,
      ]);
      isPasswordMatchMock.mockResolvedValue(true);
      createSessionTokenMock.mockReturnValue('session-token');
      hashSessionTokenMock.mockReturnValue('hashed-session-token');
      createSessionMock.mockResolvedValue(undefined);

      const result = await authService.login({
        email: user.email,
        password: 'password-1234',
      });

      expect(createSessionMock).toHaveBeenCalledWith(
        'hashed-session-token',
        user.id,
        user.tier,
        28800,
      );
      expect(result.token).toBe('session-token');
      expect(result.exp).toBeTruthy();
      expect(result.success).toBe(true);
    });

    it('should throw an error when no user exists for the email', async () => {
      userRepoMock.findUserByEmail.mockResolvedValue([]);
      await expect(
        authService.login({
          email: 'missing@example.com',
          password: 'password-1234',
        }),
      ).rejects.toThrow('No user exists with the provided email');
    });

    it('should throw an error when user credentials are missing', async () => {
      const user = createUserRow();

      userRepoMock.findUserByEmail.mockResolvedValue([user]);
      credentialRepoMock.findCredentialByUserId.mockResolvedValue([]);

      await expect(
        authService.login({
          email: user.email,
          password: 'password-1234',
        }),
      ).rejects.toThrow(
        'No credentials set for the user with the provided email',
      );
    });

    it('should throw an error when password does not match', async () => {
      const user = createUserRow();
      const credentials = createCredentialRow({ userId: user.id });

      userRepoMock.findUserByEmail.mockResolvedValue([user]);
      credentialRepoMock.findCredentialByUserId.mockResolvedValue([
        credentials,
      ]);
      isPasswordMatchMock.mockResolvedValue(false);

      await expect(
        authService.login({
          email: user.email,
          password: 'wrong-password',
        }),
      ).rejects.toThrow('Invalid email or password');
    });
  });

  describe('logout', () => {
    it('should delete redis session and remove cookie when session token exists', async () => {
      const removeCookieMock = vi.fn();

      hashSessionTokenMock.mockReturnValue('hashed-session-token');
      deleteSessionMock.mockResolvedValue(true);

      const result = await authService.logout({
        sid: {
          remove: removeCookieMock,
          value: 'raw-session-token',
        },
      } as never);

      expect(hashSessionTokenMock).toHaveBeenCalledWith('raw-session-token');
      expect(deleteSessionMock).toHaveBeenCalledWith('hashed-session-token');
      expect(removeCookieMock).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ success: true });
    });

    it('should still remove cookie and return success when session token is missing', async () => {
      const removeCookieMock = vi.fn();

      const result = await authService.logout({
        sid: {
          remove: removeCookieMock,
          value: undefined,
        },
      } as never);

      expect(deleteSessionMock).not.toHaveBeenCalled();
      expect(removeCookieMock).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ success: true });
    });
  });
});
