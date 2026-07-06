export type WithAuditDates<T> = T & {
  createdAt?: Date;
  updatedAt?: Date;
  verifiedAt?: Date;
  lastLoginAt?: Date;
  deletedAt?: Date;
};

export type SerializedAuditDates<T> = T & {
  createdAt?: string;
  updatedAt?: string;
  verifiedAt?: string;
  lastLoginAt?: string;
  deletedAt?: string;
};

// TODO: Refine this function to be more refined and readable
export const serializeAuditDates = <T>(input: WithAuditDates<T>): SerializedAuditDates<T> => {
  const serialized = { ...input } as SerializedAuditDates<T>;

  if (input.createdAt instanceof Date) serialized.createdAt = input.createdAt.toISOString();
  if (input.updatedAt instanceof Date) serialized.updatedAt = input.updatedAt.toISOString();
  if ('verifiedAt' in input && input.verifiedAt instanceof Date)
    serialized.verifiedAt = input.verifiedAt.toISOString();
  if ('lastLoginAt' in input && input.lastLoginAt instanceof Date)
    serialized.lastLoginAt = input.lastLoginAt.toISOString();
  if ('deletedAt' in input && input.deletedAt instanceof Date)
    serialized.deletedAt = input.deletedAt.toISOString();

  return serialized;
};

export const toDbDate = (value: string | null | undefined): Date | null | undefined => {
  if (value === undefined || value === null) return value;

  return new Date(value);
};

export const dateAddition = (add: number) => {
  const now = new Date();
  return new Date(now.getTime() + add * 60000);
};
