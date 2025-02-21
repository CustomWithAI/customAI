import { z } from "zod";
import packageJson from "../../package.json";

const toggle = z
  .enum(["true", "false", "0", "1"])
  .transform((v) => v === "true" || v === "1");

const envSchema = z.object({
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string().url(),
  BETTER_AUTH_TRUSTED_ORIGINS: z.string(),
  ENABLE_SWAGGER: z
    .string()
    .refine((s) => s === "true" || s === "false")
    .transform((s) => s === "true"),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  APP_PORT: z.coerce.number().default(4000),

  // PostgreSQL Configuration
  POSTGRES_HOST: z.string().default("postgres"),
  POSTGRES_LOCAL_HOST: z.string().default("127.0.0.1"),
  POSTGRES_PORT: z.coerce.number().default(5432),
  POSTGRES_DB: z.string().default("app"),
  POSTGRES_USER: z.string().default("user"),
  POSTGRES_PASSWORD: z.string().optional(),
  DATABASE_DEBUG: toggle.default("false"),

  // RabbitMQ Configuration
  RABBITMQ_HOST: z.string().default("rabbitmq"),
  RABBITMQ_PORT: z.coerce.number().default(5672),
  RABBITMQ_USER: z.string().optional(),
  RABBITMQ_PASSWORD: z.string().optional(),
  RABBITMQ_TRAINING_QUEUE_NAME: z.string().default("training_queue"),

  // Redis Configuration
  REDIS_HOST: z.string().default("redis"),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB_INDEX: z.string().optional(),

  // elasticsearch
  ELASTICSEARCH_URL: z.string().default("http://localhost"),
  ELASTICSEARCH_PORT: z.coerce.number().default(9200),
  ELASTICSEARCH_FULL_URL: z.string().optional(),

  // S3 Bucket
  AWS_ACCESS_KEY_ID: z.string().default("test"),
  AWS_SECRET_ACCESS_KEY: z.string().default("test"),
  AWS_REGION: z.string().default("us-east-1"),
  S3_BUCKET_NAME: z.string().default("my-bucket"),
  S3_ENDPOINT: z.string().url().default("http://localstack:4566"),
  S3_DEVELOPMENT_ENDPOINT: z.string().url().default("http://localhost:4566"),

  // Python Server
  MAX_RETRY_COUNT: z.number().default(3),

  APP_VERSION: z.string().default(packageJson.version),
});

export const config = envSchema.parse(process.env);
