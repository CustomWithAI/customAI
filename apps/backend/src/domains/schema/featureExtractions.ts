import { jsonb, pgTable, text } from "drizzle-orm/pg-core";

export const featureExtractions = pgTable("feature_extractions", {
	id: text().primaryKey(),
	name: text(),
	data: jsonb(),
	userId: text(),
});
