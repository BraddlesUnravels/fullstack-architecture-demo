import type { PendingRegistrationRecord } from '@app/types';
import { getRegistrationRedisClient } from './client.redis';
import { redisKeys } from './keys.redis';

const parsePendingRegistrationRecord = (
  value: string | null,
): PendingRegistrationRecord | undefined => {
  if (!value) return undefined;

  const parsed = JSON.parse(value) as PendingRegistrationRecord;
  if (!parsed.registrationId || !parsed.email) return undefined;

  return parsed;
};

const savePendingRegistrationRecord = async (
  record: PendingRegistrationRecord,
  ttlSeconds?: number,
) => {
  const client = await getRegistrationRedisClient();
  const pendingByEmailKey = redisKeys.pendingRegistrationByEmail(record.email);
  const existingRegistrationId = await client.get(pendingByEmailKey);

  if (existingRegistrationId && existingRegistrationId !== record.registrationId) {
    await client.del(redisKeys.pendingRegistration(existingRegistrationId));
  }

  const pendingRegistrationKey = redisKeys.pendingRegistration(record.registrationId);
  const payload = JSON.stringify(record);

  await client
    .multi()
    .set(pendingRegistrationKey, payload, { EX: ttlSeconds })
    .set(pendingByEmailKey, record.registrationId, { EX: ttlSeconds })
    .exec();
};

export const createPendingRegistration = async (
  registrationId: string,
  email: string,
  ttlSeconds?: number,
) => {
  return savePendingRegistrationRecord(
    {
      registrationId,
      email,
    },
    ttlSeconds,
  );
};

export const readPendingRegistration = async (
  registrationId: string,
): Promise<PendingRegistrationRecord | undefined> => {
  const client = await getRegistrationRedisClient();
  const payload = await client.get(redisKeys.pendingRegistration(registrationId));

  return parsePendingRegistrationRecord(payload);
};

export const consumePendingRegistration = async (
  registrationId: string,
): Promise<PendingRegistrationRecord | undefined> => {
  const client = await getRegistrationRedisClient();
  const record = await readPendingRegistration(registrationId);
  if (!record) return undefined;

  await client
    .multi()
    .del(redisKeys.pendingRegistration(registrationId))
    .del(redisKeys.pendingRegistrationByEmail(record.email))
    .exec();

  return record;
};
