import type {
  ApplicationResultRow,
  ApplicationRow,
  ApplicationSummaryRow,
  InsertApplicationRow,
  UpdateApplicationRow,
} from '@app/db/types';
import type {
  ApplicationResponse,
  ApplicationSummary,
  CreateApplicationInput,
  UpdateApplicationInput,
} from '@app/types';

export const toInsertApplicationRow = (
  userId: ApplicationRow['userId'],
  input: CreateApplicationInput,
): InsertApplicationRow => ({
  userId,
  companyId: input.companyId,
  role: input.role,
  status: input.status,
  url: input.url,
  notes: input.notes,
});

export const toUpdateApplicationRow = (
  input: UpdateApplicationInput,
): UpdateApplicationRow => {
  const update: UpdateApplicationRow = {};

  if (input.companyId !== undefined) {
    update.companyId = input.companyId;
  }

  if (input.role !== undefined) {
    update.role = input.role;
  }

  if (input.status !== undefined) {
    update.status = input.status;
  }

  if (input.url !== undefined) {
    update.url = input.url;
  }

  if (input.notes !== undefined) {
    update.notes = input.notes;
  }

  return update;
};

export const toApplicationResponse = (
  row: ApplicationResultRow,
): ApplicationResponse => ({
  id: row.id,
  companyId: row.companyId,
  role: row.role,
  status: row.status,
  url: row.url,
  notes: row.notes,

  createdAt: row.createdAt.toISOString(),
  createdBy: row.createdBy,

  updatedAt: row.updatedAt.toISOString(),
  updatedBy: row.updatedBy,

  isDeleted: row.isDeleted,

  deletedAt: row.deletedAt?.toISOString(),
  deletedBy: row.deletedBy,

  version: row.version,
});

export const toApplicationSummary = (
  row: ApplicationSummaryRow,
): ApplicationSummary => ({
  id: row.id,
  role: row.role,
  status: row.status,
  notes: row.notes,
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt.toISOString(),
  company: {
    name: row.company.name,
    website: row.company.website,
    jobDescription: row.company.jobDescription,
    abn: row.company.abn,
  },
});
