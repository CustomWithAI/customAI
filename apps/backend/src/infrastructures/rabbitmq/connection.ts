import { config } from "@/config/env";
import { queueLogger } from "@/config/logger";
import amqp from "amqplib";

let connection: amqp.ChannelModel | null = null;
let channel: amqp.Channel | null = null;

export const connectRabbitMQ = async () => {
  if (connection && channel) {
    return { connection, channel };
  }
  try {
    connection = await amqp.connect({
      protocol: "amqp",
      hostname: config.RABBITMQ_HOST,
      port: Number(config.RABBITMQ_PORT),
      username: config.RABBITMQ_USER,
      password: config.RABBITMQ_PASSWORD,
      frameMax: 131072,
    });
    channel = await connection.createChannel();
    queueLogger.info("✅  Connected to RabbitMQ");
    queueLogger.info(
      `🐰  RabbitMQ connection established at ${config.RABBITMQ_HOST}:${config.RABBITMQ_PORT}`
    );

    return { connection, channel };
  } catch (error) {
    console.log(error);
    queueLogger.error("❌  Error connecting to RabbitMQ", error);
    throw error;
  }
};

export const getRabbitMQChannel = async (isAttempting = true) => {
  try {
    if (!connection || !channel) {
      queueLogger.info(
        "🔄  No active RabbitMQ connection, attempting to connect..."
      );
      if (isAttempting) {
        await connectRabbitMQ();
      } else {
        return null;
      }
    }
    return channel;
  } catch (error) {
    queueLogger.error("❌  Failed to get RabbitMQ channel", error);
    throw error;
  }
};
