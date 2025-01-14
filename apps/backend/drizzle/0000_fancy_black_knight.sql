CREATE TYPE "public"."type" AS ENUM('type1', 'type2', 'type3');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "augmentations" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"data" jsonb,
	"userId" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"role" text,
	"banned" boolean,
	"ban_reason" text,
	"ban_expires" timestamp,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
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
	"annotation" text,
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
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
