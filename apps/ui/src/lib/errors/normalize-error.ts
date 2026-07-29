import {
  asNonEmptyString,
  normalizeCode,
  isRecord,
  describeThrownValue,
} from './helpers';
import type { RuntimeError } from '../types';

const handleErrorInstance = (error: unknown): RuntimeError | undefined => {
  if (!(error instanceof Error)) return;

  const extendedError = error as Error & {
    code?: unknown;
    metadata?: unknown;
  };

  const code = normalizeCode(extendedError.code);
  const metadata = isRecord(extendedError.metadata)
    ? extendedError.metadata
    : undefined;

  return {
    name: error.name || 'Error',
    message: error.message || 'Unexpected error',
    ...(code === undefined ? {} : { code }),
    ...(error.stack === undefined ? {} : { stack: error.stack }),
    ...(error.cause === undefined ? {} : { cause: error.cause }),
    ...(metadata === undefined ? {} : { metadata }),
  };
};

const handleRecordInstance = (error: unknown): RuntimeError | undefined => {
  if (!isRecord(error)) return;

  const name = asNonEmptyString(error.name) ?? 'UnknownError';
  const message = asNonEmptyString(error.message) ?? 'Unknown error';
  const code = normalizeCode(error.code);
  const stack = asNonEmptyString(error.stack);
  const metadata = isRecord(error.metadata) ? error.metadata : undefined;

  return {
    name,
    message,
    ...(code === undefined ? {} : { code }),
    ...(stack === undefined ? {} : { stack }),
    ...(error.cause === undefined ? {} : { cause: error.cause }),
    ...(metadata === undefined ? {} : { metadata }),
  };
};

export const normalizeError = (error: unknown): RuntimeError => {
  const errorInstance = handleErrorInstance(error);
  if (errorInstance) return errorInstance;

  const recordError = handleRecordInstance(error);
  if (recordError) return recordError;

  if (error === null || error === undefined) {
    return {
      name: 'UnknownError',
      message: describeThrownValue(error),
    };
  }

  return {
    name: 'UnknownError',
    message: describeThrownValue(error),
  };
};
