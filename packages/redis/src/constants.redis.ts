export const REDIS_CONSTANTS = {
  DEFAULT_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  TIMEOUT_MS: 5000,
  RETRY_DELAY_MS: 50,
  MAX_RETRY_DELAY_MS: 2000,
  REGISTRATION_DB: 0,
  SESSION_DB: 1,
} as const;
