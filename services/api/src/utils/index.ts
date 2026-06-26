export type WithAuditDates<T> = T & {
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date | null;
  deletedAt: Date | null;
};

export type SerializedAuditDates<T> = T & {
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  deletedAt?: string;
};

export const serializeAuditDates = <T>(input: WithAuditDates<T>): SerializedAuditDates<T> => ({
  ...input,
  createdAt: input.createdAt.toISOString(),
  updatedAt: input.updatedAt.toISOString(),
  lastLoginAt: input.lastLoginAt?.toISOString(),
  deletedAt: input.deletedAt?.toISOString(),
});

export const toDbDate = (value: string | null | undefined): Date | null | undefined => {
  if (value === undefined || value === null) return value;

  return new Date(value);
};

export const dateAddition = (add: number) => {
  const now = new Date();
  return new Date(now.getTime() + add * 60000);
};
