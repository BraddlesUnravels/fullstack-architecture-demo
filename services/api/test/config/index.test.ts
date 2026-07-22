import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

const originalApiHost = process.env.API_HOST;
const originalCorsOrigin = process.env.CORS_ORIGIN;
const originalPort = process.env.PORT;

const importConfig = async () => {
  vi.resetModules();
  vi.doUnmock('../../src/config/api-constants');
  return await import('../../src/config');
};

const importConfigWithCorsOrigin = async (corsOrigin?: string) => {
  vi.resetModules();
  vi.doMock('../../src/config/api-constants', () => ({
    API_CONSTANTS: {
      env: {
        DEFAULT_HOST: 'localhost',
        DEFAULT_PORT: 4000,
        CORS_ORIGIN: corsOrigin,
      },
    },
  }));

  return await import('../../src/config');
};

describe('config/index', () => {
  beforeEach(() => {
    delete process.env.API_HOST;
    delete process.env.CORS_ORIGIN;
    delete process.env.PORT;
  });

  afterAll(() => {
    process.env.API_HOST = originalApiHost;
    process.env.CORS_ORIGIN = originalCorsOrigin;
    process.env.PORT = originalPort;
  });

  it('should return default host, port, and open CORS when env values are not set', async () => {
    const { apiEnv } = await importConfig();

    expect(apiEnv).toEqual({
      corsOrigin: ['http://localhost:3000'],
      host: 'localhost',
      port: 4000,
    });
  });

  it('should use runtime API_HOST, PORT, and CORS_ORIGIN env values', async () => {
    process.env.API_HOST = 'local-api-host';
    process.env.CORS_ORIGIN =
      'https://one.example.com, https://two.example.com';
    process.env.PORT = '4010';

    const { apiEnv } = await importConfig();

    expect(apiEnv).toEqual({
      corsOrigin: ['https://one.example.com', 'https://two.example.com'],
      host: 'local-api-host',
      port: 4010,
    });
  });

  it('should throw an error when CORS_ORIGIN constant is missing', async () => {
    await expect(importConfigWithCorsOrigin(undefined)).rejects.toThrow(
      'CORS_ORIGIN environment variable is not set',
    );
  });

  it('should throw an error when CORS_ORIGIN constant contains only empty entries', async () => {
    await expect(importConfigWithCorsOrigin(' , , ')).rejects.toThrow(
      'CORS_ORIGIN must contain at least one origin',
    );
  });
});
