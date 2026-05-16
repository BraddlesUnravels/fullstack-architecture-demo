import { t } from 'elysia';

export * from './audit';
export * from './user';
export * from './application';
export * from './company';
export * from './credential';
export * from './session';
export * from './error-response';
export * from './auth';

// Best-practice summary:
// Schema first
// Static<typeof Schema> second
// Compile validators once
// Validate all external input
// Use additionalProperties: false for strict API payloads
// Prefer Type.Integer() where appropriate
// Distinguish optional from nullable
// Do not rely on TypeScript types for runtime safety
// Check package/version-specific imports

// Typebox Gotchas:
// Check = validate only
// Parse = validate plus construct/clean/default/decode depending on schema

// reusable schema components
export const getByEmail = t.Object({
  email: t.String({ format: 'email', error: 'The email address of the user' }),
});

export const getById = t.Object({
  id: t.String({ format: 'uuid', error: 'Invalid ID format' }),
});

export const deleteSchema = t.Object({
  success: t.Boolean(),
});
