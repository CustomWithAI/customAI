import { jsonb, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { user } from "@/domains/schema/auth";

export const featureExtractions = pgTable("feature_extractions", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }),
  data: jsonb("data"),
  userId: text("user_id").references(() => user.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
});
