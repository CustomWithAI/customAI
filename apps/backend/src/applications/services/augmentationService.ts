import { augmentations } from "@/domains/schema/augmentations";
import { db as connection } from "@/infrastructures/database/connection";
import { DatabaseType, PaginationParams } from "@/utils/db-type";
import withPagination from "@/utils/pagination";
import { eq } from "drizzle-orm";

export class AugmentationService {
  public constructor(public db: DatabaseType = connection) {}

  public async createAugmentation(
    augmentation: typeof augmentations.$inferInsert
  ) {
    return this.db.insert(augmentations).values(augmentation).returning();
  }
  public async getAugmentationsByUserId(
    userId: string,
    pagination: PaginationParams
  ) {
    const query = this.db
      .select()
      .from(augmentations)
      .where(eq(augmentations.userId, userId))
      .$dynamic();

    return withPagination(query, {
      mode: "cursor",
      options: {
        table: augmentations,
        primaryKey: "id",
        cursor: pagination.cursor ? { id: pagination.cursor } : undefined,
        limit: pagination.limit,
      },
    });
  }
}
