import {
  doublePrecision,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { workflows } from "@/domains/schema/workflows";
import { datasets } from "@/domains/schema/datasets";
import { imagePreprocessings } from "@/domains/schema/imagePreprocessings";
import { featureExtractions } from "@/domains/schema/featureExtractions";
import { featureSelections } from "@/domains/schema/featureSelections";
import { augmentations } from "@/domains/schema/augmentations";
import { structureModels } from "@/domains/schema/structureModels";

export const trainings = pgTable("trainings", {
  id: text("id").primaryKey(),
  version: doublePrecision("version"),
  hyperparameter: jsonb("hyperparameter"),
  workflowId: text("workflowId").references(() => workflows.id),
  pipeline: jsonb("pipeline"),
  datasetId: text("datasetId").references(() => datasets.id),
  imagePreprocessingId: text("imagePreprocessingId").references(
    () => imagePreprocessings.id
  ),
  featureExtractionId: text("featureExtractionId").references(
    () => featureExtractions.id
  ),
  featureSelectionId: text("featureSelectionId").references(
    () => featureSelections.id
  ),
  augmentationId: text("augmentationId").references(() => augmentations.id),
  structureModelId: text("structureModelId").references(
    () => structureModels.id
  ),
  trainedModelUrl: text("trainedModelUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
