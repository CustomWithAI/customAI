import {
  modelInferences,
  type ModelInferenceStatusEnum,
} from "@/domains/schema/modelInferences";
import { db } from "@/infrastructures/database/connection";
import { and, eq } from "drizzle-orm";
import type { PaginationParams } from "@/utils/db-type";
import withPagination from "@/utils/pagination";
import { queryParser } from "@/utils/query-parser";

export class ModelInferenceRepository {
  public async create(data: typeof modelInferences.$inferInsert) {
    return db.insert(modelInferences).values(data).returning();
  }

  public async findByUserId(userId: string, pagination: PaginationParams) {
    const total = await db.$count(
      modelInferences,
      eq(modelInferences.userId, userId)
    );

    if (total === 0) return { data: [], total };

    const query = db.select().from(modelInferences).$dynamic();

    const paginatedData = await withPagination(query, {
      mode: "cursor",
      where: eq(modelInferences.userId, userId),
      options: {
        table: modelInferences,
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

  public async findById(userId: string, id: string) {
    return db
      .select()
      .from(modelInferences)
      .where(
        and(eq(modelInferences.id, id), eq(modelInferences.userId, userId))
      )
      .limit(1);
  }

  public async updateById(
    userId: string,
    id: string,
    data: Partial<typeof modelInferences.$inferInsert>
  ) {
    return db
      .update(modelInferences)
      .set(data)
      .where(
        and(eq(modelInferences.userId, userId), eq(modelInferences.id, id))
      )
      .returning();
  }

  public async deleteById(userId: string, id: string) {
    return db
      .delete(modelInferences)
      .where(
        and(eq(modelInferences.userId, userId), eq(modelInferences.id, id))
      )
      .returning();
  }

  public async updateStatus(
    id: string,
    status: ModelInferenceStatusEnum,
    queueId?: string
  ) {
    return db
      .update(modelInferences)
      .set(queueId ? { status, queueId } : { status })
      .where(eq(modelInferences.id, id))
      .returning();
  }
}
