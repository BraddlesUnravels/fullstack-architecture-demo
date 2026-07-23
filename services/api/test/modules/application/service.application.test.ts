import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApplicationRow } from '../../helpers/factories';
import { applicationService } from '../../../src/modules/application/service.application';
import { JobStatus } from '@app/constants';

const { applicationRepoMock } = vi.hoisted(() => ({
  applicationRepoMock: {
    createApplication: vi.fn(),
    deleteApplication: vi.fn(),
    findApplicationById: vi.fn(),
    findApplicationByUserId: vi.fn(),
    listAllApplicationSummaryByUserId: vi.fn(),
    updateApplication: vi.fn(),
  },
}));

vi.mock('@app/db', () => ({
  applicationRepo: applicationRepoMock,
}));

describe('modules/application/service.application', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('findUserApplicationById', () => {
    it('should return serialized application when it belongs to the user', async () => {
      const application = createApplicationRow();

      applicationRepoMock.findApplicationById.mockResolvedValue([application]);

      const result = await applicationService.findUserApplicationById(
        application.userId,
        application.id,
      );

      expect(result.id).toBe(application.id);
      expect(result.createdAt).toBe(application.createdAt.toISOString());
    });

    it('should throw an error when application is missing', async () => {
      applicationRepoMock.findApplicationById.mockResolvedValue([]);
      await expect(
        applicationService.findUserApplicationById(
          '6f4eff7c-6e9f-4223-a52f-4d45ecf95e51',
          '7946a408-d63e-4ee7-b5db-46240c5c3213',
        ),
      ).rejects.toThrow('Application not found');
    });
  });

  describe('findAllUserApplications', () => {
    it('should return summaries from the repository', async () => {
      const application = createApplicationRow({ id: 'active-application-id' });

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

      const result = await applicationService.findAllUserApplications(
        application.userId,
      );

      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe('active-application-id');
    });

    it('should return an empty array when repository returns no applications', async () => {
      const userId = '6f4eff7c-6e9f-4223-a52f-4d45ecf95e51';

      applicationRepoMock.listAllApplicationSummaryByUserId.mockResolvedValue(
        [],
      );

      const result = await applicationService.findAllUserApplications(userId);

      expect(result).toEqual([]);
    });
  });

  describe('createUserApplication', () => {
    it('should throw an error when application creation fails', async () => {
      applicationRepoMock.createApplication.mockResolvedValue([]);

      await expect(
        applicationService.createUserApplication(
          '6f4eff7c-6e9f-4223-a52f-4d45ecf95e51',
          {
            companyId: 'f8c46e63-faee-4031-bd5f-4f91da4f3a5f',
            notes: 'Initial note',
            role: 'Software Engineer',
            status: JobStatus.ENTERED,
            url: 'https://example.com/jobs/1',
            userId: '6f4eff7c-6e9f-4223-a52f-4d45ecf95e51',
          },
        ),
      ).rejects.toThrow('Failed to create application');
    });
  });

  describe('updateUserApplication', () => {
    it('should throw an error when application does not belong to the user', async () => {
      const application = createApplicationRow({
        userId: 'other-user-id',
      });

      applicationRepoMock.findApplicationById.mockResolvedValue([application]);

      await expect(
        applicationService.updateUserApplication(
          '6f4eff7c-6e9f-4223-a52f-4d45ecf95e51',
          application.id,
          { notes: 'Updated note' },
        ),
      ).rejects.toThrow(
        'Application is already deleted or does not belong to the user',
      );
    });

    it('should return updated application when record belongs to the user', async () => {
      const existing = createApplicationRow();
      const updated = createApplicationRow({
        notes: 'Updated note',
        updatedAt: new Date('2026-01-01T12:00:00.000Z'),
      });

      applicationRepoMock.findApplicationById.mockResolvedValue([existing]);
      applicationRepoMock.updateApplication.mockResolvedValue([updated]);

      const result = await applicationService.updateUserApplication(
        existing.userId,
        existing.id,
        {
          notes: 'Updated note',
        },
      );

      expect(result.notes).toBe('Updated note');
      expect(result.updatedAt).toBe(updated.updatedAt.toISOString());
    });
  });

  describe('deleteApplicationForUser', () => {
    it('should throw an error when application is already deleted', async () => {
      const application = createApplicationRow({
        isDeleted: true,
      });

      applicationRepoMock.findApplicationById.mockResolvedValue([application]);

      await expect(
        applicationService.deleteApplicationForUser(
          application.userId,
          application.id,
        ),
      ).rejects.toThrow(
        'Application is already deleted or does not belong to the user',
      );
    });
  });
});
