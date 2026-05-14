import type { Static } from 'elysia';
import {
  sessionSelectSchema,
  sessionInsertSchema,
  sessionUpdateSchema,
} from '@app/schemas/typebox';

export type SessionSelect = Static<typeof sessionSelectSchema>;
export type SessionInsert = Static<typeof sessionInsertSchema>;
export type SessionUpdate = Static<typeof sessionUpdateSchema>;
