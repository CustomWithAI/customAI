import {
  pgTable,
  varchar,
  timestamp,
  integer,
  text,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { v7 } from "uuid";

export const modelInferenceStatusEnum = pgEnum("status", [
  "pending",
  "running",
  "completed",
  "failed",
]);

export type ModelInferenceStatusEnum =
  | "pending"
  | "running"
  | "completed"
  | "failed";

export const modelInferences = pgTable("model_inferences", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => v7()),
  trainingId: varchar("training_id", { length: 255 }),
  modelPath: varchar("model_path", { length: 255 }),
  modelConfig: jsonb("model_config"),
  imagePath: varchar("image_path", { length: 255 }).notNull(),
  annotation: jsonb("annotation"),
  status: modelInferenceStatusEnum("status").default("pending").notNull(),
  queueId: varchar("queue_id", { length: 255 }),
  retryCount: integer("retry_count").default(0).notNull(),
  errorMessage: text("error_message"),
  userId: varchar("user_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
