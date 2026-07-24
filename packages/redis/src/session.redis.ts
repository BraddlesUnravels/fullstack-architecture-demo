import type { UserTier } from '@app/constants';
import type { SessionRecord } from '@app/types';
import { getSessionRedisClient } from './client.redis';
import { redisKeys } from './keys.redis';

const parseSessionRecord = (
  value: string | null,
): SessionRecord | undefined => {
  if (!value) return undefined;

  const parsed = JSON.parse(value) as SessionRecord;
  if (!parsed.userId || !parsed.createdAt) return undefined;

  return parsed;
};

export const createSession = async (
  sessionTokenHash: string,
  userId: string,
  tier: UserTier,
  ttlSeconds: number,
): Promise<void> => {
  const client = await getSessionRedisClient();
  const payload: SessionRecord = {
    userId,
    tier,
    createdAt: new Date().toISOString(),
    lastSeenAt: new Date().toISOString(),
  };

  await client.set(
    redisKeys.sessionByTokenHash(sessionTokenHash),
    JSON.stringify(payload),
    {
      EX: ttlSeconds,
    },
  );
};

export const readSession = async (
  sessionTokenHash: string,
): Promise<SessionRecord | undefined> => {
  const client = await getSessionRedisClient();
  const payload = await client.get(
    redisKeys.sessionByTokenHash(sessionTokenHash),
  );

  return parseSessionRecord(payload);
};

export const deleteSession = async (
  sessionTokenHash: string,
): Promise<boolean> => {
  const client = await getSessionRedisClient();
  const deleteCount = await client.del(
    redisKeys.sessionByTokenHash(sessionTokenHash),
  );

  return deleteCount > 0;
};
