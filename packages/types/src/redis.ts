import type { UserTier } from '@app/constants';

export type PendingRegistrationRecord = {
  registrationId: string;
  email: string;
};

export type SessionRecord = {
  userId: string;
  createdAt: string;
  lastSeenAt: string;
  tier: UserTier;
};
