import { user } from "@/domains/schema/auth";
import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";

export const workflows = pgTable("workflows", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }),
  description: varchar("description", { length: 255 }),
  type: varchar("type", { length: 255 }),
  defaultId: uuid("default_id"),
  userId: text("user_id").references(() => user.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
});
