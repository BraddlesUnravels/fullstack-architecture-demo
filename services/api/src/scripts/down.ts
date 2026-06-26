import { apiEnv } from '../config';

const parseProcessIds = (input: string) => {
  return input
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
};

const getProcessIdsByPort = async (port: number) => {
  const output = await Bun.$`lsof -nP -iTCP:${port} -sTCP:LISTEN -t`.quiet().text();

  return parseProcessIds(output);
};

const stopProcesses = async (processIds: string[]) => {
  await Promise.all(
    processIds.map((processId) => {
      return Bun.$`kill -TERM ${processId}`.quiet();
    }),
  );
};

const stopApi = async () => {
  const processIds = await getProcessIdsByPort(apiEnv.port);

  if (processIds.length === 0) {
    console.log(`[api] No process is listening on port ${apiEnv.port}`);
    return;
  }

  await stopProcesses(processIds);

  console.log(`[api] Stopped process on port ${apiEnv.port}`);
};

await stopApi();
