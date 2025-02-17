import { db } from "@/infrastructures/database/connection";
import { customModels } from "@/domains/schema/customModels";
import type { PaginationParams } from "@/utils/db-type";
import withPagination from "@/utils/pagination";
import { and, eq } from "drizzle-orm";

export class CustomModelRepository {
  public async create(data: typeof customModels.$inferInsert) {
    return db.insert(customModels).values(data).returning();
  }

  public async findByUserId(userId: string, pagination: PaginationParams) {
    const total = await db.$count(
      customModels,
      eq(customModels.userId, userId)
    );

    if (total === 0) return { data: [], total };

    const query = db.select().from(customModels).$dynamic();

    const paginatedData = await withPagination(query, {
      mode: "cursor",
      where: eq(customModels.userId, userId),
      options: {
        table: customModels,
        primaryKey: "id",
        cursorFields: [],
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
      .from(customModels)
      .where(and(eq(customModels.userId, userId), eq(customModels.id, id)))
      .limit(1);
  }

  public async updateById(
    userId: string,
    id: string,
    data: Partial<typeof customModels.$inferInsert>
  ) {
    return db
      .update(customModels)
      .set(data)
      .where(and(eq(customModels.userId, userId), eq(customModels.id, id)))
      .returning();
  }

  public async deleteById(userId: string, id: string) {
    return db
      .delete(customModels)
      .where(and(eq(customModels.userId, userId), eq(customModels.id, id)))
      .returning();
  }
}
