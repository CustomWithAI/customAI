import { sql } from "drizzle-orm";
import { jsonb, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { datasets } from "@/domains/schema/datasets";

export const images = pgTable("images", {
  url: varchar("url", { length: 255 }).primaryKey(),
  annotation: jsonb("annotation"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  datasetId: uuid("dataset_id").references(() => datasets.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
});
