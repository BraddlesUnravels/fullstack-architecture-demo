import { Static } from 'elysia';
import { apiErrorResponseSchema } from '@app/schemas';

export * from './elysia';

export type ApiErrorResponse = Static<typeof apiErrorResponseSchema>;
