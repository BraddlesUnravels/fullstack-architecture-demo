import type * as v from 'valibot';
import type {
  credentialSelectSchema,
  credentialInsertSchema,
  credentialUpdateSchema,
} from '@app/schemas';

export type CredentialSelect = v.InferInput<typeof credentialSelectSchema>;
export type CredentialInsert = v.InferInput<typeof credentialInsertSchema>;
export type CredentialUpdate = v.InferInput<typeof credentialUpdateSchema>;
