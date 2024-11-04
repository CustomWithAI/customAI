import {
  logger,
  postgresLogger,
  queueLogger,
  redisLogger,
} from "@/config/logger";
import { pool } from "@/infrastructures/database/connection";
import { getRabbitMQChannel } from "@/infrastructures/rabbitmq/connection";
import { redis } from "@/infrastructures/redis/connection";

export const shutdown = async (): Promise<void> => {
  logger.warn("Shutting down server...");
  await pool
    .end()
    .then(() => postgresLogger.info("✅  Shutdown postgres success"))
    .catch((e) =>
      postgresLogger.error(`❌  Shutdown postgres failed: ${JSON.stringify(e)}`)
    );
  await redis
    .disconnect()
    .then(() => redisLogger.info("✅  Shutdown redis success"))
    .catch((e) =>
      redisLogger.error(`❌  Shutdown redis failed: ${JSON.stringify(e)}`)
    );
  const channel = await getRabbitMQChannel(false);
  if (channel) {
    await channel
      ?.close()
      .then(() => queueLogger.info("✅  Shutdown rabbitmq success"))
      .catch((e) =>
        queueLogger.error(`❌  Shutdown rabbitmq failed: ${JSON.stringify(e)}`)
      );
  }
  logger.info("🔒  Shutdown success");
  process.exit();
};
