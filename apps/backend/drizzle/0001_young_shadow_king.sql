CREATE TYPE "public"."type" AS ENUM('type1', 'type2', 'type3');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "augmentations" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"data" jsonb,
	"userId" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "custom_models" (
	"id" text PRIMARY KEY NOT NULL,
	"data" jsonb,
	"name" text,
	"hyperparameter" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "datasets" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"annotationMethod" text,
	"splitData" jsonb,
	"userId" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "feature_extractions" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"data" jsonb,
	"userId" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "image_preprocessing" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"data" jsonb,
	"userId" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "images" (
	"url" text PRIMARY KEY NOT NULL,
	"annotation" jsonb,
	"datasetId" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "structure_models" (
	"id" text PRIMARY KEY NOT NULL,
	"preTrainModel" jsonb,
	"customModelId" text,
	"userId" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trainings" (
	"id" text PRIMARY KEY NOT NULL,
	"version" double precision,
	"hyperparameter" jsonb,
	"workflowId" text,
	"pipeline" jsonb,
	"datasetId" text,
	"imagePreprocessingId" text,
	"featureExtractionId" text,
	"featureSelectionId" text,
	"augmentationId" text,
	"structureModelId" text,
	"trainedModelUrl" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workflows" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"description" varchar(255),
	"type" "type" DEFAULT 'type1',
	"defaultId" varchar(255),
	"userId" varchar(255)
);
