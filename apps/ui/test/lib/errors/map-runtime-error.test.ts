import { afterEach, describe, expect, it, vi } from 'vitest';
import { mapRuntimeErrorToUi } from '../../../src/lib/errors/map-runtime-error';
import type { RuntimeError } from '../../../src/lib/types';

const generatedId = '123e4567-e89b-12d3-a456-426614174000';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('mapRuntimeErrorToUi', () => {
  it('should map a runtime error to a safe, non-transient UI error', () => {
    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue(generatedId);

    const runtimeError: RuntimeError = {
      name: 'DatabaseError',
      message: 'postgres://admin:secret@database/internal failed',
      code: 'DATABASE_CONNECTION_FAILED',
      stack: 'internal stack trace',
      cause: new Error('Connection refused'),
      metadata: {
        host: 'internal-database',
        password: 'secret',
      },
    };

    const result = mapRuntimeErrorToUi(runtimeError);

    expect(result).toEqual({
      id: generatedId,
      level: 'error',
      title: 'Something went wrong',
      message:
        'An unexpected error occurred. Please reload the page and try again.',
      transient: false,
      metadata: {
        reference: 'DATABASE_CONNECTION_FAILED',
      },
    });
  });

  it('should use the generated ID as the reference when no code exists', () => {
    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue(generatedId);

    const result = mapRuntimeErrorToUi({
      name: 'TypeError',
      message: 'Cannot read properties of undefined',
    });

    expect(result.id).toBe(generatedId);

    expect(result.metadata).toEqual({
      reference: generatedId,
    });
  });

  it('should not expose internal runtime details', () => {
    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue(generatedId);

    const result = mapRuntimeErrorToUi({
      name: 'InternalErrorName',
      message: 'Sensitive internal message',
      code: 'SAFE_REFERENCE',
      stack: 'Sensitive stack trace',
      cause: 'Sensitive cause',
      metadata: {
        secret: 'Sensitive metadata',
      },
    });

    const serialisedResult = JSON.stringify(result);

    expect(serialisedResult).not.toContain('InternalErrorName');

    expect(serialisedResult).not.toContain('Sensitive internal message');

    expect(serialisedResult).not.toContain('Sensitive stack trace');

    expect(serialisedResult).not.toContain('Sensitive cause');

    expect(serialisedResult).not.toContain('Sensitive metadata');

    expect(serialisedResult).toContain('SAFE_REFERENCE');
  });

  it('should generate a new ID for each mapped error', () => {
    const firstId = '123e4567-e89b-12d3-a456-426614174001';

    const secondId = '123e4567-e89b-12d3-a456-426614174002';

    vi.spyOn(globalThis.crypto, 'randomUUID')
      .mockReturnValueOnce(firstId)
      .mockReturnValueOnce(secondId);

    const runtimeError: RuntimeError = {
      name: 'Error',
      message: 'Failure',
    };

    expect(mapRuntimeErrorToUi(runtimeError).id).toBe(firstId);

    expect(mapRuntimeErrorToUi(runtimeError).id).toBe(secondId);
  });
});
