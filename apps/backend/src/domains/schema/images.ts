import { jsonb, pgTable, text } from "drizzle-orm/pg-core";

export const images = pgTable("images", {
	url: text("url").primaryKey(),
	annotation: jsonb("annotation"),
	datasetId: text("datasetId"),
});
