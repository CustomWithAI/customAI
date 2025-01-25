import {
  doublePrecision,
  jsonb,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { workflows } from "@/domains/schema/workflows";
import { datasets } from "@/domains/schema/datasets";
import { imagePreprocessings } from "@/domains/schema/imagePreprocessings";
import { featureExtractions } from "@/domains/schema/featureExtractions";
import { featureSelections } from "@/domains/schema/featureSelections";
import { augmentations } from "@/domains/schema/augmentations";
import { customModels } from "@/domains/schema/customModels";

export const trainings = pgTable("trainings", {
  id: uuid("id").defaultRandom().primaryKey(),
  version: doublePrecision("version").default(0.0),
  hyperparameter: jsonb("hyperparameter"),
  workflowId: uuid("workflow_id").references(() => workflows.id),
  pipeline: jsonb("pipeline"),
  datasetId: uuid("dataset_id").references(() => datasets.id),
  imagePreprocessingId: uuid("image_preprocessing_id").references(
    () => imagePreprocessings.id
  ),
  featureExtractionId: uuid("feature_extraction_id").references(
    () => featureExtractions.id
  ),
  featureSelectionId: uuid("feature_selection_id").references(
    () => featureSelections.id
  ),
  augmentationId: uuid("augmentation_id").references(() => augmentations.id),
  preTrainedModel: jsonb("pre_trained_model"),
  customModelId: uuid("custom_model_id").references(() => customModels.id),
  trainedModelUrl: varchar("trained_model_url", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
