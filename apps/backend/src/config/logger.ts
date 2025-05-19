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
      // {
      //   target: "pino-loki",
      //   options: {
      //     host: "http://loki:3100",
      //     labels: {
      //       app: "backend",
      //       environment: process.env.NODE_ENV || "development",
      //     },
      //     batchInterval: 1000,
      //     batchSize: 10000,
      //     json: true,
      //   },
      // },
    ],
  },
  level: "debug",
  timestamp: pino.stdTimeFunctions.isoTime,
});

export const postgresLogger = logger.child({ service: "postgres" });
export const redisLogger = logger.child({ service: "redis" });
export const queueLogger = logger.child({ service: "queue" });
export const s3Logger = logger.child({ service: "s3" });
