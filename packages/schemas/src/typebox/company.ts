import { Null, Object, Optional, String, Union } from '@sinclair/typebox';
import { recordBase } from './base-record';

export const companySelectSchema = Object(
  {
    id: String({ format: 'uuid' }),
    name: String(),
    abn: Union([String(), Null()]),
    website: Union([String(), Null()]),
    jobDescription: Union([String(), Null()]),
    ...recordBase.properties,
  },
  { additionalProperties: false },
);

export const companyInsertSchema = Object(
  {
    name: String(),
    abn: Optional(Union([String(), Null()])),
    website: Optional(Union([String(), Null()])),
    jobDescription: Optional(Union([String(), Null()])),
  },
  { additionalProperties: false },
);

export const companyUpdateSchema = Object(
  {
    name: Optional(String()),
    abn: Optional(Union([String(), Null()])),
    website: Optional(Union([String(), Null()])),
    jobDescription: Optional(Union([String(), Null()])),
  },
  { additionalProperties: false },
);
