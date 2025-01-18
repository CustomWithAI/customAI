import { jsonb, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { user } from "@/domains/schema/auth";

export const datasets = pgTable("datasets", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }),
  annotationMethod: varchar("annotation", { length: 255 }),
  splitData: jsonb("splitData"),
  userId: text("userId").references(() => user.id),
});
