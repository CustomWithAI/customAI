import { augmentations } from "@/domains/schema/augmentations";
import { customModels } from "@/domains/schema/customModels";
import { datasets } from "@/domains/schema/datasets";
import { featureExtractions } from "@/domains/schema/featureExtractions";
import { featureSelections } from "@/domains/schema/featureSelections";
import { imagePreprocessings } from "@/domains/schema/imagePreprocessings";
import { workflows } from "@/domains/schema/workflows";
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { v7 } from "uuid";

export const trainingStatusEnum = pgEnum("training_status", [
  "created",
  "pending",
  "prepare_dataset",
  "training",
  "completed",
  "failed",
]);

export type TrainingStatusEnum =
  | "created"
  | "pending"
  | "prepare_dataset"
  | "training"
  | "completed"
  | "failed";

export const trainings = pgTable(
  "trainings",
  {
    id: varchar("id", { length: 255 })
      .primaryKey()
      .$defaultFn(() => v7()),
    isDefault: boolean("is_default").default(false).notNull(),
    version: varchar("version", { length: 255 }),
    hyperparameter: jsonb("hyperparameter"),
    pipeline: jsonb("pipeline").notNull(),
    status: trainingStatusEnum("status").default("created").notNull(),
    queueId: varchar("queue_id", { length: 255 }),
    retryCount: integer("retry_count").default(0).notNull(),
    errorMessage: text("error_message"),
    trainedModelPath: varchar("trained_model_path", { length: 255 }),
    evaluation: text("evaluation"),
    evaluationImage: jsonb("evaluation_image"),
    workflowId: varchar("workflow_id", { length: 255 })
      .notNull()
      .references(() => workflows.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    datasetId: varchar("dataset_id", { length: 255 }).references(
      () => datasets.id,
      {
        onDelete: "cascade",
        onUpdate: "cascade",
      }
    ),
    imagePreprocessingId: varchar("image_preprocessing_id", {
      length: 255,
    }).references(() => imagePreprocessings.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    featureExtractionId: varchar("feature_extraction_id", {
      length: 255,
    }).references(() => featureExtractions.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    featureSelectionId: varchar("feature_selection_id", {
      length: 255,
    }).references(() => featureSelections.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    augmentationId: varchar("augmentation_id", { length: 255 }).references(
      () => augmentations.id,
      {
        onDelete: "cascade",
        onUpdate: "cascade",
      }
    ),
    preTrainedModel: varchar("pre_trained_model", { length: 255 }),
    machineLearningModel: jsonb("machine_learning_model"),
    customModelId: varchar("custom_model_id", { length: 255 }).references(
      () => customModels.id,
      {
        onDelete: "cascade",
        onUpdate: "cascade",
      }
    ),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    unique("unique_version_workflow")
      .on(table.workflowId, table.version)
      .nullsNotDistinct(),
  ]
);
