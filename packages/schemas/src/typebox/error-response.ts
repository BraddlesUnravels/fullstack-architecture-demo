import { t } from 'elysia';

export const apiErrorResponseSchema = t.Object({
  code: t.String(),
  message: t.String(),
});
