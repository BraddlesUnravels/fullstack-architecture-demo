import { createClient } from 'redis';

const DEFAULT_REDIS_URL = 'redis://localhost:6379';
const DEFAULT_CONNECT_TIMEOUT_MS = 5000;
const DEFAULT_RETRY_BASE_DELAY_MS = 50;
const MAX_RETRY_DELAY_MS = 2000;

const parsePositiveNumber = (value: string | undefined, fallback: number): number => {
  if (!value) return fallback;

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;

  return parsed;
};

const redisUrl = process.env.REDIS_URL || DEFAULT_REDIS_URL;
const redisConnectTimeoutMs = parsePositiveNumber(
  process.env.REDIS_CONNECT_TIMEOUT_MS,
  DEFAULT_CONNECT_TIMEOUT_MS,
);

export const redisClient = createClient({
  url: redisUrl,
  socket: {
    connectTimeout: redisConnectTimeoutMs,
    reconnectStrategy: (retries) => {
      // This adds a random retry delay stops all clients from retrying at the same time.
      const jitter = Math.floor(Math.random() * 200);
      const delay = Math.min(2 ** retries * DEFAULT_RETRY_BASE_DELAY_MS, MAX_RETRY_DELAY_MS);

      return delay + jitter;
    },
  },
});

// TODO: Add a logger to log redis connection events and errors
redisClient.on('error', (err) => {
  console.error('Redis client error', err);
  throw new Error('Redis client error');
});

// Connection promise to ensure async connection attempts are not duplicated.
let connectPromise: Promise<unknown> | undefined;

export const connectRedis = async () => {
  if (redisClient.isOpen) return;

  if (!connectPromise) {
    connectPromise = redisClient
      .connect()
      .then(() => undefined)
      .finally(() => {
        connectPromise = undefined;
      });
  }

  await connectPromise;
};

export const getRedisClient = async () => {
  await connectRedis();
  return redisClient;
};

export const closeRedis = async () => {
  if (!redisClient.isOpen) return;
  await redisClient.quit();
};
