import { createPinoLogger } from "@bogeychan/elysia-logger";

export const logger = createPinoLogger({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
  // FOR: print all information about api
  // formatters: {
  //   log: (object) => ({
  //     ...object,
  //   }),
  // },
  level: "debug",
});

export const postgresLogger = logger.child({ service: "postgres" });
export const redisLogger = logger.child({ service: "redis" });
export const queueLogger = logger.child({ service: "queue" });
