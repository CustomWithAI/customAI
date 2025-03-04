import {
  connectRabbitMQ,
  getRabbitMQChannel,
} from "@/infrastructures/rabbitmq/connection";
import { trainingRepository } from "@/config/dependencies";
import { logger, queueLogger } from "@/config/logger";
import { config } from "@/config/env";
import type { TrainingResponseDto } from "@/domains/dtos/training";
import { retryConnection } from "@/utils/retry";
import { connectRedis } from "@/infrastructures/redis/connection";
import { connectDatabase } from "@/infrastructures/database/connection";
import { connectS3 } from "@/infrastructures/s3/connection";

export const startTrainingWorker = async () => {
  const channel = await getRabbitMQChannel();
  if (!channel) {
    queueLogger.error("❌ RabbitMQ worker failed to start (No channel)");
    return;
  }

  // ✅ Worker Fetch 1 Request Per Round
  await channel.prefetch(1);

  await channel.assertQueue(config.RABBITMQ_TRAINING_QUEUE_NAME, {
    durable: true,
  });

  queueLogger.info("🐰 RabbitMQ worker started, waiting for messages...");

  channel.consume(
    config.RABBITMQ_TRAINING_QUEUE_NAME,
    async (msg) => {
      if (msg) {
        const trainingData = JSON.parse(
          msg.content.toString()
        ) as TrainingResponseDto;

        queueLogger.info(`🚀 Processing training: ${trainingData.queueId}`);

        try {
          // ✅ Update Status Into "running"
          await trainingRepository.updateStatus(trainingData.id, "running");

          // 🔥 Call Python Server API
          const response = await fetch(
            `${config.PYTHON_SERVER_URL}/mock/train`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(trainingData),
            }
          );

          if (!response.ok) {
            throw new Error(`Training failed: ${response.statusText}`);
          }

          // ✅ Update Status Into "completed"
          await trainingRepository.updateStatus(trainingData.id, "completed");
          queueLogger.info(`✅ Training completed: ${trainingData.queueId}`);
        } catch (error) {
          queueLogger.error(
            `❌ Training failed: ${trainingData.queueId}`,
            error
          );

          // ✅ Update Status Into "failed"
          await trainingRepository.updateStatus(trainingData.id, "failed");
        } finally {
          // ✅ Delete Request From Queue
          channel.ack(msg);
        }
      }
    },
    { noAck: false }
  );
};

const startWorker = async () => {
  try {
    logger.info("🔄 Initializing Worker...");

    await connectRedis();
    await retryConnection(connectRabbitMQ, "RabbitMQ", 10);
    await connectDatabase();
    await retryConnection(connectS3, "S3", 10);

    await startTrainingWorker();

    logger.info("🐰 Worker started successfully! 🚀");
  } catch (error) {
    logger.error("❌ Failed to start Worker:", error);
    process.exit(1);
  }
};

startWorker();
