import type * as v from 'valibot';
import type {
  applicationResponseSchema,
  applicationSummarySchema,
  createApplicationInputSchema,
  listApplicationsSchema,
  updateApplicationInputSchema,
} from '@app/schemas';

export type CreateApplicationInput = v.InferOutput<
  typeof createApplicationInputSchema
>;

export type UpdateApplicationInput = v.InferOutput<
  typeof updateApplicationInputSchema
>;

export type ApplicationResponse = v.InferOutput<
  typeof applicationResponseSchema
>;

export type ApplicationSummary = v.InferOutput<typeof applicationSummarySchema>;

export type ApplicationSummaryList = v.InferOutput<
  typeof listApplicationsSchema
>;
