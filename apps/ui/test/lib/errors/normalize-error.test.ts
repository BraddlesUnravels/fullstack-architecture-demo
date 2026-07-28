import { describe, expect, it } from 'vitest';
import { normalizeError } from '../../../src/lib/errors/normalize-error';

describe('normalizeError', () => {
  describe('Error instances', () => {
    it('should preserve diagnostic properties from an extended Error', () => {
      const cause = new Error('Database unavailable');

      const metadata = {
        route: '/login',
        requestId: 'request-123',
      };

      const error = Object.assign(
        new Error('Registration failed', {
          cause,
        }),
        {
          name: 'RegistrationError',
          code: 503,
          metadata,
        },
      );

      const result = normalizeError(error);

      expect(result).toEqual({
        name: 'RegistrationError',
        message: 'Registration failed',
        code: '503',
        stack: expect.any(String),
        cause,
        metadata,
      });
    });

    it('should use safe defaults for an Error with empty name and message', () => {
      const error = new Error();
      error.name = '';
      error.message = '';

      const result = normalizeError(error);

      expect(result).toMatchObject({
        name: 'Error',
        message: 'Unexpected error',
      });

      expect(result.stack).toEqual(expect.any(String));
    });

    it('should omit unsupported optional properties', () => {
      const error = Object.assign(new Error('Failure'), {
        code: Number.NaN,
        metadata: ['not', 'a', 'record'],
      });

      const result = normalizeError(error);

      expect(result).not.toHaveProperty('code');
      expect(result).not.toHaveProperty('metadata');
    });
  });

  describe('record-like errors', () => {
    it('should normalise all supported diagnostic properties', () => {
      const cause = {
        code: 'DATABASE_FAILURE',
      };

      const metadata = {
        operation: 'createUser',
      };

      const result = normalizeError({
        name: 'RepositoryError',
        message: 'Unable to create user',
        code: 500,
        stack: 'stack trace',
        cause,
        metadata,
      });

      expect(result).toEqual({
        name: 'RepositoryError',
        message: 'Unable to create user',
        code: '500',
        stack: 'stack trace',
        cause,
        metadata,
      });
    });

    it('should use defaults and omit invalid optional properties', () => {
      const result = normalizeError({
        name: '   ',
        message: '',
        code: Infinity,
        stack: 500,
        metadata: [],
      });

      expect(result).toEqual({
        name: 'UnknownError',
        message: 'Unknown error',
      });
    });

    it('should preserve a defined falsy cause', () => {
      expect(
        normalizeError({
          cause: null,
        }),
      ).toEqual({
        name: 'UnknownError',
        message: 'Unknown error',
        cause: null,
      });
    });
  });

  describe('other thrown values', () => {
    it.each([
      [undefined, 'undefined'],
      [null, 'null'],
      ['', '[Empty string]'],
      ['Failure', 'Failure'],
      [500, '500'],
      [Number.NaN, 'NaN'],
      [Infinity, 'Infinity'],
      [10n, '10'],
      [true, 'true'],
      [Symbol('failure'), 'Symbol(failure)'],
    ] as const)('should normalise thrown value %s', (value, message) => {
      expect(normalizeError(value)).toEqual({
        name: 'UnknownError',
        message,
      });
    });

    it('should normalise an array of message-bearing values', () => {
      expect(
        normalizeError([
          new Error('First failure'),
          {
            message: 'Second failure',
          },
        ]),
      ).toEqual({
        name: 'UnknownError',
        message: 'First failure; Second failure',
      });
    });

    it('should normalise a named function without invoking it', () => {
      let invoked = false;

      function thrownFunction() {
        invoked = true;
      }

      expect(normalizeError(thrownFunction)).toEqual({
        name: 'UnknownError',
        message: '[Function thrownFunction]',
      });

      expect(invoked).toBe(false);
    });
  });

  it.todo(
    'should not throw when a record has hostile name, message, or metadata getters',
  );

  it.todo('should not throw when Error instanceof evaluation is hostile');
});
