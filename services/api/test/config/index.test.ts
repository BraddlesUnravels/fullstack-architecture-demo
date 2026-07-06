import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

const originalApiHost = process.env.API_HOST;
const originalCorsOrigin = process.env.CORS_ORIGIN;
const originalPort = process.env.PORT;

const importConfig = async () => {
  vi.resetModules();
  return await import('../../src/config/index');
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
      corsOrigin: true,
      host: 'localhost',
      port: 3000,
    });
  });

  it('should parse API_HOST, PORT, and CORS_ORIGIN when valid values are provided', async () => {
    process.env.API_HOST = 'local-api-host';
    process.env.CORS_ORIGIN = 'https://one.example.com, https://two.example.com';
    process.env.PORT = '4010';

    const { apiEnv } = await importConfig();

    expect(apiEnv).toEqual({
      corsOrigin: ['https://one.example.com', 'https://two.example.com'],
      host: 'local-api-host',
      port: 4010,
    });
  });

  it('should throw an error when PORT is outside valid range', async () => {
    process.env.PORT = '70000';

    await expect(importConfig()).rejects.toThrow('PORT must be an integer between 1 and 65535');
  });

  it('should throw an error when CORS_ORIGIN contains only empty entries', async () => {
    process.env.CORS_ORIGIN = ' , , ';

    await expect(importConfig()).rejects.toThrow('CORS_ORIGIN must contain at least one origin');
  });
});
