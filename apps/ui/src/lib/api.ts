import { treaty } from '@elysia/eden';
import type { App } from '@app/api/types';
const DEFAULT_API_URL = 'http://localhost:4000';

const nodeApiUrl = typeof process !== 'undefined' ? process.env.API_URL : undefined;
const serverApiUrl = nodeApiUrl || import.meta.env.API_URL || DEFAULT_API_URL;
const apiBaseUrl = import.meta.env.SSR ? serverApiUrl : '/api';

export const api = (sid?: string) =>
  treaty<App>(apiBaseUrl, {
    headers: sid ? { cookie: `sid=${sid}` } : undefined,
  });
