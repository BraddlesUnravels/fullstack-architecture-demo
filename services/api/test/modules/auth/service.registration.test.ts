import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createUserRow } from '../../helpers/factories';
import { registrationService } from '../../../src/modules/auth/service.registration';

const {
  consumePendingRegistrationMock,
  createPendingRegistrationMock,
  credentialRepoMock,
  emailServiceMock,
  hashNewPasswordMock,
  readPendingRegistrationMock,
  userRepoMock,
} = vi.hoisted(() => ({
  consumePendingRegistrationMock: vi.fn(),
  createPendingRegistrationMock: vi.fn(),
  credentialRepoMock: {
    createCredential: vi.fn(),
  },
  emailServiceMock: {
    sendAccountCreated: vi.fn(),
    sendConfirmEmail: vi.fn(),
  },
  hashNewPasswordMock: vi.fn(),
  readPendingRegistrationMock: vi.fn(),
  userRepoMock: {
    createUser: vi.fn(),
    findUserByEmail: vi.fn(),
    findUserById: vi.fn(),
    updateUser: vi.fn(),
  },
}));

vi.mock('@app/db', () => ({
  credentialRepo: credentialRepoMock,
  userRepo: userRepoMock,
}));

vi.mock('@app/redis', () => ({
  consumePendingRegistration: consumePendingRegistrationMock,
  createPendingRegistration: createPendingRegistrationMock,
  readPendingRegistration: readPendingRegistrationMock,
}));

vi.mock('../../../src/services', () => ({
  emailService: emailServiceMock,
  hashNewPassword: hashNewPasswordMock,
}));

