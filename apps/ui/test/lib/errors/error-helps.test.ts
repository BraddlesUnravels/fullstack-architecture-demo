import { describe, expect, it } from 'vitest';
import type { FailureStatus } from '@app/types';
import {
  asNonEmptyString,
  describeThrownValue,
  getNonEmptyStringProperty,
  isArrayRecord,
  isRecord,
  isRetryableStatus,
  kindFromStatus,
  normaliseStatus,
  normalizeCode,
  safelyConvertToString,
  titleFromStatus,
} from '../../../src/lib/errors/helpers';

const statusCases = [
  {
    status: 400,
    kind: 'validation',
    title: 'Check your request',
    retryable: false,
  },
  {
    status: 401,
    kind: 'unauthenticated',
    title: 'Authentication required',
    retryable: false,
  },
  {
    status: 403,
    kind: 'forbidden',
    title: 'Access denied',
    retryable: false,
  },
  {
    status: 404,
    kind: 'not-found',
    title: 'Not found',
    retryable: false,
  },
  {
    status: 409,
    kind: 'conflict',
    title: 'Request conflict',
    retryable: false,
  },
  {
    status: 410,
    kind: 'not-found',
    title: 'No longer available',
    retryable: false,
  },
  {
    status: 422,
    kind: 'validation',
    title: 'Check your request',
    retryable: false,
  },
  {
    status: 429,
    kind: 'unavailable',
    title: 'Too many requests',
    retryable: true,
  },
  {
    status: 500,
    kind: 'unexpected',
    title: 'Something went wrong',
    retryable: false,
  },
  {
    status: 502,
    kind: 'unavailable',
    title: 'Service unavailable',
    retryable: true,
  },
  {
    status: 503,
    kind: 'unavailable',
    title: 'Service unavailable',
    retryable: true,
  },
  {
    status: 504,
    kind: 'unavailable',
    title: 'Service unavailable',
    retryable: true,
  },
] as const satisfies readonly {
  status: FailureStatus;
  kind:
    | 'validation'
    | 'unauthenticated'
    | 'forbidden'
    | 'not-found'
    | 'conflict'
    | 'unavailable'
    | 'unexpected';
  title: string;
  retryable: boolean;
}[];

describe('API error mapper helpers', () => {
  it.each(statusCases)(
    'should map status $status consistently',
    ({ status, kind, title, retryable }) => {
      expect(normaliseStatus(status)).toBe(status);
      expect(kindFromStatus(status)).toBe(kind);
      expect(titleFromStatus(status)).toBe(title);
      expect(isRetryableStatus(status)).toBe(retryable);
    },
  );

  it.each([200, 418, 501, -1, 400.5, Number.NaN, Infinity, -Infinity])(
    'should normalises unsupported status %s to 500',
    (status) => {
      expect(normaliseStatus(status)).toBe(500);
    },
  );
});

describe('isRecord', () => {
  it.each([{}, { message: 'Failure' }, Object.create(null), new Date()])(
    'should accept non-null and non-array objects',
    (value) => {
      expect(isRecord(value)).toBe(true);
    },
  );

  it.each([null, undefined, [], 'value', 1, true, Symbol('value'), () => {}])(
    'should reject a non-record value %s',
    (value) => {
      expect(isRecord(value)).toBe(false);
    },
  );
});

describe('isArrayRecord', () => {
  it('should accept an empty array', () => {
    expect(isArrayRecord([])).toBe(true);
  });

  it('should accept an array containing only records', () => {
    expect(isArrayRecord([{}, { message: 'Failure' }])).toBe(true);
  });

  it.each([
    {
      description: 'null',
      value: [null],
    },
    {
      description: 'a mixture of a record and null',
      value: [{} as Record<string, unknown>, null],
    },
    {
      description: 'a nested array',
      value: [{}, []],
    },
    {
      description: 'a string',
      value: ['failure'],
    },
    {
      description: 'a number',
      value: [1],
    },
  ])('should reject an array containing $description', ({ value }) => {
    expect(isArrayRecord(value)).toBe(false);
  });

  it.each([null, undefined, {}, 'value', 1])(
    'should reject non-array value %s',
    (value) => {
      expect(isArrayRecord(value)).toBe(false);
    },
  );
});

describe('asNonEmptyString', () => {
  it('should return a non-empty string unchanged', () => {
    expect(asNonEmptyString('  Failure  ')).toBe('  Failure  ');
  });

  it.each(['', ' ', '\n\t'])(
    'should reject empty or whitespace-only string %j',
    (value) => {
      expect(asNonEmptyString(value)).toBeUndefined();
    },
  );

  it.each([null, undefined, 1, true, {}, [], Symbol('value')])(
    'should reject non-string value %s',
    (value) => {
      expect(asNonEmptyString(value)).toBeUndefined();
    },
  );
});

