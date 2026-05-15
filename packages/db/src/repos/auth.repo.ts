import { and, eq } from 'drizzle-orm';
import { appDb } from '../../src';
import { session } from '../schema';
import { expectOne } from '../helpers';
import { SessionRow, InsertSessionRow, UpdateSessionRow } from '../types';

export const findSessionById = async (id: SessionRow['id']): Promise<SessionRow> => {
  const rows = await appDb.select().from(session).where(eq(session.id, id)).limit(1);
  return expectOne(rows, 'Session not found by id');
};

export const findSessionByUserId = async (userId: SessionRow['userId']): Promise<SessionRow> => {
  const rows = await appDb.select().from(session).where(eq(session.userId, userId)).limit(1);
  return expectOne(rows, 'Session not found by user id');
};

export const createSession = async (data: InsertSessionRow): Promise<SessionRow> => {
  const rows = await appDb.insert(session).values(data).returning();
  return expectOne(rows, 'Failed to create session');
};

export const updateSession = async (
  id: SessionRow['id'],
  data: UpdateSessionRow,
): Promise<SessionRow> => {
  const rows = await appDb.update(session).set(data).where(eq(session.id, id)).returning();
  return expectOne(rows, 'Failed to update session');
};

export const deleteSession = async (
  id: SessionRow['id'],
): Promise<{ id: SessionRow['id']; isDeleted: SessionRow['isDeleted'] }> => {
  const rows = await appDb
    .update(session)
    .set({ isDeleted: true })
    .where(and(eq(session.id, id), eq(session.isDeleted, false)))
    .returning({ id: session.id, isDeleted: session.isDeleted });
  return expectOne(rows, 'Failed to delete session');
};
