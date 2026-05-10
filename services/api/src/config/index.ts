const DEFAULT_PORT = 3000;
const DEFAULT_HOST = 'localhost';

const parsePort = (value?: string) => {
  if (!value) return DEFAULT_PORT;

  const port = Number(value);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535');
  }

  return port;
};

const parseCorsOrigin = (value?: string): true | string[] => {
  if (!value) return true;

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
  corsOrigin: true | string[];
};

export const apiEnv: ApiEnv = {
  host: process.env.API_HOST || DEFAULT_HOST,
  port: parsePort(process.env.PORT),
  corsOrigin: parseCorsOrigin(process.env.CORS_ORIGIN),
};
