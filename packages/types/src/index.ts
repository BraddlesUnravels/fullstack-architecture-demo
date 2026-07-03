import type * as v from 'valibot';

export * from './user';
export * from './company';
export * from './application';
export * from './auth';
export * from './credential';
export * from './redis';

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

export type NullToUndefined<T> = T extends Date
  ? Date
  : T extends null
    ? undefined
    : T extends readonly (infer U)[]
      ? NullToUndefined<U>[]
      : T extends object
        ? { [K in keyof T]: NullToUndefined<T[K]> }
        : T;
