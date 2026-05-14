import { Object, Static, TSchema, String, Boolean, Union, Null } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

export * from './audit';
export * from './user';
export * from './application';
export * from './company';
export * from './credential';
export * from './session';
export * from './error-response';

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

export const createValidator = <T extends TSchema>(schema: T) => {
  const validator = TypeCompiler.Compile(schema);

  return function validate(input: unknown): Static<T> {
    if (!validator.Check(input)) {
      throw new Error(`Validation failed: ${JSON.stringify(validator.Errors(input))}`);
    }
    return input as Static<T>;
  };
};
