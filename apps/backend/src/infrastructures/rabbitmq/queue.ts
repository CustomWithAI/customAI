import { getRabbitMQChannel } from "@/infrastructures/rabbitmq/connection";
import { queueLogger } from "@/config/logger";
import { v7 } from "uuid";
import { config } from "@/config/env";

export const sendToRabbitMQ = async (trainingData: any): Promise<string> => {
  try {
    const channel = await getRabbitMQChannel();
    if (!channel) {
      throw new Error("RabbitMQ channel is not available");
    }

    // ✅ Define Queue If Not Exists
    await channel.assertQueue(config.RABBITMQ_TRAINING_QUEUE_NAME, {
      durable: true, // ✅ Keep Queue Persistent After Restart
    });

    // ✅ Create queueId as UUID
    const queueId = `queue-${v7()}`;

    // ✅ Push queueId into trainingData Before Sending
    const payload = {
      ...trainingData,
      queueId,
    };

    // ✅ Send Training Data Into Queue
    channel.sendToQueue(
      config.RABBITMQ_TRAINING_QUEUE_NAME,
      Buffer.from(JSON.stringify(payload)),
      {
        persistent: true, // ✅ Keep Queue Persistent After Restart
      }
    );

    queueLogger.info(`📩 Training added to queue: ${queueId}`);

    return queueId;
  } catch (error) {
    queueLogger.error("❌ Failed to send training to RabbitMQ", error);
    throw error;
  }
};
