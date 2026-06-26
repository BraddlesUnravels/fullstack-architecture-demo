import type { Static } from 'elysia';
import type {
  selectApplicationSchema,
  insertApplicationSchema,
  updateApplicationSchema,
} from '@app/schemas/typebox';

export type ApplicationSelect = Static<typeof selectApplicationSchema>;
export type ApplicationInsert = Static<typeof insertApplicationSchema>;
export type ApplicationUpdate = Static<typeof updateApplicationSchema>;
