import killPort from 'kill-port';
import { apiEnv } from '../config';

const NO_PROCESS_ERROR_MESSAGE = 'No process running on port';

const toErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return String(error);
};

const isNoProcessError = (error: unknown) => {
  const message = toErrorMessage(error);
  return message.includes(NO_PROCESS_ERROR_MESSAGE);
};

const stopApi = async () => {
  try {
    await killPort(apiEnv.port, 'tcp');
  } catch (err) {
    if (isNoProcessError(err)) {
      console.log(`[api] No process is listening on port ${apiEnv.port}`);
      return;
    }

    throw new Error(`Failed to stop process on port ${apiEnv.port}: ${toErrorMessage(err)}`, {
      cause: err,
    });
  }

  console.log(`[api] Stopped process on port ${apiEnv.port}`);
};

try {
  await stopApi();
} catch {
  process.exit(1);
}
