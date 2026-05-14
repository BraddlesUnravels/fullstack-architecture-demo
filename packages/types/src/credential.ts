import type { Static } from 'elysia';
import {
  credentialSelectSchema,
  credentialInsertSchema,
  credentialUpdateSchema,
} from '@app/schemas/typebox';

export type CredentialSelect = Static<typeof credentialSelectSchema>;
export type CredentialInsert = Static<typeof credentialInsertSchema>;
export type CredentialUpdate = Static<typeof credentialUpdateSchema>;
