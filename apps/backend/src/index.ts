import { enumController } from "@/applications/controllers/enumController";
import { augmentation } from "@/applications/controllers/augmentationController";
import { dataset } from "@/applications/controllers/datasetController";
import { imagePreprocessing } from "@/applications/controllers/imagePreprocessingController";
import { featureExtraction } from "@/applications/controllers/featureExtractionController";
import { featureSelection } from "@/applications/controllers/featureSelectionController";
import { customModel } from "@/applications/controllers/customModelController";
import { workflow } from "@/applications/controllers/workflowController";
import { config } from "@/config/env";
import { logger } from "@/config/logger";
import { swaggerConfig } from "@/config/swagger";
import { connectDatabase } from "@/infrastructures/database/connection";
import { connectRabbitMQ } from "@/infrastructures/rabbitmq/connection";
import { connectRedis } from "@/infrastructures/redis/connection";
import { connectS3 } from "@/infrastructures/s3/connection";
import { betterAuthView } from "@/lib/auth";
import { retryConnection } from "@/utils/retry";
import { shutdown } from "@/utils/shutdown";
import { cors } from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";
import { Elysia } from "elysia";
import { mockTrainingController } from "@/applications/controllers/mockTrainingController";

try {
  logger.info("🏃‍♀️ Starting connection..");
  await connectRedis();
  await retryConnection(connectRabbitMQ, "RabbitMQ", 10);
  await connectDatabase();
  await retryConnection(connectS3, "S3", 10);
  logger.info("🏃‍♀️ Starting server..");

  const app = new Elysia()
    .use(logger.into())
    .use(cors())
    .use(staticPlugin())
    .use(swaggerConfig())
    .use(enumController)
    .use(augmentation)
    .use(dataset)
    .use(imagePreprocessing)
    .use(featureExtraction)
    .use(featureSelection)
    .use(customModel)
    .use(workflow)
    .use(mockTrainingController)
    .onParse(({ request, route }) => {
      if (route.startsWith("/api/auth")) {
        return request.body;
      }
    })
    .all("/api/auth/*", betterAuthView)
    .get("/", () => "CustomAI API")
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
    `🦊  Elysia is running at ${app.server?.hostname}:${app.server?.port}`
  );
} catch (e) {
  logger.error(e, "🚫  Error booting the server");
  process.exit();
}
