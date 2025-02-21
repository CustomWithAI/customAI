import { createPinoLogger, pino } from "@bogeychan/elysia-logger";

export const logger = createPinoLogger({
  transport: {
    targets: [
      {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "dd/mm/yyyy HH:MM:ss",
          ignore: "pid,hostname",
        },
      },
      {
        target: "pino-elasticsearch",
        options: {
          index: "app-log-index",
          node: "http://elasticsearch:9200",
          esVersion: 8,
          flushBytes: 1000,
        },
      },
    ],
  },
  level: "debug",
  timestamp: pino.stdTimeFunctions.isoTime,
});

export const postgresLogger = logger.child({ service: "postgres" });
export const redisLogger = logger.child({ service: "redis" });
export const queueLogger = logger.child({ service: "queue" });
export const s3Logger = logger.child({ service: "s3" });
