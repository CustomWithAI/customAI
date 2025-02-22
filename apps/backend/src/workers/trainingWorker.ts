import { getRabbitMQChannel } from "@/infrastructures/rabbitmq/connection";
import { trainingRepository } from "@/config/dependencies";
import { queueLogger } from "@/config/logger";
import { config } from "@/config/env";

const processTraining = async (trainingData: any) => {
  try {
    queueLogger.info(`🚀 Processing training: ${trainingData.queueId}`);

    // ✅ Change status into `running`
    await trainingRepository.updateStatus(trainingData.id, "running");

    // 🔥 Call Machine Learning Server API For Training
    const response = await fetch(config.PYTHON_SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trainingData),
    });

    if (!response.ok) {
      throw new Error(`Training failed: ${response.statusText}`);
    }

    // ✅ Update status into `completed`
    await trainingRepository.updateStatus(trainingData.id, "completed");
    queueLogger.info(`✅ Training completed: ${trainingData.queueId}`);
  } catch (error) {
    queueLogger.error(`❌ Training failed: ${trainingData.queueId}`, error);

    // ✅ Update status into `failed`
    await trainingRepository.updateStatus(trainingData.id, "failed");
  }
};

export const startTrainingWorker = async () => {
  const channel = await getRabbitMQChannel();
  if (!channel) {
    queueLogger.error("❌ RabbitMQ worker failed to start (No channel)");
    return;
  }

  await channel.assertQueue(config.RABBITMQ_TRAINING_QUEUE_NAME, {
    durable: true,
  });

  queueLogger.info("🐰 RabbitMQ worker started, waiting for messages...");

  channel.consume(
    config.RABBITMQ_TRAINING_QUEUE_NAME,
    async (msg) => {
      if (msg) {
        const trainingData = JSON.parse(msg.content.toString());
        await processTraining(trainingData);

        // ✅ Delete Message From Queue
        channel.ack(msg);
      }
    },
    { noAck: false }
  );
};
