import { Elysia } from "elysia";
import { config } from "./config/env";
import { logger } from "./config/logger";
import { swaggerConfig } from "./config/swagger";
import { betterAuthView } from "./lib/auth";
import { shutdown } from "./utils/shutdown";

try {
  const app = new Elysia();

  app.use(logger.into());
  app.use(swaggerConfig()).all("/*", betterAuthView);
  app.get("/", () => "hello world").post("/", () => "hello world");

  app.onStop(shutdown);

  process.on("SIGINT", app.stop);
  process.on("SIGTERM", app.stop);

  app.listen(config.APP_PORT);

  logger.info(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
  );
} catch (e) {
  logger.error(e, "Error booting the server");
  process.exit();
}
