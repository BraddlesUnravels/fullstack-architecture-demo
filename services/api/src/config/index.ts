import { API_CONSTANTS } from './api-constants';
export { API_CONSTANTS };

const {
  DEFAULT_HOST,
  DEFAULT_PORT,
  CORS_ORIGIN: DEFAULT_CORS_ORIGIN,
} = API_CONSTANTS.env;

const parsePort = (value?: string): number => {
  if (!value) return DEFAULT_PORT;

  const parsedPort = Number(value);

  if (!Number.isInteger(parsedPort) || parsedPort <= 0) {
    throw new Error('PORT must be a positive integer');
  }

  return parsedPort;
};

const parseCorsOrigin = (value?: string): string[] => {
  if (!value) throw new Error('CORS_ORIGIN environment variable is not set');

  const origins = value
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  if (origins.length === 0) {
    throw new Error('CORS_ORIGIN must contain at least one origin');
  }

  return origins;
};

export type ApiEnv = {
  host: string;
  port: number;
  corsOrigin: string[];
};

const host = process.env.API_HOST ?? DEFAULT_HOST;
const port = parsePort(process.env.PORT);
const corsOrigin = parseCorsOrigin(
  process.env.CORS_ORIGIN ?? DEFAULT_CORS_ORIGIN,
);

export const apiEnv: ApiEnv = {
  host,
  port,
  corsOrigin,
};
