import { jsonb, pgTable, text } from "drizzle-orm/pg-core";

export const images = pgTable("images", {
	url: text().primaryKey(),
	annotation: jsonb(),
	datasetId: text(),
});
