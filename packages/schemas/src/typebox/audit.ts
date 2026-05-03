import { Boolean, Null, Object, String, Union, Integer, Optional } from '@sinclair/typebox';

export const auditColumns = Object(
  {
    createdAt: String({ format: 'date-time' }),
    createdBy: Union([String({ format: 'uuid' }), Null()]),

    updatedAt: String({ format: 'date-time' }),
    updatedBy: Union([String({ format: 'uuid' }), Null()]),

    deletedAt: Union([String({ format: 'date-time' }), Null()]),
    deletedBy: Union([String({ format: 'uuid' }), Null()]),

    isDeleted: Boolean(),

    version: Integer(),
  },
  { additionalProperties: false },
);
