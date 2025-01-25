import { pgEnum, pgTable, varchar, text, uuid } from "drizzle-orm/pg-core";
import { user } from "@/domains/schema/auth";

export const typeEnum = pgEnum("type", ["type1", "type2", "type3"]);

export const workflows = pgTable("workflows", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }),
  description: varchar("description", { length: 255 }),
  type: varchar("type", { length: 255 }),
  defaultId: uuid("default_id"),
  userId: text("user_id").references(() => user.id),
});
