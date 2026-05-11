import { treaty } from '@elysia/eden';
import type { App } from '@app/api/types';
const DEFAULT_API_URL = 'http://localhost:3000';

const serverApiUrl = import.meta.env.API_URL || DEFAULT_API_URL;
const apiBaseUrl = import.meta.env.SSR ? serverApiUrl : '/api';

export const api = treaty<App>(apiBaseUrl);
