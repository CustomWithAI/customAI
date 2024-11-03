import { config } from "@/config/env";
import { queueLogger } from "@/config/logger";
import amqp from "amqplib";

let connection: amqp.Connection | null = null;
let channel: amqp.Channel | null = null;

export const connectRabbitMQ = async () => {
  if (connection && channel) {
    return { connection, channel };
  }
  try {
    connection = await amqp.connect(
      `amqp://${config.RABBITMQ_USER}:${config.RABBITMQ_PASSWORD}@${config.RABBITMQ_HOST}:${config.RABBITMQ_PORT}/`
    );
    channel = await connection.createChannel();
    queueLogger.info("✅ Connected to RabbitMQ");
    queueLogger.info(
      `🐰  RabbitMQ connection established at ${config.RABBITMQ_HOST}:${config.RABBITMQ_PORT}`
    );

    return { connection, channel };
  } catch (error) {
    queueLogger.error("❌  Error connecting to RabbitMQ", error);
    throw error;
  }
};

export const getRabbitMQChannel = async () => {
  try {
    if (!connection || !channel) {
      queueLogger.info(
        "🔄  No active RabbitMQ connection, attempting to connect..."
      );
      await connectRabbitMQ();
    }
    return channel;
  } catch (error) {
    queueLogger.error("❌  Failed to get RabbitMQ channel", error);
    throw error;
  }
};
