import { AugmentationRepository } from "@/applications/repositories/augmentationRepository";
import { DatasetRepository } from "@/applications/repositories/datasetRepository";
import { ImagePreprocessingRepository } from "@/applications/repositories/imagePreprocessingRepository";
import { ImageRepository } from "@/applications/repositories/imageRepository";
import { AugmentationService } from "@/applications/services/augmentationService";
import { DatasetService } from "@/applications/services/datasetService";
import { ImagePreprocessingService } from "@/applications/services/imageProprocessingService";
import { ImageService } from "@/applications/services/imageService";

// Repositories
export const augmentationRepository = new AugmentationRepository();
export const datasetRepository = new DatasetRepository();
export const imageRepository = new ImageRepository();
export const imagePreprocessingRepository = new ImagePreprocessingRepository();

// Services
export const augmentationService = new AugmentationService(
  augmentationRepository
);
export const datasetService = new DatasetService(datasetRepository);
export const imageService = new ImageService(imageRepository);
export const imagePreprocessingService = new ImagePreprocessingService(
  imagePreprocessingRepository
);
