export type WithAuditDates<T> = T & {
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date | null;
  deletedAt: Date | null;
};

export const serializeAuditDates = <T>(input: WithAuditDates<T>) => ({
  ...input,
  createdAt: input.createdAt.toISOString(),
  updatedAt: input.updatedAt.toISOString(),
  lastLoginAt: input.lastLoginAt?.toISOString() ?? null,
  deletedAt: input.deletedAt?.toISOString() ?? null,
});
