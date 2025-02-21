import { user } from "@/domains/schema/auth";
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { v7 } from "uuid";

export const augmentations = pgTable(
  "augmentations",
  {
    id: varchar("id", { length: 255 })
      .primaryKey()
      .$defaultFn(() => v7()),
    name: varchar("name", { length: 255 }).notNull(),
    data: jsonb("data").notNull(),
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
    uniqueIndex("id_idx").on(table.id),
    index("user_idx").on(table.userId),
  ]
);
