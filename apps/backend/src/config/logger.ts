import { createPinoLogger, pino } from "@bogeychan/elysia-logger";

export const logger = createPinoLogger({
	transport: {
		target: "pino-pretty",
		options: {
			colorize: true,
		},
	},
	timestamp: pino.stdTimeFunctions.isoTime,
	level: "debug",
});

export const postgresLogger = logger.child({ service: "postgres" });
export const queueLogger = logger.child({ service: "queue" });
