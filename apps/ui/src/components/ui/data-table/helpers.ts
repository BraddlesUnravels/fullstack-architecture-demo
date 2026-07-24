import type { DataTableColumn } from './types';
const getValueByPath = (
  row: Record<string, unknown>,
  path: string,
): unknown => {
  const keys = path.split('.');
  let current: unknown = row;

  for (const key of keys) {
    if (!current || typeof current !== 'object') return undefined;

    current = (current as Record<string, unknown>)[key];
  }

  return current;
};

const formatCellValue = (value: unknown): string => {
  if (value === null || value === undefined) return '';

  if (typeof value === 'string') return value;

  if (typeof value === 'number' || typeof value === 'bigint')
    return value.toString();

  if (typeof value === 'boolean') return value ? 'Yes' : 'No';

  if (typeof value === 'symbol') return value.description ?? 'Symbol';

  if (value instanceof Date) return value.toISOString();

  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return '';
    }
  }

  return '';
};

const alignmentClass = (
  alignment: DataTableColumn<object>['align'],
): string | undefined => {
  switch (alignment) {
    case 'center':
      return 'text-center';

    case 'right':
      return 'text-right';

    default:
      return undefined;
  }
};

export { formatCellValue, alignmentClass, getValueByPath };
