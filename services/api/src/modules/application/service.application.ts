import { applicationRepo } from '@app/db';
import type { ApplicationRow, UpdateApplicationRow } from '@app/db/types';
import type { ApplicationSelect, ApplicationInsert, DeleteResponse } from '@app/types';
import { serializeAuditDates } from '../../utils';
import {
  ApplicationCreateFailedError,
  ApplicationNotFoundError,
  ApplicationUpdateFailedError,
  ApplicationDeleteFailedError,
} from './errors.application';

const findUserApplicationById = async (
  userId: ApplicationRow['userId'],
  id: ApplicationRow['id'],
): Promise<ApplicationSelect> => {
  const [application] = await applicationRepo.findApplicationById(id);

  if (!application || application.isDeleted || application.userId !== userId)
    throw new ApplicationNotFoundError();

  return serializeAuditDates(application);
};

const findUserApplicationByUserId = async (
  userId: ApplicationRow['userId'],
  id: ApplicationRow['id'],
): Promise<ApplicationSelect> => {
  const applications = await applicationRepo.findApplicationByUserId(userId);

  const application = applications.find((app) => app.id === id);

  if (!application || application.isDeleted || application.userId !== userId)
    throw new ApplicationNotFoundError(
      'Application is already deleted or does not belong to the user',
    );

  return serializeAuditDates(application);
};

const findAllUserApplications = async (
  userId: ApplicationRow['userId'],
): Promise<ApplicationSelect[]> => {
  const applications = await applicationRepo.findApplicationByUserId(userId);
  return applications.filter((application) => !application.isDeleted).map(serializeAuditDates);
};

const createUserApplication = async (
  userId: ApplicationRow['userId'],
  data: ApplicationInsert,
): Promise<ApplicationSelect> => {
  const [application] = await applicationRepo.createApplication({ ...data, userId });

  if (!application) throw new ApplicationCreateFailedError();

  return serializeAuditDates(application);
};

const updateUserApplication = async (
  userId: ApplicationRow['userId'],
  id: ApplicationRow['id'],
  data: UpdateApplicationRow,
): Promise<ApplicationSelect> => {
  const [existingApplication] = await applicationRepo.findApplicationById(id);

  if (
    !existingApplication ||
    existingApplication.isDeleted ||
    existingApplication.userId !== userId
  )
    throw new ApplicationUpdateFailedError(
      'Application is already deleted or does not belong to the user',
    );

  const [application] = await applicationRepo.updateApplication(id, data);

  if (!application || application.isDeleted) throw new ApplicationUpdateFailedError();

  return serializeAuditDates(application);
};

const deleteApplicationForUser = async (
  userId: ApplicationRow['userId'],
  id: ApplicationRow['id'],
): Promise<DeleteResponse> => {
  const [application] = await applicationRepo.findApplicationByUserId(id);

  if (!application || application.isDeleted || application.userId !== userId)
    throw new ApplicationDeleteFailedError(
      'Application is already deleted or does not belong to the user',
    );

  return await applicationRepo.deleteApplication(id);
};

export const applicationService = {
  findUserApplicationById,
  findUserApplicationByUserId,
  findAllUserApplications,
  createUserApplication,
  updateUserApplication,
  deleteApplicationForUser,
};
