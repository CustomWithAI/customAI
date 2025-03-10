import { jsonb, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { datasets } from "@/domains/schema/datasets";

export const images = pgTable("images", {
  path: varchar("path", { length: 255 }).primaryKey(),
  annotation: jsonb("annotation").notNull(),
  class: varchar("class", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  datasetId: varchar("dataset_id", { length: 255 })
    .notNull()
    .references(() => datasets.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});
