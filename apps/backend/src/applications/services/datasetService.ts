import type { DatasetRepository } from "@/applications/repositories/datasetRepository";
import { HttpError } from "@/config/error";
import type { datasets } from "@/domains/schema/datasets";
import type { PaginationParams } from "@/utils/db-type";

export class DatasetService {
  public constructor(private repository: DatasetRepository) {}

  public async createDataset(data: typeof datasets.$inferInsert) {
    const result = await this.repository.create(data);
    if (result.length === 0) {
      throw HttpError.Internal("Failed to create dataset");
    }
    return result[0];
  }

  public async getDatasetsByUserId(
    userId: string,
    pagination: PaginationParams
  ) {
    return this.repository.findByUserId(userId, pagination);
  }

  public async getDatasetById(id: string) {
    const result = await this.repository.findById(id);
    if (result.length === 0) {
      throw HttpError.NotFound(`Dataset not found: ${id}`);
    }
    return result[0];
  }

  public async updateDataset(
    id: string,
    data: Partial<typeof datasets.$inferInsert>
  ) {
    const result = await this.repository.updateById(id, data);
    if (result.length === 0) {
      throw HttpError.NotFound(`Dataset not found: ${id}`);
    }
    return result[0];
  }

  public async deleteDataset(id: string) {
    const result = await this.repository.deleteById(id);
    if (result.length === 0) {
      throw HttpError.NotFound(`Dataset not found: ${id}`);
    }
    return result[0];
  }
}
