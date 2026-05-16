import { and, eq } from 'drizzle-orm';
import { appDb } from '../../src';
import { session } from '../schema';
import { SessionRow, InsertSessionRow, UpdateSessionRow } from '../types';
import { DeleteResponse } from '@app/types/index';

export const findSessionById = async (id: SessionRow['id']): Promise<SessionRow[]> => {
  const rows = await appDb.select().from(session).where(eq(session.id, id)).limit(1);
  return rows ?? [];
};

export const findSessionByUserId = async (userId: SessionRow['userId']): Promise<SessionRow[]> => {
  const rows = await appDb.select().from(session).where(eq(session.userId, userId)).limit(1);
  return rows ?? [];
};

export const createSession = async (data: InsertSessionRow): Promise<SessionRow[]> => {
  const rows = await appDb.insert(session).values(data).returning();
  return rows ?? [];
};

export const updateSession = async (
  id: SessionRow['id'],
  data: UpdateSessionRow,
): Promise<SessionRow[]> => {
  const row = await appDb.update(session).set(data).where(eq(session.id, id)).returning();
  return row ?? [];
};

export const deleteSession = async (id: SessionRow['id']): Promise<DeleteResponse> => {
  const row = await appDb
    .update(session)
    .set({ isDeleted: true })
    .where(and(eq(session.id, id), eq(session.isDeleted, false)))
    .returning({ id: session.id, isDeleted: session.isDeleted });
  return { success: row[0]?.isDeleted ?? false };
};
