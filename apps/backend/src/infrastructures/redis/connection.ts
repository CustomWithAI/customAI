import { config } from "@/config/env";
import { redisLogger } from "@/config/logger";
import { createClient } from "redis";

export const redis = createClient({
  url: `redis://${config.REDIS_HOST}:${config.REDIS_PORT}/${
    config.REDIS_DBINDEX || 0
  }`,
});

redis.on("error", (error) => {
  redisLogger.error(`❌  Redis client error: ${JSON.stringify(error)}`);
});

export const connectRedis = async (): Promise<void> => {
  try {
    await redis.connect();
    redisLogger.info("✅  Connect redis success");
  } catch (e) {
    redisLogger.error(
      `❌  Connect redis (redis://${config.REDIS_HOST}:${config.REDIS_PORT}/${
        config.REDIS_DBINDEX || 0
      }) failed: ${e}`,
      e
    );
  }
};
