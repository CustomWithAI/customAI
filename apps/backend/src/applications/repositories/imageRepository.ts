import { images } from "@/domains/schema/images";
import { db } from "@/infrastructures/database/connection";
import type { PaginationParams } from "@/utils/db-type";
import withPagination from "@/utils/pagination";
import { and, eq } from "drizzle-orm";

export class ImageRepository {
  public async create(data: (typeof images.$inferInsert)[]) {
    return db.insert(images).values(data).returning();
  }

  public async findByDatasetId(
    datasetId: string,
    pagination: PaginationParams
  ) {
    const total = await db.$count(images, eq(images.datasetId, datasetId));

    if (total === 0) return { data: [], total };

    const query = db.select().from(images).$dynamic();

    const paginatedData = await withPagination(query, {
      mode: "cursor",
      where: eq(images.datasetId, datasetId),
      options: {
        table: images,
        primaryKey: "path",
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

  public async findByPath(datasetId: string, filePath: string) {
    return db
      .select()
      .from(images)
      .where(and(eq(images.datasetId, datasetId), eq(images.path, filePath)))
      .limit(1);
  }

  public async updateByPath(
    datasetId: string,
    filePath: string,
    data: Partial<typeof images.$inferInsert>
  ) {
    return db
      .update(images)
      .set(data)
      .where(and(eq(images.datasetId, datasetId), eq(images.path, filePath)))
      .returning();
  }

  public async deleteByPath(datasetId: string, filePath: string) {
    return db
      .delete(images)
      .where(and(eq(images.datasetId, datasetId), eq(images.path, filePath)))
      .returning();
  }
}
