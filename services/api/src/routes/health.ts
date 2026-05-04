import { Elysia, t } from 'elysia';

const healthResponseSchema = t.Object({
  service: t.Literal('job-application-tracker-api'),
  status: t.Literal('ok'),
  timestamp: t.String({ format: 'date-time' }),
});

export const healthRoutes = new Elysia({ name: 'health-routes', prefix: '/health' }).get(
  '/',
  () => ({
    service: 'job-application-tracker-api' as const,
    status: 'ok' as const,
    timestamp: new Date().toISOString(),
  }),
  {
    response: healthResponseSchema,
  },
);
