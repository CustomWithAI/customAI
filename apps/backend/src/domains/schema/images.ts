import { jsonb, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { datasets } from "@/domains/schema/datasets";

export const images = pgTable("images", {
  path: varchar("path", { length: 255 }).primaryKey(),
  annotation: jsonb("annotation"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  datasetId: varchar("dataset_id", { length: 255 }).references(
    () => datasets.id,
    {
      onDelete: "cascade",
      onUpdate: "cascade",
    }
  ),
});
