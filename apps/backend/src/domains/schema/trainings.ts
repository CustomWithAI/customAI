import {
  doublePrecision,
  jsonb,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { workflows } from "@/domains/schema/workflows";
import { datasets } from "@/domains/schema/datasets";
import { imagePreprocessings } from "@/domains/schema/imagePreprocessings";
import { featureExtractions } from "@/domains/schema/featureExtractions";
import { featureSelections } from "@/domains/schema/featureSelections";
import { augmentations } from "@/domains/schema/augmentations";
import { customModels } from "@/domains/schema/customModels";
import { v7 } from "uuid";

export const trainings = pgTable("trainings", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => v7()),
  version: doublePrecision("version").default(0.0).notNull(),
  hyperparameter: jsonb("hyperparameter").notNull(),
  workflowId: varchar("workflow_id", { length: 255 })
    .notNull()
    .references(() => workflows.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  pipeline: jsonb("pipeline").notNull(),
  datasetId: varchar("dataset_id", { length: 255 })
    .notNull()
    .references(() => datasets.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  imagePreprocessingId: varchar("image_preprocessing_id", {
    length: 255,
  })
    .notNull()
    .references(() => imagePreprocessings.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  featureExtractionId: varchar("feature_extraction_id", {
    length: 255,
  })
    .notNull()
    .references(() => featureExtractions.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  featureSelectionId: varchar("feature_selection_id", {
    length: 255,
  })
    .notNull()
    .references(() => featureSelections.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  augmentationId: varchar("augmentation_id", { length: 255 })
    .notNull()
    .references(() => augmentations.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  preTrainedModel: jsonb("pre_trained_model").notNull(),
  customModelId: varchar("custom_model_id", { length: 255 })
    .notNull()
    .references(() => customModels.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  trainedModelUrl: varchar("trained_model_url", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
