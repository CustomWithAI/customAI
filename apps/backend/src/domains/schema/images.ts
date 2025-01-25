import { jsonb, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { datasets } from "@/domains/schema/datasets";

export const images = pgTable("images", {
  url: varchar("url", { length: 255 }).primaryKey(),
  annotation: jsonb("annotation"),
  datasetId: uuid("dataset_id").references(() => datasets.id),
});
