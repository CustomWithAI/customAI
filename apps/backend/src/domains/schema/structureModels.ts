import { jsonb, pgTable, text } from "drizzle-orm/pg-core";

export const structureModels = pgTable("structure_models", {
	id: text("id").primaryKey(),
	preTrainModel: jsonb("preTrainModel"),
	customModelId: text("customModelId"),
	userId: text("userId"),
});
