import { user } from "@/domains/schema/auth";
import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { v7 } from "uuid";

export const datasets = pgTable(
  "datasets",
  {
    id: varchar("id", { length: 255 })
      .primaryKey()
      .$defaultFn(() => v7()),
    name: varchar("name", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }).notNull(),
    annotationMethod: varchar("annotation_method", { length: 255 }).notNull(),
    train: integer("train"),
    test: integer("test"),
    valid: integer("valid"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => [
    uniqueIndex("id_dataset_idx").on(table.id),
    index("idx_dataset_created_at").on(table.createdAt),
    index("user_dataset_idx").on(table.userId),
  ]
);
