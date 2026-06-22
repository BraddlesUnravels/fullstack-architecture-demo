import type { Static } from 'elysia';
import type { apiErrorResponseSchema } from '@app/schemas';

export * from './app';

export type ApiErrorResponse = Static<typeof apiErrorResponseSchema>;
