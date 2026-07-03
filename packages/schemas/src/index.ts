import * as v from 'valibot';

export * from './audit';
export * from './user';
export * from './application';
export * from './company';
export * from './credential';
export * from './error-response';
export * from './auth';

export const getByEmail = v.strictObject({
  email: v.message(v.pipe(v.string(), v.email()), 'The email address of the user'),
});

export const getById = v.strictObject({
  id: v.message(v.pipe(v.string(), v.uuid()), 'Invalid ID format'),
});

export const deleteSchema = v.strictObject({
  success: v.boolean(),
});
