import type { ImagePreprocessingRepository } from "@/applications/repositories/imagePreprocessingRepository";
import { HttpError } from "@/config/error";
import type { imagePreprocessings } from "@/domains/schema/imagePreprocessings";
import type { PaginationParams } from "@/utils/db-type";

export class ImagePreprocessingService {
  public constructor(private repository: ImagePreprocessingRepository) {}

  public async createImagePreprocessing(
    data: typeof imagePreprocessings.$inferInsert
  ) {
    const result = await this.repository.create(data);
    if (result.length === 0) {
      throw HttpError.Internal("Failed to create image preprocessing");
    }
    return result[0];
  }

  public async getImagePreprocessingsByUserId(
    userId: string,
    pagination: PaginationParams
  ) {
    return this.repository.findByUserId(userId, pagination);
  }

  public async getImagePreprocessingById(userId: string, id: string) {
    const result = await this.repository.findById(userId, id);
    if (result.length === 0) {
      throw HttpError.NotFound(`Image Preprocessing not found: ${id}`);
    }
    return result[0];
  }

  public async updateImagePreprocessing(
    userId: string,
    id: string,
    data: Partial<typeof imagePreprocessings.$inferInsert>
  ) {
    const result = await this.repository.updateById(userId, id, data);
    if (result.length === 0) {
      throw HttpError.NotFound(`Image Preprocessing not found: ${id}`);
    }
    return result[0];
  }

  public async deleteImagePreprocessing(userId: string, id: string) {
    const result = await this.repository.deleteById(userId, id);
    if (result.length === 0) {
      throw HttpError.NotFound(`Image Preprocessing not found: ${id}`);
    }
    return result[0];
  }
}
