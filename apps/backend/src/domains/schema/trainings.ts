import { doublePrecision, jsonb, pgTable, text } from "drizzle-orm/pg-core";

export const trainings = pgTable("trainings", {
	id: text("id").primaryKey(),
	version: doublePrecision("version"),
	hyperparameter: jsonb("hyperparameter"),
	workflowId: text("workflowId"),
	pipeline: jsonb("pipeline"),
	datasetId: text("datasetId"),
	imagePreprocessingId: text("imagePreprocessingId"),
	featureExtractionId: text("featureExtractionId"),
	featureSelectionId: text("featureSelectionId"),
	augmentationId: text("augmentationId"),
	structureModelId: text("structureModelId"),
	trainedModelUrl: text("trainedModelUrl"),
});
