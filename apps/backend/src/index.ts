import { staticPlugin } from "@elysiajs/static";
import { Elysia } from "elysia";
import { config } from "./config/env";
import { logger } from "./config/logger";
import { swaggerConfig } from "./config/swagger";
import { connectDatabase } from "./infrastructures/database/connection";
import { connectRabbitMQ } from "./infrastructures/rabbitmq/connection";
import { connectRedis } from "./infrastructures/redis/connection";
import { betterAuthView } from "./lib/auth";
import { shutdown } from "./utils/shutdown";

try {
	logger.info("🏃‍♀️ starting connection..");
	await connectRedis();
	await connectRabbitMQ();
	await connectDatabase();
	logger.info("🏃‍♀️ starting server..");

	const app = new Elysia();

	app.use(logger.into());
	app.use(staticPlugin());
	app.use(swaggerConfig()).all("/*", betterAuthView);
	app.get("/", () => "hello world").post("/", () => "hello world");
	app.get("/route-count", () => {
		const routeCount = Object.keys(app.routes).length;
		const routeLength = app.routes.length;
		return { routes: routeCount, length: routeLength };
	});
	app.onStop(shutdown);

	process.on("SIGINT", app.stop);
	process.on("SIGTERM", app.stop);
	app.listen(config.APP_PORT);

	logger.info(
		`🦊  Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
	);
} catch (e) {
	logger.error(e, "🚫  Error booting the server");
	process.exit();
}
