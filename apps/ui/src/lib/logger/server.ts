import pino from 'pino';
import { isDev } from '@builder.io/qwik';

const logLevel = import.meta.env.DEV || isDev ? 'debug' : 'info';

export const serverLogger = pino({
  level: logLevel,
  base: {
    service: 'job-application-tracker-ui',
    environment: import.meta.env.MODE,
  },
  serializers: {
    error: pino.stdSerializers.err,
  },
  redact: {
    paths: [
      'authorization',
      'cookie',
      'password',
      'confirmPassword',
      'token',
      'registrationToken',
      'otp',
      'request.headers.authorization',
      'request.headers.cookie',
    ],
    censor: '[REDACTED]',
  },
});
