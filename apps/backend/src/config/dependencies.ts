import { AugmentationRepository } from "@/applications/repositories/augmentationRepository";
import { DatasetRepository } from "@/applications/repositories/datasetRepository";
import { ImageRepository } from "@/applications/repositories/imageRepository";
import { AugmentationService } from "@/applications/services/augmentationService";
import { DatasetService } from "@/applications/services/datasetService";
import { ImageService } from "@/applications/services/imageService";

// Repositories
export const augmentationRepository = new AugmentationRepository();
export const datasetRepository = new DatasetRepository();
export const imageRepository = new ImageRepository();

// Services
export const augmentationService = new AugmentationService(
  augmentationRepository
);
export const datasetService = new DatasetService(datasetRepository);
export const imageService = new ImageService(imageRepository);
