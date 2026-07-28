import pino from 'pino';
import { isDev } from '@builder.io/qwik';
import type { RuntimeError } from '../types';

type ErrorLogContext = Record<string, unknown>;
const logLevel = import.meta.env.DEV || isDev ? 'debug' : 'info';

export const logError = (
  error: RuntimeError,
  context: ErrorLogContext = {},
): void => {
  console.error({
    ...context,
    error: {
      name: error.name,
      message: error.message,
      ...(error.code === undefined ? {} : { code: error.code }),
      ...(error.stack === undefined ? {} : { stack: error.stack }),
      ...(error.cause === undefined ? {} : { cause: error.cause }),
      ...(error.metadata === undefined ? {} : { metadata: error.metadata }),
    },
  });

  // TODO: Send to a remote logging service without blocking the UI.
};

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
