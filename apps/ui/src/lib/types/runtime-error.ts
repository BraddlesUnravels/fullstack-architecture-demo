export type RuntimeError = {
  readonly name: string;
  readonly message: string;
  readonly code?: string;
  readonly stack?: string;
  readonly cause?: unknown;
  readonly metadata?: Record<string, unknown>;
};
