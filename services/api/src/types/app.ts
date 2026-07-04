import type { createApp } from '../app';
import type { Cookie } from 'elysia';

export type App = ReturnType<typeof createApp>;

export type CookieJar = Record<string, Cookie<unknown>>;
