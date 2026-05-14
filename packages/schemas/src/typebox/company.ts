import { t } from 'elysia';
import { auditColumns } from './audit';

export const companySelectSchema = t.Object(
  {
    id: t.String({ format: 'uuid' }),
    name: t.String(),
    abn: t.Union([t.String(), t.Null()]),
    website: t.Union([t.String(), t.Null()]),
    jobDescription: t.Union([t.String(), t.Null()]),
    ...auditColumns.properties,
  },
  { additionalProperties: false },
);

export const companyInsertSchema = t.Object(
  {
    name: t.String(),
    abn: t.Optional(t.Union([t.String(), t.Null()])),
    website: t.Optional(t.Union([t.String(), t.Null()])),
    jobDescription: t.Optional(t.Union([t.String(), t.Null()])),
  },
  { additionalProperties: false },
);

export const companyUpdateSchema = t.Object(
  {
    name: t.Optional(t.String()),
    abn: t.Optional(t.Union([t.String(), t.Null()])),
    website: t.Optional(t.Union([t.String(), t.Null()])),
    jobDescription: t.Optional(t.Union([t.String(), t.Null()])),
  },
  { additionalProperties: false },
);
