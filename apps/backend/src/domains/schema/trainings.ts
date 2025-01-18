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
import { structureModels } from "@/domains/schema/structureModels";

export const trainings = pgTable("trainings", {
  id: uuid("id").defaultRandom().primaryKey(),
  version: doublePrecision("version").default(0.0),
  hyperparameter: jsonb("hyperparameter"),
  workflowId: uuid("workflowId").references(() => workflows.id),
  pipeline: jsonb("pipeline"),
  datasetId: uuid("datasetId").references(() => datasets.id),
  imagePreprocessingId: uuid("imagePreprocessingId").references(
    () => imagePreprocessings.id
  ),
  featureExtractionId: uuid("featureExtractionId").references(
    () => featureExtractions.id
  ),
  featureSelectionId: uuid("featureSelectionId").references(
    () => featureSelections.id
  ),
  augmentationId: uuid("augmentationId").references(() => augmentations.id),
  structureModelId: uuid("structureModelId").references(
    () => structureModels.id
  ),
  trainedModelUrl: varchar("trainedModelUrl", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
