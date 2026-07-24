import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createUserRow } from '../../helpers/factories';
import { userService } from '../../../src/modules/user/service.user';

const { userRepoMock } = vi.hoisted(() => ({
  userRepoMock: {
    createUser: vi.fn(),
    deleteUser: vi.fn(),
    findUserByEmail: vi.fn(),
    findUserById: vi.fn(),
    updateUser: vi.fn(),
  },
}));

vi.mock('@app/db', () => ({
  userRepo: userRepoMock,
}));

describe('modules/user/service.user', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('findUserByEmail', () => {
    it('should return serialized user when user exists and is active', async () => {
      const user = createUserRow();

      userRepoMock.findUserByEmail.mockResolvedValue([user]);

      const result = await userService.findUserByEmail({
        email: user.email,
      });

      expect(result.id).toBe(user.id);
      expect(result.createdAt).toBe(user.createdAt.toISOString());
      expect(result.updatedAt).toBe(user.updatedAt.toISOString());
    });

    it('should throw an error when no active user exists for the email', async () => {
      userRepoMock.findUserByEmail.mockResolvedValue([]);
      await expect(
        userService.findUserByEmail({
          email: 'missing@example.com',
        }),
      ).rejects.toThrow('No user exists with the provided email');
    });
  });

  describe('findUserById', () => {
    it('should throw an error when user is soft deleted', async () => {
      userRepoMock.findUserById.mockResolvedValue([
        createUserRow({ isDeleted: true }),
      ]);

      await expect(
        userService.findUserById({
          id: '6f4eff7c-6e9f-4223-a52f-4d45ecf95e51',
        }),
      ).rejects.toThrow('No active user exists with the provided id');
    });
  });

  describe('createUser', () => {
    it('should create and return a serialized user when email is available', async () => {
      const now = new Date('2026-01-01T11:00:00.000Z');
      const createdUser = createUserRow({
        createdAt: now,
        email: 'new-user@example.com',
        lastLoginAt: now,
      });

      userRepoMock.findUserByEmail.mockResolvedValue([]);
      userRepoMock.createUser.mockResolvedValue([createdUser]);

      const result = await userService.createUser({
        email: 'new-user@example.com',
        firstName: 'New',
        isLocked: false,
        lastLoginAt: '2026-01-01T11:00:00.000Z',
        lastName: 'User',
        tier: 'free',
      });

      expect(userRepoMock.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'new-user@example.com',
          lastLoginAt: expect.any(Date),
        }),
      );
      expect(result.id).toBe(createdUser.id);
      expect(result.lastLoginAt).toBe(now.toISOString());
    });

    it('should throw an error when email already belongs to another account', async () => {
      userRepoMock.findUserByEmail.mockResolvedValue([createUserRow()]);

      await expect(
        userService.createUser({
          email: 'existing@example.com',
          firstName: 'Existing',
          isLocked: false,
          lastName: 'User',
          tier: 'free',
        }),
      ).rejects.toThrow('The email provided belongs to an existing account');
    });
  });

  describe('updateUser', () => {
    it('should throw an error when update cannot find a user', async () => {
      userRepoMock.updateUser.mockResolvedValue([]);

      await expect(
        userService.updateUser('6f4eff7c-6e9f-4223-a52f-4d45ecf95e51', {
          firstName: 'Updated',
        }),
      ).rejects.toThrow('Failed to update user');
    });
  });

  describe('deleteUser', () => {
    it('should throw an error when delete operation fails', async () => {
      userRepoMock.deleteUser.mockResolvedValue({ success: false });

      await expect(
        userService.deleteUser('6f4eff7c-6e9f-4223-a52f-4d45ecf95e51'),
      ).rejects.toThrow('Failed to delete user');
    });
  });
});
