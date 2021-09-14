const success = {
  serverOn: (port: number): string => {
    return `🔥 Sever listening on port: ${port} 🔥`;
  },
  serverExited: ` 🤟 App exited with success 🤟 `,
  database: `Success to start database service`,
  migrate: `Success to execute migrate on database`,
  seed: `Success to execute seed on database`,
};

const error = {
  id: 'id not found',
  name: 'should be have 3/30 characters',
  password:
    ' should be have 6/20 characters and contain numbers uppercase and lowercase letters and characters specials',
  token: 'token invalid',
  serverOn: (error: any): string => {
    return `👁️ App exited with error: ${error} 👁️  `;
  },
  unhandledRejection: (reason: any, promise: any): string => {
    return ` 👁️  App exiting due to an unhandled promise: ${promise} and reason: ${reason}  👁️   `;
  },
  uncaughtException: (error: any): string => {
    return ` 👁️  App exiting due to an uncaught exception: ${error}  👁️   `;
  },
  serverExited: (error: any) => {
    return ` 👁️  App exited with error: ${error}`;
  },
  execulteProcess: (error: undefined) => {
    return ` 👁️   An error occured while execulte process => : ${error}`;
  },
  database: ' Failed to start database service',
  databaseClose: ' Failed to close database service',
  migrate: `Failed to execute migrate on database`,
  seed: `Failed to execute seed on database`,
  function: (name: string) => {
    return ` 👁️ Failed execute function ${name}.`;
  },
  invalidOperation:
    'InvalidOperation: A result cannot be success and contain an error ',
  failingOperation:
    'InvalidOperation: A failing result needs to contain an error message',
  failedResult: 'Cant retrieve the value from a failed result',
  databaseSave: 'Failed execute save  item on database',
  databaseUpdate: 'Failed execute update item on database',
  databaseDelete: 'Failed execute delete item on database',
  databasefind: 'Failed execute find itens on database',
  failedCreatedObject: (error: string): string =>
    `Failed created object ${error}`,
};

export default {
  success,
  error,
};
