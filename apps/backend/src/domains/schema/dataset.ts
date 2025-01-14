import { jsonb, pgTable, text } from "drizzle-orm/pg-core";

export const datasets = pgTable("datasets", {
	id: text("id").primaryKey(),
	name: text("name"),
	annotationMethod: text("annotation"),
	splitData: jsonb("splitData"),
	userId: text("userId"),
});
