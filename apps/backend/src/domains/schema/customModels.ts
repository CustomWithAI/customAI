import { jsonb, pgTable, text } from "drizzle-orm/pg-core";

export const customModels = pgTable("custom_models", {
	id: text().primaryKey(),
	data: jsonb(),
	name: text(),
	hyperparameter: jsonb(),
});
