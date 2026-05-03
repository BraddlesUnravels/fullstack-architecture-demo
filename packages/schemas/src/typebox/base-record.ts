import { Boolean, Null, Object, String, Union } from '@sinclair/typebox';

export const recordBase = Object(
  {
    createdAt: String({ format: 'date-time' }),
    createdBy: String({ format: 'uuid' }),

    updatedAt: String({ format: 'date-time' }),
    updatedBy: Union([String({ format: 'uuid' }), Null()]),

    deletedAt: Union([String({ format: 'date-time' }), Null()]),
    deletedBy: Union([String({ format: 'uuid' }), Null()]),

    isDeleted: Boolean({ default: false }),
  },
  { additionalProperties: false },
);
