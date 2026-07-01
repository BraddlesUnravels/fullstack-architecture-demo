import { and, eq } from 'drizzle-orm';
import { appDb } from '../../src';
import { session } from '../schema';
import type { SessionRow, InsertSessionRow, UpdateSessionRow } from '../types';
import type { DeleteResponse } from '@app/types/index';
import type { NullToUndefined } from '@app/types';
import { stripNulls } from '../helpers';

export const findSessionById = async (
  id: SessionRow['id'],
): Promise<NullToUndefined<SessionRow>[]> => {
  const rows = await appDb.select().from(session).where(eq(session.id, id)).limit(1);
  return stripNulls(rows) ?? [];
};

export const findSessionByUserId = async (
  userId: SessionRow['userId'],
): Promise<NullToUndefined<SessionRow>[]> => {
  const rows = await appDb.select().from(session).where(eq(session.userId, userId)).limit(1);
  return stripNulls(rows) ?? [];
};

export const createSession = async (
  data: InsertSessionRow,
): Promise<NullToUndefined<SessionRow>[]> => {
  const rows = await appDb.insert(session).values(data).returning();
  return stripNulls(rows) ?? [];
};

export const updateSession = async (
  id: SessionRow['id'],
  data: UpdateSessionRow,
): Promise<NullToUndefined<SessionRow>[]> => {
  const row = await appDb.update(session).set(data).where(eq(session.id, id)).returning();
  return stripNulls(row) ?? [];
};

export const deleteSession = async (id: SessionRow['id']): Promise<DeleteResponse> => {
  const row = await appDb
    .update(session)
    .set({ isDeleted: true })
    .where(and(eq(session.id, id), eq(session.isDeleted, false)))
    .returning({ id: session.id, isDeleted: session.isDeleted });
  return { success: row[0]?.isDeleted ?? false };
};
