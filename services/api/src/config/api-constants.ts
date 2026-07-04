export const API_CONSTANTS = {
  security: {
    SESSION_TIMEOUT: 2880, // 48 hours in minutes
    EMAIL_MIN_LENGTH: 8,
    EMAIL_MAX_LENGTH: 500,
  },
  cookie: {
    COOKIE_NAME: 'sid',
    TTL_SECONDS: 60 * 60 * 24, // 24 hours in seconds
  },
  jwt: {},
  email: {
    EMAIL_USER: 'stackchatr@gmail.com',
  },
} as const;
