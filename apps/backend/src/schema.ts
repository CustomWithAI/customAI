// schema.ts
import {
  pgTable,
  serial,
  uuid,
  text,
  timestamp,
  json,
  varchar,
} from "drizzle-orm/pg-core";

// Training Jobs table
export const trainingJobs = pgTable("training_jobs", {
  id: serial("id").primaryKey(),
  modelId: uuid("model_id").notNull().unique(),
  status: text("status").notNull().default("queued"),
  config: json("config").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

// Training Logs table
export const trainingLogs = pgTable("training_logs", {
  id: serial("id").primaryKey(),
  modelId: uuid("model_id").notNull(),
  level: varchar("level", { length: 20 }).notNull().default("info"),
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Export types
export type TrainingJob = typeof trainingJobs.$inferSelect;
export type NewTrainingJob = typeof trainingJobs.$inferInsert;
export type TrainingLog = typeof trainingLogs.$inferSelect;
export type NewTrainingLog = typeof trainingLogs.$inferInsert;
