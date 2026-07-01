import * as v from 'valibot';

export const apiErrorResponseSchema = v.strictObject({
  code: v.string(),
  message: v.string(),
});
