import { getRabbitMQChannel } from "@/infrastructures/rabbitmq/connection";
import { trainingRepository } from "@/config/dependencies";
import { queueLogger } from "@/config/logger";
import { config } from "@/config/env";

const processTraining = async (trainingData: any) => {
  try {
    queueLogger.info(`🚀 Processing training: ${trainingData.queueId}`);

    // ✅ อัปเดตสถานะเป็น `running`
    await trainingRepository.updateStatus(trainingData.id, "running");

    // 🔥 เรียก API ของ Machine Learning Server เพื่อเริ่ม Training (สมมติว่ามี API นี้)
    const response = await fetch("http://ml-server/train", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trainingData),
    });

    if (!response.ok) {
      throw new Error(`Training failed: ${response.statusText}`);
    }

    // ✅ อัปเดตสถานะเป็น `completed`
    await trainingRepository.updateStatus(trainingData.id, "completed");
    queueLogger.info(`✅ Training completed: ${trainingData.queueId}`);
  } catch (error) {
    queueLogger.error(`❌ Training failed: ${trainingData.queueId}`, error);

    // ✅ อัปเดตสถานะเป็น `failed`
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

        // ✅ ลบ Message ออกจาก Queue
        channel.ack(msg);
      }
    },
    { noAck: false }
  );
};