describe('normalizeCode', () => {
  it.each([
    ['ERROR_CODE', 'ERROR_CODE'],
    [' ', ' '],
    [0, '0'],
    [-1, '-1'],
    [400.5, '400.5'],
  ] as const)('should normalise %s to %s', (value, expected) => {
    expect(normalizeCode(value)).toBe(expected);
  });

  it.each([
    '',
    Number.NaN,
    Infinity,
    -Infinity,
    null,
    undefined,
    true,
    1n,
    {},
    [],
  ])('should reject unsupported code %s', (value) => {
    expect(normalizeCode(value)).toBeUndefined();
  });
});

describe('getNonEmptyStringProperty', () => {
  it('should read a non-empty message property', () => {
    expect(getNonEmptyStringProperty({ message: 'Failure' }, 'message')).toBe(
      'Failure',
    );
  });

  it('should read a function name', () => {
    function namedFunction() {}

    expect(getNonEmptyStringProperty(namedFunction, 'name')).toBe(
      'namedFunction',
    );
  });

  it.each([
    [{ message: '' }, 'message'],
    [{ message: '   ' }, 'message'],
    [{ message: 500 }, 'message'],
    [null, 'message'],
    [undefined, 'message'],
    ['Failure', 'message'],
    [500, 'message'],
  ] as const)(
    'should return undefined for an unusable property',
    (value, property) => {
      expect(getNonEmptyStringProperty(value, property)).toBeUndefined();
    },
  );

  it('should return undefined when a property getter throws', () => {
    const value = Object.defineProperty({}, 'message', {
      get() {
        throw new Error('Getter failed');
      },
    });

    expect(getNonEmptyStringProperty(value, 'message')).toBeUndefined();
  });
});

describe('safelyConvertToString', () => {
  it.each([
    [500, '500'],
    [10n, '10'],
    [true, 'true'],
    [Symbol('failure'), 'Symbol(failure)'],
    [{}, '[object Object]'],
  ] as const)('should convert %s safely', (value, expected) => {
    expect(safelyConvertToString(value)).toBe(expected);
  });

  it('should return a fallback when string conversion throws', () => {
    const value = {
      [Symbol.toPrimitive]() {
        throw new Error('Conversion failed');
      },
    };

    expect(safelyConvertToString(value)).toBe('[Unprintable thrown value]');
  });
});

describe('describeThrownValue', () => {
  it.each([
    [undefined, 'undefined'],
    [null, 'null'],
    ['', '[Empty string]'],
    ['   ', '[Empty string]'],
    ['Failure', 'Failure'],
    [500, '500'],
    [Number.NaN, 'NaN'],
    [Infinity, 'Infinity'],
    [-Infinity, '-Infinity'],
    [10n, '10'],
    [true, 'true'],
    [Symbol('failure'), 'Symbol(failure)'],
  ] as const)('should describe primitive value %s', (value, expected) => {
    expect(describeThrownValue(value)).toBe(expected);
  });

  it('should use the message from an Error', () => {
    expect(describeThrownValue(new Error('Failure'))).toBe('Failure');
  });

  it('should use the Error name when its message is empty', () => {
    const error = new Error();
    error.name = 'CustomError';

    expect(describeThrownValue(error)).toBe('CustomError');
  });

  it('should fall back to Error when both name and message are empty', () => {
    const error = new Error();
    error.name = '';

    expect(describeThrownValue(error)).toBe('Error');
  });

  it('should use a message from an error-like object', () => {
    expect(
      describeThrownValue({
        message: 'Object failure',
      }),
    ).toBe('Object failure');
  });

  it('should join an array of strings and message-bearing objects', () => {
    expect(
      describeThrownValue(['First failure', { message: 'Second failure' }]),
    ).toBe('First failure; Second failure');
  });

  it('should serialise the full array when not every item has a message', () => {
    expect(describeThrownValue([{ message: 'First failure' }, 500])).toBe(
      '[{"message":"First failure"},500]',
    );
  });

  it('should serialise an empty array', () => {
    expect(describeThrownValue([])).toBe('[]');
  });

  it('should serialise an ordinary object without a message', () => {
    expect(
      describeThrownValue({
        code: 500,
        retryable: false,
      }),
    ).toBe('{"code":500,"retryable":false}');
  });

  it('should describe a named function', () => {
    function registrationFailure() {}

    expect(describeThrownValue(registrationFailure)).toBe(
      '[Function registrationFailure]',
    );
  });

  it('should describe an anonymous function', () => {
    const anonymousFunction = Function('return function () {}')() as () => void;

    expect(describeThrownValue(anonymousFunction)).toBe('[Function]');
  });

  it('should fall back to string conversion for circular objects', () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;

    expect(describeThrownValue(circular)).toBe('[object Object]');
  });

  it('should fall back to string conversion when JSON contains bigint', () => {
    expect(
      describeThrownValue({
        code: 10n,
      }),
    ).toBe('[object Object]');
  });

  it('should return the final fallback when serialisation and conversion throw', () => {
    const value = {
      toJSON() {
        throw new Error('Serialization failed');
      },
      [Symbol.toPrimitive]() {
        throw new Error('Conversion failed');
      },
    };

    expect(describeThrownValue(value)).toBe('[Unprintable thrown value]');
  });
});
