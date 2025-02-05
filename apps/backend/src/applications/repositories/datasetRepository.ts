import { datasets } from "@/domains/schema/datasets";
import { db } from "@/infrastructures/database/connection";
import type { PaginationParams } from "@/utils/db-type";
import withPagination from "@/utils/pagination";
import { eq } from "drizzle-orm";

export class DatasetRepository {
  public async create(data: typeof datasets.$inferInsert) {
    return db.insert(datasets).values(data).returning();
  }

  public async findByUserId(userId: string, pagination: PaginationParams) {
    const query = db
      .select()
      .from(datasets)
      .where(eq(datasets.userId, userId))
      .$dynamic();

    return withPagination(query, {
      mode: "cursor",
      options: {
        table: datasets,
        primaryKey: "id",
        cursorFields: [],
        cursor: pagination.cursor,
        limit: pagination.limit,
      },
    });
  }

  public async findById(id: string) {
    return db.select().from(datasets).where(eq(datasets.id, id)).limit(1);
  }

  public async updateById(
    id: string,
    data: Partial<typeof datasets.$inferInsert>
  ) {
    return db.update(datasets).set(data).where(eq(datasets.id, id)).returning();
  }

  public async deleteById(id: string) {
    return db.delete(datasets).where(eq(datasets.id, id)).returning();
  }
}
