import { logs } from "@/domains/schema/logs";
import { db } from "@/infrastructures/database/connection";
import type { PaginationParams } from "@/utils/db-type";
import withPagination from "@/utils/pagination";
import { queryParser } from "@/utils/query-parser";
import { and, eq } from "drizzle-orm";

export class LogRepository {
  public async create(data: typeof logs.$inferInsert) {
    return db
      .insert(logs)
      .values(data)
      .onConflictDoNothing({ target: [logs.trainingId, logs.data] });
  }

  public async findByTrainingId(
    trainingId: string,
    pagination: PaginationParams
  ) {
    const total = await db.$count(logs, eq(logs.trainingId, trainingId));

    if (total === 0) return { data: [], total };

    const query = db.select().from(logs).$dynamic();

    const paginatedData = await withPagination(query, {
      mode: "cursor",
      where: eq(logs.trainingId, trainingId),
      options: {
        table: logs,
        primaryKey: "id",
        cursorFields: [],
        filters: queryParser(pagination.filter),
        orderBy: queryParser(pagination.orderBy),
        search: queryParser(pagination.search),
        cursor: pagination.cursor,
        limit: pagination.limit,
      },
    });

    return {
      total,
      ...paginatedData,
    };
  }

  public async findById(trainingId: string, id: string) {
    return db
      .select()
      .from(logs)
      .where(and(eq(logs.trainingId, trainingId), eq(logs.id, id)))
      .limit(1);
  }

  public async updateById(
    trainingId: string,
    id: string,
    data: Partial<typeof logs.$inferInsert>
  ) {
    return db
      .update(logs)
      .set(data)
      .where(and(eq(logs.trainingId, trainingId), eq(logs.id, id)))
      .returning();
  }

  public async deleteByTrainingId(trainingId: string) {
    return db.delete(logs).where(eq(logs.trainingId, trainingId)).returning();
  }

  public async deleteById(trainingId: string, id: string) {
    return db
      .delete(logs)
      .where(and(eq(logs.trainingId, trainingId), eq(logs.id, id)))
      .returning();
  }
}
