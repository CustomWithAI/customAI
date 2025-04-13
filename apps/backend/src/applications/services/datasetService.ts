import type { DatasetRepository } from "@/applications/repositories/datasetRepository";
import type { datasets } from "@/domains/schema/datasets";
import { generatePresignedUrl } from "@/infrastructures/s3/s3";
import type { PaginationParams } from "@/utils/db-type";
import { InternalServerError, NotFoundError } from "elysia";

export class DatasetService {
  public constructor(private repository: DatasetRepository) {}

  public async createDataset(data: typeof datasets.$inferInsert) {
    const result = await this.repository.create(data);
    if (result.length === 0) {
      throw new InternalServerError("Failed to create dataset");
    }
    return result[0];
  }

  public async getDatasetsByUserId(
    userId: string,
    pagination: PaginationParams
  ) {
    const result = await this.repository.findByUserId(userId, pagination);
    return {
      ...result,
      data: result.data.map((data) => ({
        ...data,
        images: data.images?.map((image: string) =>
          generatePresignedUrl(image)
        ),
      })),
    };
  }

  public async getDatasetById(userId: string, id: string) {
    const result = await this.repository.findById(userId, id);
    if (result.length === 0) {
      throw new NotFoundError(`Dataset not found: ${id}`);
    }
    return result[0];
  }

  public async updateDataset(
    userId: string,
    id: string,
    data: Partial<typeof datasets.$inferInsert>
  ) {
    const result = await this.repository.updateById(userId, id, data);
    if (result.length === 0) {
      throw new NotFoundError(`Dataset not found: ${id}`);
    }
    return result[0];
  }

  public async deleteDataset(userId: string, id: string) {
    const result = await this.repository.deleteById(userId, id);
    if (result.length === 0) {
      throw new NotFoundError(`Dataset not found: ${id}`);
    }
    return result[0];
  }
}
