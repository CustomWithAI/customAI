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

  // Redis Configuration
  REDIS_HOST: z.string().default("redis"),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DBINDEX: z.string().optional(),

  APP_VERSION: z.string().default(packageJson.version),
});

export const config = envSchema.parse(process.env);
