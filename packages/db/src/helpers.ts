export function expectOne<T>(rows: T[], message = 'Expected one row'): T {
  const row = rows[0];

  if (!row) {
    throw new Error(message);
  }

  return row;
}

export function expectZeroOrOne<T>(rows: T[], message = 'Expected zero or one row'): T {
  const row = rows[0];

  if (!row || rows.length > 1 || rows.length < 0) {
    throw new Error(message);
  }

  return row;
}

export function expectMany<T>(rows: T[], message = 'Expected many rows'): T[] {
  if (rows.length > 1) {
    throw new Error(message);
  }

  return rows;
}
