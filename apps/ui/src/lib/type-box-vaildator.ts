import { TypeCompiler } from '@sinclair/typebox/compiler';
import type { TSchema, Static } from '@sinclair/typebox';
import type { DataValidator } from '@builder.io/qwik-city';

export const typeBoxValidator = <T extends TSchema>(
  schema: T,
): DataValidator<{ fieldErrors: Partial<Record<keyof Static<T> | 'global', string>> }> => {
  const compile = TypeCompiler.Compile(schema);

  return {
    validate: (_event: unknown, data: unknown) => {
      if (compile.Check(data)) {
        return Promise.resolve({
          success: true as const,
          data,
        });
      }

      const fieldErrors: Partial<Record<keyof Static<T> | 'global', string>> = {};

      for (const error of compile.Errors(data)) {
        const path = error.path.split('/').filter(Boolean)[0];

        if (!path) {
          fieldErrors.global = error.message;
          continue;
        }

        const key = path as keyof Static<T>;
        if (fieldErrors[key]) continue;

        fieldErrors[key] = error.message;
      }

      if (Object.keys(fieldErrors).length === 0) {
        fieldErrors.global = 'Request data is invalid';
      }

      return Promise.resolve({
        success: false as const,
        error: {
          fieldErrors,
        },
      });
    },
  };
};
