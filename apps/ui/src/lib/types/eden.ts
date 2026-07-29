import type { UiProblem } from './ui-problem';

export type EdenError = {
  status: number;
  value: unknown;
};

export type EdenResultLike<T> = {
  data: T | null;

  status: number;
  response: Response;
};

export type ApiResult<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      problem: UiProblem;
    };
