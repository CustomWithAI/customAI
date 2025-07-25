import { AugmentationRepository } from "@/applications/repositories/augmentationRepository";
import { CustomModelRepository } from "@/applications/repositories/customModelRepository";
import { DatasetRepository } from "@/applications/repositories/datasetRepository";
import { FeatureExtractionRepository } from "@/applications/repositories/featureExtractionRepository";
import { FeatureSelectionRepository } from "@/applications/repositories/featureSelectionRepository";
import { ImagePreprocessingRepository } from "@/applications/repositories/imagePreprocessingRepository";
import { ImageRepository } from "@/applications/repositories/imageRepository";
import { LogRepository } from "@/applications/repositories/logRepository";
import { ModelInferenceRepository } from "@/applications/repositories/modelInferenceRepository";
import { TrainingRepository } from "@/applications/repositories/trainingRepository";
import { WorkflowRepository } from "@/applications/repositories/workflowRepository";
import { ActivityLogRepository } from "@/applications/repositories/activityLogRepository";
import { AugmentationService } from "@/applications/services/augmentationService";
import { CustomModelService } from "@/applications/services/customModelService";
import { DatasetService } from "@/applications/services/datasetService";
import { FeatureExtractionService } from "@/applications/services/featureExtractionService";
import { FeatureSelectionService } from "@/applications/services/featureSelectionService";
import { ImagePreprocessingService } from "@/applications/services/imageProprocessingService";
import { ImageService } from "@/applications/services/imageService";
import { LogService } from "@/applications/services/logService";
import { ModelInferenceService } from "@/applications/services/modelInferenceService";
import { TrainingService } from "@/applications/services/trainingService";
import { WorkflowService } from "@/applications/services/workflowService";
import { ActivityLogService } from "@/applications/services/activityLogService";

// Repositories
export const augmentationRepository = new AugmentationRepository();
export const datasetRepository = new DatasetRepository();
export const imageRepository = new ImageRepository();
export const imagePreprocessingRepository = new ImagePreprocessingRepository();
export const featureExtractionRepository = new FeatureExtractionRepository();
export const featureSelectionRepository = new FeatureSelectionRepository();
export const customModelRepository = new CustomModelRepository();
export const workflowRepository = new WorkflowRepository();
export const trainingRepository = new TrainingRepository();
export const modelInferenceRepository = new ModelInferenceRepository();
export const logRepository = new LogRepository();
export const activityLogRepository = new ActivityLogRepository();

// Services
export const augmentationService = new AugmentationService(
  augmentationRepository
);
export const datasetService = new DatasetService(datasetRepository);
export const imageService = new ImageService(
  imageRepository,
  datasetRepository
);
export const imagePreprocessingService = new ImagePreprocessingService(
  imagePreprocessingRepository
);
export const featureExtractionService = new FeatureExtractionService(
  featureExtractionRepository
);
export const featureSelectionService = new FeatureSelectionService(
  featureSelectionRepository
);
export const customModelService = new CustomModelService(customModelRepository);
export const workflowService = new WorkflowService(workflowRepository);
export const trainingService = new TrainingService(
  trainingRepository,
  workflowRepository,
  imageRepository,
  activityLogRepository
);
export const modelInferenceService = new ModelInferenceService(
  modelInferenceRepository,
  trainingRepository
);
export const logService = new LogService(logRepository);
export const activityLogService = new ActivityLogService(activityLogRepository);
