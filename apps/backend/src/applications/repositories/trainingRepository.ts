import { trainings } from "@/domains/schema/trainings";
import type { TrainingStatusEnum } from "@/domains/schema/trainings";
import { db } from "@/infrastructures/database/connection";
import type { PaginationParams } from "@/utils/db-type";
import withPagination from "@/utils/pagination";
import { and, eq } from "drizzle-orm";

export class TrainingRepository {
  public async create(data: typeof trainings.$inferInsert) {
    return db.insert(trainings).values(data).returning();
  }

  public async findByWorkflowId(
    workflowId: string,
    pagination: PaginationParams
  ) {
    return withPagination(db.select().from(trainings).$dynamic(), {
      mode: "cursor",
      where: and(eq(trainings.workflowId, workflowId)),
      options: {
        table: trainings,
        primaryKey: "id",
        cursorFields: [],
        cursor: pagination.cursor,
        limit: pagination.limit,
      },
    });
  }

  public async findById(workflowId: string, id: string) {
    return db
      .select()
      .from(trainings)
      .where(and(eq(trainings.id, id), eq(trainings.workflowId, workflowId)))
      .limit(1);
  }

  public async updateById(
    workflowId: string,
    id: string,
    data: Partial<typeof trainings.$inferInsert>
  ) {
    return db
      .update(trainings)
      .set(data)
      .where(and(eq(trainings.id, id), eq(trainings.workflowId, workflowId)))
      .returning();
  }

  public async deleteById(workflowId: string, id: string) {
    return db
      .delete(trainings)
      .where(and(eq(trainings.id, id), eq(trainings.workflowId, workflowId)))
      .returning();
  }

  public async updateStatus(
    id: string,
    status: TrainingStatusEnum,
    queueId?: string
  ) {
    return db
      .update(trainings)
      .set(queueId ? { status, queueId } : { status })
      .where(eq(trainings.id, id))
      .returning();
  }
}
