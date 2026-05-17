import { Static } from 'elysia';
import { apiErrorResponseSchema } from '@app/schemas';

export * from './app';

export type ApiErrorResponse = Static<typeof apiErrorResponseSchema>;
