import { db } from "@/infrastructures/database/connection";
import { featureExtractions } from "@/domains/schema/featureExtractions";
import type { PaginationParams } from "@/utils/db-type";
import withPagination from "@/utils/pagination";
import { and, eq } from "drizzle-orm";

export class FeatureExtractionRepository {
  public async create(data: typeof featureExtractions.$inferInsert) {
    return db.insert(featureExtractions).values(data).returning();
  }

  public async findByUserId(userId: string, pagination: PaginationParams) {
    const total = await db.$count(
      featureExtractions,
      eq(featureExtractions.userId, userId)
    );

    if (total === 0) return { data: [], total };

    const query = db.select().from(featureExtractions).$dynamic();

    const paginatedData = await withPagination(query, {
      mode: "cursor",
      where: eq(featureExtractions.userId, userId),
      options: {
        table: featureExtractions,
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
      .from(featureExtractions)
      .where(
        and(
          eq(featureExtractions.userId, userId),
          eq(featureExtractions.id, id)
        )
      )
      .limit(1);
  }

  public async updateById(
    userId: string,
    id: string,
    data: Partial<typeof featureExtractions.$inferInsert>
  ) {
    return db
      .update(featureExtractions)
      .set(data)
      .where(
        and(
          eq(featureExtractions.userId, userId),
          eq(featureExtractions.id, id)
        )
      )
      .returning();
  }

  public async deleteById(userId: string, id: string) {
    return db
      .delete(featureExtractions)
      .where(
        and(
          eq(featureExtractions.userId, userId),
          eq(featureExtractions.id, id)
        )
      )
      .returning();
  }
}
