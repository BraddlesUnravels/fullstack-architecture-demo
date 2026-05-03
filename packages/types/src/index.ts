import { Static, TSchema } from '@sinclair/typebox';
export * from './user';
export * from './company';
export * from './application';

type ResourceSchemas<TSelect extends TSchema, TCreate extends TSchema, TUpdate extends TSchema> = {
  select: TSelect;
  insert: TCreate;
  update: TUpdate;
};

export type ResourceTypes<T extends ResourceSchemas<TSchema, TSchema, TSchema>> = {
  select: Static<T['select']>;
  insert: Static<T['insert']>;
  update: Static<T['update']>;
};
