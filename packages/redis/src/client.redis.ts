import { createClient } from 'redis';
import { REDIS_CONSTANTS } from './constants.redis';

const {
  DEFAULT_URL,
  TIMEOUT_MS,
  REGISTRATION_DB,
  SESSION_DB,
  RETRY_DELAY_MS,
  MAX_RETRY_DELAY_MS,
} = REDIS_CONSTANTS;

type RedisClient = ReturnType<typeof createClient>;
type RedisClientState = {
  client: RedisClient;
  connectPromise?: Promise<void>;
};

const redisUrl = process.env.REDIS_URL || DEFAULT_URL;
const redisPassword = process.env.REDIS_PASSWORD;

if (!redisPassword)
  throw new Error('REDIS_PASSWORD must be set in the environment variables');

const createRedisClient = (database: number): RedisClient =>
  createClient({
    url: redisUrl,
    password: redisPassword,
    database,
    socket: {
      connectTimeout: TIMEOUT_MS,
      reconnectStrategy: (retries) => {
        // This adds a random retry delay stops all clients from retrying at the same time.
        const jitter = Math.floor(Math.random() * 200);
        const delay = Math.min(
          2 ** retries * RETRY_DELAY_MS,
          MAX_RETRY_DELAY_MS,
        );

        return delay + jitter;
      },
    },
  });

const registrationRedisState: RedisClientState = {
  client: createRedisClient(REGISTRATION_DB),
};

const sessionRedisState: RedisClientState = {
  client: createRedisClient(SESSION_DB),
};

const attachErrorHandler = (clientName: string, state: RedisClientState) => {
  state.client.on('error', (err) => {
    console.error(`${clientName} Redis client error`, err);
  });
};

attachErrorHandler('Registration', registrationRedisState);
attachErrorHandler('Session', sessionRedisState);

const connectRedisClient = async (state: RedisClientState): Promise<void> => {
  if (state.client.isOpen) return;

  if (!state.connectPromise) {
    state.connectPromise = state.client
      .connect()
      .then(() => undefined)
      .finally(() => {
        state.connectPromise = undefined;
      });
  }

  await state.connectPromise;
};

const getConnectedRedisClient = async (
  state: RedisClientState,
): Promise<RedisClient> => {
  await connectRedisClient(state);
  return state.client;
};

export const getRegistrationRedisClient = async (): Promise<RedisClient> =>
  getConnectedRedisClient(registrationRedisState);

export const getSessionRedisClient = async (): Promise<RedisClient> =>
  getConnectedRedisClient(sessionRedisState);

const closeRedisClient = async (client: RedisClient) => {
  if (!client.isOpen) return;
  await client.quit();
};

export const closeRedis = async () => {
  await Promise.all([
    closeRedisClient(registrationRedisState.client),
    closeRedisClient(sessionRedisState.client),
  ]);
};
