import { createClient } from "redis";
import { logService } from "@/config/dependencies";
import { logger } from "@/config/logger";
import {
  connectRedisLogs,
  redisLogs,
} from "@/infrastructures/redis/connection";
import { connectDatabase } from "@/infrastructures/database/connection";
import { config } from "@/config/env";

const handleLogMessage = async (message: string, trainingId: string) => {
  try {
    await logService.createLog({ data: message, trainingId });
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`Failed to log training data: ${e.message}`);
    }
  }
};

export const startLogWorker = async () => {
  const subscriber = createClient({ url: redisLogs.options?.url });

  await subscriber.connect();

  await subscriber.subscribe(config.REDIS_LOG_CHANNEL, (message: string) => {
    const payload = JSON.parse(message);
    handleLogMessage(payload.data, payload.trainingId).catch((err) => {
      if (err instanceof Error) {
        logger.error(err.message);
      }
    });
  });
};

const startWorker = async () => {
  try {
    logger.info("🔄 Initializing Worker...");

    await connectRedisLogs();
    await connectDatabase();

    await startLogWorker();

    logger.info("🐰 Log Worker started successfully! 🚀");
  } catch (error) {
    logger.error("❌ Failed to start log worker:", error);
    process.exit(1);
  }
};

startWorker();
