import { config } from "@/config/env";
import { redisLogger } from "@/config/logger";
import { createClient } from "redis";

export const redis = createClient({
  url: `redis://${config.REDIS_HOST}:${config.REDIS_PORT}/${
    config.REDIS_DB_INDEX || 0
  }`,
});

export const redisLogs = createClient({
  url: `redis://${config.REDIS_HOST}:${config.REDIS_PORT}/${
    config.REDIS_LOG_INDEX || 1
  }`,
});

redis.on("error", (error) => {
  redisLogger.error(`❌  Redis client error: ${JSON.stringify(error)}`);
});

redisLogs.on("error", (error) => {
  redisLogger.error(`❌  Redis Logs client error: ${JSON.stringify(error)}`);
});

export const connectRedis = async (): Promise<void> => {
  try {
    await redis.connect();
    redisLogger.info("✅  Connect redis success");
  } catch (e) {
    redisLogger.error(
      `❌  Connect redis (redis://${config.REDIS_HOST}:${config.REDIS_PORT}/${
        config.REDIS_DB_INDEX || 0
      }) failed: ${e}`,
      e
    );
  }
};

export const connectRedisLogs = async (): Promise<void> => {
  try {
    await redisLogs.connect();
    redisLogger.info("✅  Connect redis logs success");
  } catch (e) {
    redisLogger.error(
      `❌  Connect redis (redis://${config.REDIS_HOST}:${config.REDIS_PORT}/${
        config.REDIS_LOG_INDEX || 1
      }) failed: ${e}`,
      e
    );
  }
};
