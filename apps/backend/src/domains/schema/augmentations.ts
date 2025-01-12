import { jsonb, pgTable, text } from "drizzle-orm/pg-core";

export const augmentations = pgTable("augmentations", {
	id: text().primaryKey(),
	name: text(),
	data: jsonb(),
	userId: text(),
});
