ALTER TABLE "datasets" ADD COLUMN "annotation" text;--> statement-breakpoint
ALTER TABLE "datasets" DROP COLUMN IF EXISTS "annotationMethod";