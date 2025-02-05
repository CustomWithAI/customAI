import { user } from "@/domains/schema/auth";
import { v7 } from "uuid";
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const workflows = pgTable("workflows", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => v7()),
  name: varchar("name", { length: 255 }),
  description: varchar("description", { length: 255 }),
  type: varchar("type", { length: 255 }),
  defaultId: varchar("default_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  userId: text("user_id").references(() => user.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
});
