ALTER TABLE "augmentations" DROP CONSTRAINT "augmentations_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "custom_models" DROP CONSTRAINT "custom_models_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "datasets" DROP CONSTRAINT "datasets_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "feature_extractions" DROP CONSTRAINT "feature_extractions_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "feature_selections" DROP CONSTRAINT "feature_selections_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "image_preprocessings" DROP CONSTRAINT "image_preprocessings_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "images" DROP CONSTRAINT "images_dataset_id_datasets_id_fk";
--> statement-breakpoint
ALTER TABLE "trainings" DROP CONSTRAINT "trainings_workflow_id_workflows_id_fk";
--> statement-breakpoint
ALTER TABLE "trainings" DROP CONSTRAINT "trainings_dataset_id_datasets_id_fk";
--> statement-breakpoint
ALTER TABLE "trainings" DROP CONSTRAINT "trainings_image_preprocessing_id_image_preprocessings_id_fk";
--> statement-breakpoint
ALTER TABLE "trainings" DROP CONSTRAINT "trainings_feature_extraction_id_feature_extractions_id_fk";
--> statement-breakpoint
ALTER TABLE "trainings" DROP CONSTRAINT "trainings_feature_selection_id_feature_selections_id_fk";
--> statement-breakpoint
ALTER TABLE "trainings" DROP CONSTRAINT "trainings_augmentation_id_augmentations_id_fk";
--> statement-breakpoint
ALTER TABLE "trainings" DROP CONSTRAINT "trainings_custom_model_id_custom_models_id_fk";
--> statement-breakpoint
ALTER TABLE "workflows" DROP CONSTRAINT "workflows_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "augmentations" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "trainings" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "trainings" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "augmentations" ADD CONSTRAINT "augmentations_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "custom_models" ADD CONSTRAINT "custom_models_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "datasets" ADD CONSTRAINT "datasets_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "feature_extractions" ADD CONSTRAINT "feature_extractions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "feature_selections" ADD CONSTRAINT "feature_selections_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "image_preprocessings" ADD CONSTRAINT "image_preprocessings_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_dataset_id_datasets_id_fk" FOREIGN KEY ("dataset_id") REFERENCES "public"."datasets"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "trainings" ADD CONSTRAINT "trainings_workflow_id_workflows_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflows"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "trainings" ADD CONSTRAINT "trainings_dataset_id_datasets_id_fk" FOREIGN KEY ("dataset_id") REFERENCES "public"."datasets"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "trainings" ADD CONSTRAINT "trainings_image_preprocessing_id_image_preprocessings_id_fk" FOREIGN KEY ("image_preprocessing_id") REFERENCES "public"."image_preprocessings"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "trainings" ADD CONSTRAINT "trainings_feature_extraction_id_feature_extractions_id_fk" FOREIGN KEY ("feature_extraction_id") REFERENCES "public"."feature_extractions"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "trainings" ADD CONSTRAINT "trainings_feature_selection_id_feature_selections_id_fk" FOREIGN KEY ("feature_selection_id") REFERENCES "public"."feature_selections"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "trainings" ADD CONSTRAINT "trainings_augmentation_id_augmentations_id_fk" FOREIGN KEY ("augmentation_id") REFERENCES "public"."augmentations"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "trainings" ADD CONSTRAINT "trainings_custom_model_id_custom_models_id_fk" FOREIGN KEY ("custom_model_id") REFERENCES "public"."custom_models"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "workflows" ADD CONSTRAINT "workflows_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;