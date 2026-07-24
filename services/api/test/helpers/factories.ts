import { JobStatus, UserTier } from '@app/constants';

type UserRowLike = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isLocked: boolean;
  tier: UserTier;
  lastLoginAt: Date;
  verifiedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  version: number;
};

type CredentialRowLike = {
  id: string;
  userId: string;
  hash: string;
  valid: boolean;
  createdAt: Date;
  invalidatedAt: Date | undefined;
};

type ApplicationRowLike = {
  id: string;
  userId: string;
  companyId: string;
  role: string;
  status: JobStatus;
  url: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  version: number;
};

type SessionRecordLike = {
  userId: string;
  tier: UserTier;
  createdAt: string;
  lastSeenAt: string;
};

export const createUserRow = (
  overrides: Partial<UserRowLike> = {},
): UserRowLike => {
  const now = new Date('2026-01-01T10:00:00.000Z');

  return {
    createdAt: now,
    email: 'person@example.com',
    firstName: 'Pat',
    id: '6f4eff7c-6e9f-4223-a52f-4d45ecf95e51',
    isDeleted: false,
    isLocked: false,
    lastLoginAt: now,
    lastName: 'Taylor',
    tier: UserTier.FREE,
    updatedAt: now,
    verifiedAt: now,
    version: 1,
    ...overrides,
  };
};

export const createCredentialRow = (
  overrides: Partial<CredentialRowLike> = {},
): CredentialRowLike => {
  const now = new Date('2026-01-01T10:00:00.000Z');

  return {
    createdAt: now,
    hash: 'stored-password-hash',
    id: '5d00473e-a0f4-48a9-9706-cdbe8a9f99de',
    invalidatedAt: undefined,
    userId: '6f4eff7c-6e9f-4223-a52f-4d45ecf95e51',
    valid: true,
    ...overrides,
  };
};

export const createApplicationRow = (
  overrides: Partial<ApplicationRowLike> = {},
): ApplicationRowLike => {
  const now = new Date('2026-01-01T10:00:00.000Z');

  return {
    companyId: 'f8c46e63-faee-4031-bd5f-4f91da4f3a5f',
    createdAt: now,
    id: '7946a408-d63e-4ee7-b5db-46240c5c3213',
    isDeleted: false,
    notes: 'Initial note',
    role: 'Software Engineer',
    status: JobStatus.ENTERED,
    updatedAt: now,
    url: 'https://example.com/jobs/1',
    userId: '6f4eff7c-6e9f-4223-a52f-4d45ecf95e51',
    version: 1,
    ...overrides,
  };
};

export const createSessionRecord = (
  overrides: Partial<SessionRecordLike> = {},
): SessionRecordLike => {
  const now = '2026-01-01T10:00:00.000Z';

  return {
    createdAt: now,
    lastSeenAt: now,
    tier: UserTier.FREE,
    userId: '6f4eff7c-6e9f-4223-a52f-4d45ecf95e51',
    ...overrides,
  };
};
