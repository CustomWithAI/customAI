import { images } from "@/domains/schema/images";
import { db } from "@/infrastructures/database/connection";
import type { PaginationParams } from "@/utils/db-type";
import withPagination from "@/utils/pagination";
import { eq, and } from "drizzle-orm";

export class ImageRepository {
  public async create(data: (typeof images.$inferInsert)[]) {
    return db.insert(images).values(data).returning();
  }

  public async findByDatasetId(
    datasetId: string,
    pagination: PaginationParams
  ) {
    const query = db
      .select()
      .from(images)
      .where(eq(images.datasetId, datasetId))
      .$dynamic();

    return withPagination(query, {
      mode: "cursor",
      options: {
        table: images,
        primaryKey: "url",
        cursorFields: [],
        cursor: pagination.cursor,
        limit: pagination.limit,
      },
    });
  }

  public async findByPath(datasetId: string, filePath: string) {
    return db
      .select()
      .from(images)
      .where(and(eq(images.datasetId, datasetId), eq(images.url, filePath)))
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
      .where(and(eq(images.datasetId, datasetId), eq(images.url, filePath)))
      .returning();
  }

  public async deleteByPath(datasetId: string, filePath: string) {
    return db
      .delete(images)
      .where(and(eq(images.datasetId, datasetId), eq(images.url, filePath)))
      .returning();
  }
}
