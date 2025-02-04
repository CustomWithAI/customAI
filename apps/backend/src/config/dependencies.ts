import { AugmentationRepository } from "@/applications/repositories/augmentationRepository";
import { AugmentationService } from "@/applications/services/augmentationService";

// Repositories
export const augmentationRepository = new AugmentationRepository();

// Services
export const augmentationService = new AugmentationService(
  augmentationRepository
);
