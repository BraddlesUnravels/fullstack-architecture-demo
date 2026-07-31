import type { RuntimeError } from '../types';
type ErrorLogContext = Record<string, unknown>;

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
