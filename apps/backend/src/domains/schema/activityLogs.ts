import { pgTable, text, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";
import { workflows } from "@/domains/schema/workflows";
import { trainings } from "@/domains/schema/trainings";
import { v7 } from "uuid";

export const activityTypeEnum = pgEnum("type", [
  "training_start",
  "training_pending",
  "training_in_progress",
  "training_complete",
  "training_failed",
  "training_clone",
  "training_delete",
  "training_set_default",
]);

export const activityLogs = pgTable("activity_logs", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => v7()),
  type: activityTypeEnum("type").notNull(),
  version: varchar("version", { length: 255 }).notNull(),
  fromVersion: varchar("from_version", { length: 255 }),
  errorMessage: text("error_message"),
  workflowId: varchar("workflow_id").references(() => workflows.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
