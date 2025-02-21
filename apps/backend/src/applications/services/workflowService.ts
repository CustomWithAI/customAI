import type { WorkflowRepository } from "@/applications/repositories/workflowRepository";
import type { workflows } from "@/domains/schema/workflows";
import type { PaginationParams } from "@/utils/db-type";
import { NotFoundError, InternalServerError } from "elysia";

export class WorkflowService {
  public constructor(private repository: WorkflowRepository) {}

  public async createWorkflow(data: typeof workflows.$inferInsert) {
    const result = await this.repository.create(data);
    if (result.length === 0) {
      throw new InternalServerError("Failed to create workflow");
    }
    return result[0];
  }

  public async getWorkflowsByUserId(
    userId: string,
    pagination: PaginationParams
  ) {
    return this.repository.findByUserId(userId, pagination);
  }

  public async getWorkflowById(userId: string, id: string) {
    const result = await this.repository.findById(userId, id);
    if (result.length === 0) {
      throw new NotFoundError(`Workflow not found: ${id}`);
    }
    return result[0];
  }

  public async updateWorkflow(
    userId: string,
    id: string,
    data: Partial<typeof workflows.$inferInsert>
  ) {
    const result = await this.repository.updateById(userId, id, data);
    if (result.length === 0) {
      throw new NotFoundError(`Workflow not found: ${id}`);
    }
    return result[0];
  }

  public async deleteWorkflow(userId: string, id: string) {
    const result = await this.repository.deleteById(userId, id);
    if (result.length === 0) {
      throw new NotFoundError(`Workflow not found: ${id}`);
    }
    return result[0];
  }
}
