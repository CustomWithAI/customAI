import type { CustomModelRepository } from "@/applications/repositories/customModelRepository";
import type { customModels } from "@/domains/schema/customModels";
import type { PaginationParams } from "@/utils/db-type";
import { NotFoundError, InternalServerError } from "elysia";

export class CustomModelService {
  public constructor(private repository: CustomModelRepository) {}

  public async createCustomModel(data: typeof customModels.$inferInsert) {
    const result = await this.repository.create(data);
    if (result.length === 0) {
      throw new InternalServerError("Failed to create custom model");
    }
    return result[0];
  }

  public async getCustomModelsByUserId(
    userId: string,
    pagination: PaginationParams
  ) {
    return this.repository.findByUserId(userId, pagination);
  }

  public async getCustomModelById(userId: string, id: string) {
    const result = await this.repository.findById(userId, id);
    if (result.length === 0) {
      throw new NotFoundError(`Custom model not found: ${id}`);
    }
    return result[0];
  }

  public async updateCustomModel(
    userId: string,
    id: string,
    data: Partial<typeof customModels.$inferInsert>
  ) {
    const result = await this.repository.updateById(userId, id, data);
    if (result.length === 0) {
      throw new NotFoundError(`Custom model not found: ${id}`);
    }
    return result[0];
  }

  public async deleteCustomModel(userId: string, id: string) {
    const result = await this.repository.deleteById(userId, id);
    if (result.length === 0) {
      throw new NotFoundError(`Custom model not found: ${id}`);
    }
    return result[0];
  }
}
