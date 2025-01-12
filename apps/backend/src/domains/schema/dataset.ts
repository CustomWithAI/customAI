import { jsonb, pgTable, text } from "drizzle-orm/pg-core";

export const datasets = pgTable("datasets", {
	id: text().primaryKey(),
	name: text(),
	annotationMethod: text(),
	splitData: jsonb(),
	userId: text(),
});
