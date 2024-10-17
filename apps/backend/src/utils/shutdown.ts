import { logger, postgresLogger } from "@/config/logger";
import { pool } from "@/infrastructures/database/connection";

export const shutdown = (): void => {
  logger.warn("Shutting down ( 2 seconds ) ...");
  pool
    .end()
    .then(() => postgresLogger.warn("✅  Shutdown postgres success"))
    .catch((e) =>
      postgresLogger.error(`❌  Shutdown postgres failed: ${JSON.stringify(e)}`)
    );
  setTimeout((): void => {
    logger.warn("✅  Shutdown success");
    process.exit();
  }, 2000);
};
