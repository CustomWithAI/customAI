import { logger, postgresLogger, redisLogger } from "@/config/logger";
import { pool } from "@/infrastructures/database/connection";
import { redis } from "@/infrastructures/redis/connection";

export const shutdown = async (): Promise<void> => {
  logger.warn("Shutting down ( 2 seconds ) ...");
  await pool
    .end()
    .then(() => postgresLogger.warn("✅  Shutdown postgres success"))
    .catch((e) =>
      postgresLogger.error(`❌  Shutdown postgres failed: ${JSON.stringify(e)}`)
    );
  await redis
    .disconnect()
    .then(() => redisLogger.warn("✅  Shutdown redis success"));
  logger.info("🔒  Shutdown success");
  process.exit();
};
