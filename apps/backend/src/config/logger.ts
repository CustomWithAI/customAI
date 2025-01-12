import { createPinoLogger, pino } from "@bogeychan/elysia-logger";
import { config } from "./env";

export const logger = createPinoLogger({
	transport: {
		targets: [
			{
				target: "pino-pretty",
				options: {
					colorize: true,
				},
			},
			{ target: "pino/file" },
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
	// FOR: print all information about api
	// formatters: {
	//   log: (object) => ({
	//     ...object,
	//   }),
	// },
	level: "debug",
	timestamp: pino.stdTimeFunctions.isoTime,
});

export const postgresLogger = logger.child({ service: "postgres" });
export const redisLogger = logger.child({ service: "redis" });
export const queueLogger = logger.child({ service: "queue" });
