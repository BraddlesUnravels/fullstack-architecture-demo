import type { NullToUndefined } from '@app/types';

export const stripNulls = <T>(value: T): NullToUndefined<T> => {
  if (value === null) return undefined as NullToUndefined<T>;
  if (value instanceof Date) return value as NullToUndefined<T>;

  if (Array.isArray(value)) {
    const arrayValue = value as unknown[];

    return arrayValue.map((item) => stripNulls(item)) as NullToUndefined<T>;
  }

  if (typeof value === 'object' && value !== null) {
    const result: Record<string, unknown> = {};
    const objectValue = value as Record<string, unknown>;

    for (const [key, item] of Object.entries(objectValue)) {
      result[key] = stripNulls(item);
    }

    return result as NullToUndefined<T>;
  }

  return value as NullToUndefined<T>;
};
