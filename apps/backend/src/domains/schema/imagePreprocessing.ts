import { jsonb, pgTable, text } from "drizzle-orm/pg-core";

export const imagePreprocessing = pgTable("image_preprocessing", {
	id: text().primaryKey(),
	name: text(),
	data: jsonb(),
	userId: text(),
});
