import { jsonb, pgTable, text } from "drizzle-orm/pg-core";

export const structureModels = pgTable("structure_models", {
	id: text().primaryKey(),
	preTrainModel: jsonb(),
	customModelId: text(),
	userId: text(),
});
