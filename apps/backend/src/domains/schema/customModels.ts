import {
  jsonb,
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { user } from "@/domains/schema/auth";
import { sql } from "drizzle-orm";

export const customModels = pgTable("custom_models", {
  id: uuid("id").defaultRandom().primaryKey(),
  data: jsonb("data"),
  name: varchar("name", { length: 255 }),
  hyperparameter: jsonb("hyperparameter"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  userId: text("user_id").references(() => user.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
});
