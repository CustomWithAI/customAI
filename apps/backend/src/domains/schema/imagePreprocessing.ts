import { jsonb, pgTable, text } from "drizzle-orm/pg-core";

export const imagePreprocessing = pgTable("image_preprocessing", {
	id: text("id").primaryKey(),
	name: text("name"),
	data: jsonb("data"),
	userId: text("userId"),
});
