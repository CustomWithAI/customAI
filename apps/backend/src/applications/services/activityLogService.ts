import type { activityLogs } from "@/domains/schema/activityLogs";
import type { PaginationParams } from "@/utils/db-type";
import type { ActivityLogRepository } from "@/applications/repositories/activityLogRepository";

export class ActivityLogService {
  public constructor(private repository: ActivityLogRepository) {}

  public async create(data: typeof activityLogs.$inferInsert) {
    return this.repository.create(data);
  }

  public async getByWorkflowId(
    workflowId: string,
    pagination: PaginationParams
  ) {
    return this.repository.findByWorkflowId(workflowId, pagination);
  }

  public async getById(workflowId: string, id: string) {
    return this.repository.findById(workflowId, id);
  }

  public async updateActivityLog(
    workflowId: string,
    id: string,
    data: Partial<typeof activityLogs.$inferInsert>
  ) {
    return this.repository.updateById(workflowId, id, data);
  }

  public async deleteActivityLog(workflowId: string, id: string) {
    return this.repository.deleteById(workflowId, id);
  }
}
