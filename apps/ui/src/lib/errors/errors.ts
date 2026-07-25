import type { AppError, ErrorKind } from '../types';

// Normalize unknown to AppError (serializable)
export const normalizeError = (err: unknown): AppError => {
  if (err && typeof err === 'object' && 'kind' in err) {
    const e = err as Partial<AppError>;
    return {
      name: e.name ?? 'AppError',
      message: e.message ?? 'Something went wrong',
      kind: (e.kind as ErrorKind) ?? 'unknown',
      code: e.code,
      metadata: e.metadata,
    };
  }

  if (err instanceof Error) {
    return { name: err.name, message: err.message, kind: 'unknown' };
  }

  if (
    typeof err === 'string' ||
    typeof err === 'number' ||
    typeof err === 'boolean' ||
    typeof err === 'bigint' ||
    typeof err === 'symbol'
  ) {
    return {
      name: 'UnknownError',
      message: String(err),
      kind: 'unknown',
    };
  }

  return {
    name: 'UnknownError',
    message: 'Unknown error',
    kind: 'unknown',
  };
};
