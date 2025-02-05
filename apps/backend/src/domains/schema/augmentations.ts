import { user } from "@/domains/schema/auth";
import { v7 } from "uuid";
import { jsonb, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const augmentations = pgTable("augmentations", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => v7()),
  name: varchar("name", { length: 255 }),
  data: jsonb("data"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});