describe('modules/auth/service.registration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should create pending registration and send verification email for a new email', async () => {
      userRepoMock.findUserByEmail.mockResolvedValue([]);
      createPendingRegistrationMock.mockResolvedValue(undefined);
      emailServiceMock.sendConfirmEmail.mockResolvedValue(undefined);

      const result = await registrationService.register({
        email: 'new-user@example.com',
      });

      expect(createPendingRegistrationMock).toHaveBeenCalledWith(
        expect.any(String),
        'new-user@example.com',
        900,
      );
      expect(emailServiceMock.sendConfirmEmail).toHaveBeenCalledWith(
        'new-user@example.com',
        expect.stringContaining('/auth/'),
      );
      expect(result).toEqual({
        email: 'new-user@example.com',
        message:
          'Registration started. Please check your email to verify your account.',
      });
    });

    it('should throw an error when the email already belongs to an existing user', async () => {
      userRepoMock.findUserByEmail.mockResolvedValue([createUserRow()]);
      await expect(
        registrationService.register({
          email: 'existing@example.com',
        }),
      ).rejects.toThrow(
        'If this email can be registered, we’ll send a verification code.',
      );
    });
  });

  describe('verifyEmail', () => {
    it('should throw an error when registration record does not exist', async () => {
      readPendingRegistrationMock.mockResolvedValue(undefined);

      await expect(
        registrationService.verifyEmail({
          id: 'encoded-registration-id',
        }),
      ).rejects.toThrow('Registration link has expired');
    });

    it('should return existing user when registration email already has an account', async () => {
      const existingUser = createUserRow();

      readPendingRegistrationMock.mockResolvedValue({
        email: existingUser.email,
        registrationId: 'registration-id',
      });
      userRepoMock.findUserByEmail.mockResolvedValue([existingUser]);
      consumePendingRegistrationMock.mockResolvedValue(undefined);

      const result = await registrationService.verifyEmail({
        id: 'encoded-registration-id',
      });

      expect(consumePendingRegistrationMock).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        message: 'Email verified. Complete registration to continue.',
        success: true,
        userId: existingUser.id,
      });
    });

    it('should create a user when pending registration email has no account', async () => {
      const createdUser = createUserRow();

      readPendingRegistrationMock.mockResolvedValue({
        email: createdUser.email,
        registrationId: 'registration-id',
      });
      userRepoMock.findUserByEmail.mockResolvedValue([]);
      userRepoMock.createUser.mockResolvedValue([createdUser]);
      consumePendingRegistrationMock.mockResolvedValue(undefined);

      const result = await registrationService.verifyEmail({
        id: 'encoded-registration-id',
      });

      expect(consumePendingRegistrationMock).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        message: 'Email verified.',
        success: true,
        userId: createdUser.id,
      });
    });

    it('should throw an error when user creation fails during verification', async () => {
      readPendingRegistrationMock.mockResolvedValue({
        email: 'new-user@example.com',
        registrationId: 'registration-id',
      });
      userRepoMock.findUserByEmail.mockResolvedValue([]);
      userRepoMock.createUser.mockResolvedValue([]);

      await expect(
        registrationService.verifyEmail({
          id: 'encoded-registration-id',
        }),
      ).rejects.toThrow('Failed to create user');
    });
  });

  describe('completeRegistration', () => {
    const input = {
      confirmPassword: 'password-1234',
      firstName: 'Pat',
      lastName: 'Taylor',
      password: 'password-1234',
      userId: '6f4eff7c-6e9f-4223-a52f-4d45ecf95e51',
    };

    it('should throw an error when password and confirmation do not match', async () => {
      await expect(
        registrationService.completeRegistration({
          ...input,
          confirmPassword: 'different-password',
        }),
      ).rejects.toThrow('Password and confirm password do not match');
    });

    it('should throw an error when user cannot be found', async () => {
      userRepoMock.findUserById.mockResolvedValue([]);

      await expect(
        registrationService.completeRegistration(input),
      ).rejects.toThrow('No user exists for the verified registration');
    });

    it('should throw an error when user profile update fails', async () => {
      const user = createUserRow({ id: input.userId });

      userRepoMock.findUserById.mockResolvedValue([user]);
      userRepoMock.updateUser.mockResolvedValue([]);

      await expect(
        registrationService.completeRegistration(input),
      ).rejects.toThrow('Failed to complete registration');
    });

    it('should throw an error when credential creation fails', async () => {
      const user = createUserRow({ id: input.userId });
      const updatedUser = createUserRow({
        firstName: input.firstName,
        id: input.userId,
      });

      userRepoMock.findUserById.mockResolvedValue([user]);
      userRepoMock.updateUser.mockResolvedValue([updatedUser]);
      hashNewPasswordMock.mockResolvedValue('hashed-password');
      credentialRepoMock.createCredential.mockResolvedValue([]);

      await expect(
        registrationService.completeRegistration(input),
      ).rejects.toThrow('Failed to create user credentials');
    });

    it('should complete registration when user and credentials are updated', async () => {
      const user = createUserRow({ id: input.userId });
      const updatedUser = createUserRow({
        email: 'completed@example.com',
        firstName: input.firstName,
        id: input.userId,
      });

      userRepoMock.findUserById.mockResolvedValue([user]);
      userRepoMock.updateUser.mockResolvedValue([updatedUser]);
      hashNewPasswordMock.mockResolvedValue('hashed-password');
      credentialRepoMock.createCredential.mockResolvedValue([
        {
          hash: 'hashed-password',
          id: 'credential-id',
          userId: input.userId,
        },
      ]);
      emailServiceMock.sendAccountCreated.mockResolvedValue(undefined);

      const result = await registrationService.completeRegistration(input);
      const expectedAppLink =
        process.env.CORS_ORIGIN || 'http://localhost:5173';

      expect(hashNewPasswordMock).toHaveBeenCalledWith('password-1234');
      expect(credentialRepoMock.createCredential).toHaveBeenCalledWith({
        hash: 'hashed-password',
        userId: input.userId,
      });
      expect(emailServiceMock.sendAccountCreated).toHaveBeenCalledWith(
        'completed@example.com',
        'Pat',
        expectedAppLink,
      );
      expect(result).toEqual({
        message: 'Registration complete. You can now log in.',
        success: true,
      });
    });
  });
});
