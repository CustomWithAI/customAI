import { doublePrecision, jsonb, pgTable, text } from "drizzle-orm/pg-core";

export const trainings = pgTable("trainings", {
	id: text().primaryKey(),
	version: doublePrecision(),
	hyperparameter: jsonb(),
	workflowId: text(),
	pipeline: jsonb(),
	datasetId: text(),
	imagePreprocessingId: text(),
	featureExtractionId: text(),
	featureSelectionId: text(),
	augmentationId: text(),
	structureModelId: text(),
	trainedModelUrl: text(),
});
