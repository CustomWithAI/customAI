import { user } from "@/domains/schema/auth";
import { v7 } from "uuid";
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const workflows = pgTable("workflows", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => v7()),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  type: varchar("type", { length: 255 }).notNull(),
  defaultId: varchar("default_id", { length: 255 }),
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
});
