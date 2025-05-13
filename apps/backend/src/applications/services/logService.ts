import type { LogRepository } from "@/applications/repositories/logRepository";
import type { logs } from "@/domains/schema/logs";
import type { PaginationParams } from "@/utils/db-type";
import { NotFoundError } from "elysia";

export class LogService {
  public constructor(private repository: LogRepository) {}

  public async createLog(data: typeof logs.$inferInsert) {
    await this.repository.create(data);
    return { message: "Logs created successfully" };
  }

  public async getLogsByTrainingId(
    trainingId: string,
    pagination: PaginationParams
  ) {
    return this.repository.findByTrainingId(trainingId, pagination);
  }

  public async getLogById(trainingId: string, id: string) {
    const result = await this.repository.findById(trainingId, id);
    if (result.length === 0) {
      throw new NotFoundError(`Log not found: ${id}`);
    }
    return result[0];
  }

  public async updateLog(
    trainingId: string,
    id: string,
    data: Partial<typeof logs.$inferInsert>
  ) {
    const result = await this.repository.updateById(trainingId, id, data);
    if (result.length === 0) {
      throw new NotFoundError(`Log not found: ${id}`);
    }
    return result[0];
  }

  public async deleteLogsByTrainingId(trainingId: string) {
    const result = await this.repository.deleteByTrainingId(trainingId);
    if (result.length === 0) {
      throw new NotFoundError(`Logs not found from training: ${trainingId}`);
    }
    return { message: "Logs deleted successfully" };
  }

  public async deleteLog(trainingId: string, id: string) {
    const result = await this.repository.deleteById(trainingId, id);
    if (result.length === 0) {
      throw new NotFoundError(`Log not found: ${id}`);
    }
    return result[0];
  }
}
