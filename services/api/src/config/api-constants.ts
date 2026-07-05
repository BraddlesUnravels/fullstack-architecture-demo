export const API_CONSTANTS = {
  security: {
    EMAIL_MIN_LENGTH: 8,
    EMAIL_MAX_LENGTH: 500,
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_MAX_LENGTH: 128,
    PASSWORD_REGEX: /^''*/,
  },
  cookie: {
    COOKIE_NAME: 'sid',
    TTL_SECONDS: 60 * 60 * 8, // 8 hours in seconds
    INACTIVITY_TIMEOUT_MILLIS: 0.001 * 1000 * 60 * 60 * 4, // 4hrs
  },
  jwt: {},
  email: {
    EMAIL_USER: 'stackchatr@gmail.com',
  },
} as const;
