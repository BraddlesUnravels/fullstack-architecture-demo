const getRedisUrl = () => {
  const url = process.env.REDIS_URL;
  if (!url) throw new Error('Missing required environment variable REDIS_URL');
  return url;
};

export const REDIS_CONSTANTS = {
  DEFAULT_URL: getRedisUrl(),
  TIMEOUT_MS: 5000,
  RETRY_DELAY_MS: 50,
  MAX_RETRY_DELAY_MS: 2000,
  REGISTRATION_DB: 0,
  SESSION_DB: 1,
} as const;
