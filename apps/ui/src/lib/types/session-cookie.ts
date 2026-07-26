import type {
  RequestEventAction,
  RequestEventLoader,
} from '@builder.io/qwik-city';

export type SessionEvent = RequestEventAction | RequestEventLoader;

export type SessionData = {
  token: string;
  exp: number;
};
