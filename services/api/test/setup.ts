process.env.API_URL = process.env.API_URL ?? 'http://localhost:3000';
process.env.CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:5173';
process.env.DATABASE_URL =
  process.env.DATABASE_URL ??
  'postgres://postgres:postgres@localhost:5432/job_applications';
process.env.EMAIL_PASSWORD =
  process.env.EMAIL_PASSWORD ?? 'test-email-password';
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-jwt-secret';
process.env.LOG_LEVEL = process.env.LOG_LEVEL ?? 'silent';
process.env.NODE_ENV = process.env.NODE_ENV ?? 'test';
