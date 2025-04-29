import { config } from "@/config/env";
import { queueLogger } from "@/config/logger";
import { getRabbitMQChannel } from "@/infrastructures/rabbitmq/connection";
import { v7 } from "uuid";

export const sendToRabbitMQ = async (
  trainingData: any,
  type: "training" | "inference"
): Promise<{ queueId: string; messagePending: number }> => {
  try {
    const channel = await getRabbitMQChannel();
    if (!channel) {
      throw new Error("RabbitMQ channel is not available");
    }

    // ✅ Define Queue If Not Exists
    const queueInfo = await channel.assertQueue(
      config.RABBITMQ_TRAINING_QUEUE_NAME,
      {
        durable: true,
      }
    );

    queueLogger.info(
      `📊 Queue status for ${config.RABBITMQ_TRAINING_QUEUE_NAME}: ${queueInfo.messageCount} messages pending, ${queueInfo.consumerCount} consumers connected`
    );

    const queueId = `queue-${v7()}`;

    // ✅ Push queueId into trainingData Before Sending
    const payload = {
      type,
      data: {
        ...trainingData,
        queueId,
      },
    };

    // ✅ Send Training Data Into Queue
    channel.sendToQueue(
      config.RABBITMQ_TRAINING_QUEUE_NAME,
      Buffer.from(JSON.stringify(payload)),
      {
        persistent: true,
      }
    );

    queueLogger.info(`📩 Training added to queue: ${queueId}`);

    return { queueId, messagePending: queueInfo.messageCount };
  } catch (error) {
    queueLogger.error("❌ Failed to send training to RabbitMQ", error);
    throw error;
  }
};
