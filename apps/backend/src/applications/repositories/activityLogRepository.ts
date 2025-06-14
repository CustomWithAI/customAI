import { activityLogs } from "@/domains/schema/activityLogs";
import { db } from "@/infrastructures/database/connection";
import type { PaginationParams } from "@/utils/db-type";
import withPagination from "@/utils/pagination";
import { queryParser } from "@/utils/query-parser";
import { and, eq, getTableColumns } from "drizzle-orm";
import { workflows } from "@/domains/schema/workflows";
import { trainings } from "@/domains/schema/trainings";
import type { ActivityLogResponseDto } from "@/domains/dtos/activityLog";

export class ActivityLogRepository {
  public async create(data: typeof activityLogs.$inferInsert) {
    return db.insert(activityLogs).values(data).returning();
  }

  public async findByWorkflowId(
    workflowId: string,
    pagination: PaginationParams
  ) {
    const total = await db.$count(
      activityLogs,
      eq(activityLogs.workflowId, workflowId)
    );

    if (total === 0) return { data: [], total };

    const query = db.select().from(activityLogs).$dynamic();

    const paginatedData = await withPagination<
      typeof query,
      typeof activityLogs,
      ActivityLogResponseDto
    >(query, {
      mode: "cursor",
      where: eq(activityLogs.workflowId, workflowId),
      options: {
        table: activityLogs,
        primaryKey: "id",
        cursorFields: [],
        cursor: pagination.cursor,
        filters: queryParser(pagination.filter),
        orderBy: queryParser(pagination.orderBy),
        search: queryParser(pagination.search),
        limit: pagination.limit,
      },
    });

    return {
      total,
      ...paginatedData,
    };
  }

  public async findById(workflowId: string, id: string) {
    return db
      .select()
      .from(activityLogs)
      .where(
        and(eq(activityLogs.workflowId, workflowId), eq(activityLogs.id, id))
      );
  }

  public async updateById(
    workflowId: string,
    id: string,
    data: Partial<typeof activityLogs.$inferInsert>
  ) {
    return db
      .update(activityLogs)
      .set(data)
      .where(
        and(eq(activityLogs.workflowId, workflowId), eq(activityLogs.id, id))
      )
      .returning();
  }

  public async deleteById(workflowId: string, id: string) {
    return db
      .delete(activityLogs)
      .where(
        and(eq(activityLogs.workflowId, workflowId), eq(activityLogs.id, id))
      )
      .returning();
  }
}
