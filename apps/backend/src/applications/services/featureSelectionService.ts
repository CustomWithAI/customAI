import type { FeatureSelectionRepository } from "@/applications/repositories/featureSelectionRepository";
import type { featureSelections } from "@/domains/schema/featureSelections";
import type { PaginationParams } from "@/utils/db-type";
import { NotFoundError, InternalServerError } from "elysia";

export class FeatureSelectionService {
  public constructor(private repository: FeatureSelectionRepository) {}

  public async createFeatureSelection(
    data: typeof featureSelections.$inferInsert
  ) {
    const result = await this.repository.create(data);
    if (result.length === 0) {
      throw new InternalServerError("Failed to create feature selection");
    }
    return result[0];
  }

  public async getFeatureSelectionsByUserId(
    userId: string,
    pagination: PaginationParams
  ) {
    return this.repository.findByUserId(userId, pagination);
  }

  public async getFeatureSelectionById(userId: string, id: string) {
    const result = await this.repository.findById(userId, id);
    if (result.length === 0) {
      throw new NotFoundError(`Feature selection not found: ${id}`);
    }
    return result[0];
  }

  public async updateFeatureSelection(
    userId: string,
    id: string,
    data: Partial<typeof featureSelections.$inferInsert>
  ) {
    const result = await this.repository.updateById(userId, id, data);
    if (result.length === 0) {
      throw new NotFoundError(`Feature selection not found: ${id}`);
    }
    return result[0];
  }

  public async deleteFeatureSelection(userId: string, id: string) {
    const result = await this.repository.deleteById(userId, id);
    if (result.length === 0) {
      throw new NotFoundError(`Feature selection not found: ${id}`);
    }
    return result[0];
  }
}
