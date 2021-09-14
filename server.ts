import { main } from './src';
import { logger, msg } from './src/shared';
import './src/util/module-alias';

enum ExitStatus {
  Failure = 1,
  Success = 0,
}

process.on('unhandledRejection', (reason, promise) => {
  logger.error(msg.error.unhandledRejection(reason, promise));
  throw reason;
});

process.on('uncaughtException', (error) => {
  logger.error(msg.error.uncaughtException(error));
  process.exit(ExitStatus.Failure);
});

(async (): Promise<void> => {
  try {
    main();
    const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
    for (const exitSignal of exitSignals) {
      process.on(exitSignal, async () => {
        try {
          logger.info(msg.success.serverExited);
          process.exit(ExitStatus.Success);
        } catch (error) {
          logger.error(msg.error.serverExited(error));
          process.exit(ExitStatus.Failure);
        }
      });
    }
  } catch (error) {
    logger.error(msg.error.serverExited(error));
    process.exit(ExitStatus.Failure);
  }
})();
