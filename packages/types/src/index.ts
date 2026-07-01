import type * as v from 'valibot';

export * from './user';
export * from './company';
export * from './application';
export * from './session';
export * from './auth';

export type GetById = {
  id: string;
};

export type GetByEmail = {
  email: string;
};

export type DeleteResponse = {
  success: boolean;
};

type ResourceSchemas<
  TSelect extends v.GenericSchema,
  TCreate extends v.GenericSchema,
  TUpdate extends v.GenericSchema,
> = {
  select: TSelect;
  insert: TCreate;
  update: TUpdate;
};

export type ResourceTypes<
  T extends ResourceSchemas<v.GenericSchema, v.GenericSchema, v.GenericSchema>,
> = {
  select: v.InferOutput<T['select']>;
  insert: v.InferOutput<T['insert']>;
  update: v.InferOutput<T['update']>;
};
