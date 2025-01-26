import { config } from "@/config/env";
import { logger } from "@/config/logger";
import { swaggerConfig } from "@/config/swagger";
import { connectDatabase } from "@/infrastructures/database/connection";
import { connectRabbitMQ } from "@/infrastructures/rabbitmq/connection";
import { connectRedis } from "@/infrastructures/redis/connection";
import { connectS3 } from "@/infrastructures/s3/connection";
import { betterAuthView } from "@/lib/auth";
import { userMiddleware } from "@/middleware/authMiddleware";
import { shutdown } from "@/utils/shutdown";
import { cors } from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";
import { Elysia } from "elysia";

try {
	logger.info("🏃‍♀️ Starting connection..");
	await connectRedis();
	await connectRabbitMQ();
	await connectDatabase();
	await connectS3();
	logger.info("🏃‍♀️ Starting server..");

	const app = new Elysia()
		.derive(({ request }) => userMiddleware(request))
		.use(logger.into())
		.use(cors())
		.use(staticPlugin())
		.use(swaggerConfig())
		.onParse(({ request, route }) => {
			if (route.startsWith("/api/auth")) {
				return request.body;
			}
		})
		.all("/api/auth/*", betterAuthView)
		.get("/", () => "hello world")
		.post("/", () => "hello world")
		.get("/route-count", () => {
			const routeCount = Object.keys(app.routes).length;
			const routeLength = app.routes.length;
			return { routes: routeCount, length: routeLength };
		})
		.onStop(shutdown)
		.listen(config.APP_PORT);

	process.on("SIGINT", app.stop);
	process.on("SIGTERM", app.stop);

	logger.info(
		`🦊  Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
	);
} catch (e) {
	logger.error(e, "🚫  Error booting the server");
	process.exit();
}
