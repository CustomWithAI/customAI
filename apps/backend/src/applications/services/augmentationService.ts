import type { AugmentationRepository } from "@/applications/repositories/augmentationRepository";
import { HttpError } from "@/config/error";
import type { augmentations } from "@/domains/schema/augmentations";
import type { PaginationParams } from "@/utils/db-type";

export class AugmentationService {
  public constructor(private repository: AugmentationRepository) {}

  public async createAugmentation(data: typeof augmentations.$inferInsert) {
    const result = await this.repository.create(data);
    if (result.length === 0) {
      throw HttpError.Internal("Failed to create augmentation");
    }
    return result[0];
  }

  public async getAugmentationsByUserId(
    userId: string,
    pagination: PaginationParams
  ) {
    return this.repository.findByUserId(userId, pagination);
  }

  public async getAugmentationById(userId: string, id: string) {
    const result = await this.repository.findById(userId, id);
    if (result.length === 0) {
      throw HttpError.NotFound(`Augmentation not found: ${id}`);
    }
    return result[0];
  }

  public async updateAugmentation(
    userId: string,
    id: string,
    data: Partial<typeof augmentations.$inferInsert>
  ) {
    const result = await this.repository.updateById(userId, id, data);
    if (result.length === 0) {
      throw HttpError.NotFound(`Augmentation not found: ${id}`);
    }
    return result[0];
  }

  public async deleteAugmentation(userId: string, id: string) {
    const result = await this.repository.deleteById(userId, id);
    if (result.length === 0) {
      throw HttpError.NotFound(`Augmentation not found: ${id}`);
    }
    return result[0];
  }
}
