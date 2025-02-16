import type { FeatureExtractionRepository } from "@/applications/repositories/featureExtractionRepository";
import type { featureExtractions } from "@/domains/schema/featureExtractions";
import type { PaginationParams } from "@/utils/db-type";
import { NotFoundError, InternalServerError } from "elysia";

export class FeatureExtractionService {
  public constructor(private repository: FeatureExtractionRepository) {}

  public async createFeatureExtraction(
    data: typeof featureExtractions.$inferInsert
  ) {
    const result = await this.repository.create(data);
    if (result.length === 0) {
      throw new InternalServerError("Failed to create feature extraction");
    }
    return result[0];
  }

  public async getFeatureExtractionsByUserId(
    userId: string,
    pagination: PaginationParams
  ) {
    return this.repository.findByUserId(userId, pagination);
  }

  public async getFeatureExtractionById(userId: string, id: string) {
    const result = await this.repository.findById(userId, id);
    if (result.length === 0) {
      throw new NotFoundError(`Feature extraction not found: ${id}`);
    }
    return result[0];
  }

  public async updateFeatureExtraction(
    userId: string,
    id: string,
    data: Partial<typeof featureExtractions.$inferInsert>
  ) {
    const result = await this.repository.updateById(userId, id, data);
    if (result.length === 0) {
      throw new NotFoundError(`Feature extraction not found: ${id}`);
    }
    return result[0];
  }

  public async deleteFeatureExtraction(userId: string, id: string) {
    const result = await this.repository.deleteById(userId, id);
    if (result.length === 0) {
      throw new NotFoundError(`Feature extraction not found: ${id}`);
    }
    return result[0];
  }
}
