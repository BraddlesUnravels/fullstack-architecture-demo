import type { Static, TSchema } from 'elysia';
export * from './user';
export * from './company';
export * from './application';
export * from './session';

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
