import { applicationRepo } from '@app/db';
import type { ApplicationRow } from '@app/db/types';
import type {
  ApplicationResponse,
  ApplicationSummaryList,
  CreateApplicationInput,
  DeleteResponse,
  UpdateApplicationInput,
} from '@app/types';
import {
  toApplicationResponse,
  toApplicationSummary,
  toInsertApplicationRow,
  toUpdateApplicationRow,
} from './mappers.application';
import {
  ApplicationCreateFailedError,
  ApplicationDeleteFailedError,
  ApplicationNotFoundError,
  ApplicationUpdateFailedError,
} from './errors.application';

const findUserApplicationById = async (
  userId: ApplicationRow['userId'],
  id: ApplicationRow['id'],
): Promise<ApplicationResponse> => {
  const [application] = await applicationRepo.findApplicationById(id);

  if (!application || application.isDeleted || application.userId !== userId)
    throw new ApplicationNotFoundError();

  return toApplicationResponse(application);
};

const findAllUserApplications = async (
  userId: ApplicationRow['userId'],
): Promise<ApplicationSummaryList> => {
  const applications =
    await applicationRepo.listAllApplicationSummaryByUserId(userId);

  return applications.map(toApplicationSummary);
};

const createUserApplication = async (
  userId: ApplicationRow['userId'],
  input: CreateApplicationInput,
): Promise<ApplicationResponse> => {
  const insertRow = toInsertApplicationRow(userId, input);

  const [application] = await applicationRepo.createApplication(insertRow);

  if (!application) throw new ApplicationCreateFailedError();

  return toApplicationResponse(application);
};

const updateUserApplication = async (
  userId: ApplicationRow['userId'],
  id: ApplicationRow['id'],
  input: UpdateApplicationInput,
): Promise<ApplicationResponse> => {
  const [existingApplication] = await applicationRepo.findApplicationById(id);

  if (
    !existingApplication ||
    existingApplication.isDeleted ||
    existingApplication.userId !== userId
  )
    throw new ApplicationUpdateFailedError(
      'Application is already deleted or does not belong to the user',
    );

  const update = toUpdateApplicationRow(input);
  const [application] = await applicationRepo.updateApplication(id, update);

  if (!application || application.isDeleted)
    throw new ApplicationUpdateFailedError();

  return toApplicationResponse(application);
};

const deleteApplicationForUser = async (
  userId: ApplicationRow['userId'],
  id: ApplicationRow['id'],
): Promise<DeleteResponse> => {
  const [application] = await applicationRepo.findApplicationById(id);

  if (!application || application.isDeleted || application.userId !== userId)
    throw new ApplicationDeleteFailedError(
      'Application is already deleted or does not belong to the user',
    );

  return await applicationRepo.deleteApplication(id);
};

export const applicationService = {
  findUserApplicationById,
  findAllUserApplications,
  createUserApplication,
  updateUserApplication,
  deleteApplicationForUser,
};
