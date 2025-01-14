import { jsonb, pgTable, text } from "drizzle-orm/pg-core";

export const augmentations = pgTable("augmentations", {
	id: text("id").primaryKey(),
	name: text("name"),
	data: jsonb("data"),
	userId: text("userId"),
});
