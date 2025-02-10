import { imagePreprocessings } from "@/domains/schema/imagePreprocessings";
import { db } from "@/infrastructures/database/connection";
import type { PaginationParams } from "@/utils/db-type";
import withPagination from "@/utils/pagination";
import { and, eq } from "drizzle-orm";

export class ImagePreprocessingRepository {
  public async create(data: typeof imagePreprocessings.$inferInsert) {
    return db.insert(imagePreprocessings).values(data).returning();
  }

  public async findByUserId(userId: string, pagination: PaginationParams) {
    const total = await db.$count(
      imagePreprocessings,
      eq(imagePreprocessings.userId, userId)
    );

    if (total === 0) return { data: [], total };

    const query = db.select().from(imagePreprocessings).$dynamic();

    const paginatedData = await withPagination(query, {
      mode: "cursor",
      where: eq(imagePreprocessings.userId, userId),
      options: {
        table: imagePreprocessings,
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
      .from(imagePreprocessings)
      .where(
        and(
          eq(imagePreprocessings.userId, userId),
          eq(imagePreprocessings.id, id)
        )
      )
      .limit(1);
  }

  public async updateById(
    userId: string,
    id: string,
    data: Partial<typeof imagePreprocessings.$inferInsert>
  ) {
    return db
      .update(imagePreprocessings)
      .set(data)
      .where(
        and(
          eq(imagePreprocessings.userId, userId),
          eq(imagePreprocessings.id, id)
        )
      )
      .returning();
  }

  public async deleteById(userId: string, id: string) {
    return db
      .delete(imagePreprocessings)
      .where(
        and(
          eq(imagePreprocessings.userId, userId),
          eq(imagePreprocessings.id, id)
        )
      )
      .returning();
  }
}
