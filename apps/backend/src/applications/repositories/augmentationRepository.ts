import { augmentations } from "@/domains/schema/augmentations";
import { db } from "@/infrastructures/database/connection";
import type { PaginationParams } from "@/utils/db-type";
import withPagination from "@/utils/pagination";
import { eq } from "drizzle-orm";

export class AugmentationRepository {
	public async create(data: typeof augmentations.$inferInsert) {
		return db.insert(augmentations).values(data).returning();
	}

	public async findByUserId(userId: string, pagination: PaginationParams) {
		const query = db
			.select()
			.from(augmentations)
			.where(eq(augmentations.userId, userId))
			.$dynamic();

		return withPagination(query, {
			mode: "cursor",
			options: {
				table: augmentations,
				primaryKey: "id",
				cursorFields: ["createdAt"],
				cursor: pagination.cursor,
				limit: pagination.limit,
			},
		});
	}

	public async findById(id: string) {
		const result = await db
			.select()
			.from(augmentations)
			.where(eq(augmentations.id, id))
			.limit(1);

		return result[0] || null;
	}

	public async updateById(
		id: string,
		data: Partial<typeof augmentations.$inferInsert>,
	) {
		return db
			.update(augmentations)
			.set(data)
			.where(eq(augmentations.id, id))
			.returning();
	}

	public async deleteById(id: string) {
		return db.delete(augmentations).where(eq(augmentations.id, id)).returning();
	}
}
