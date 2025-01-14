import { jsonb, pgTable, text } from "drizzle-orm/pg-core";

export const customModels = pgTable("custom_models", {
	id: text("id").primaryKey(),
	data: jsonb("data"),
	name: text("name"),
	hyperparameter: jsonb("hyperparameter"),
});
