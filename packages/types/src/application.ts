import { Static } from '@sinclair/typebox';
import {
  applicationSelectSchema,
  applicationInsertSchema,
  applicationUpdateSchema,
} from '@app/schemas/typebox';

export type ApplicationSelect = Static<typeof applicationSelectSchema>;
export type ApplicationInsert = Static<typeof applicationInsertSchema>;
export type ApplicationUpdate = Static<typeof applicationUpdateSchema>;
