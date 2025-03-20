import { augmentations } from "@/domains/schema/augmentations";
import { db } from "@/infrastructures/database/connection";
import type { PaginationParams } from "@/utils/db-type";
import withPagination from "@/utils/pagination";
import { queryParser } from "@/utils/query-parser";
import { and, eq } from "drizzle-orm";

export class AugmentationRepository {
	public async create(data: typeof augmentations.$inferInsert) {
		return db.insert(augmentations).values(data).returning();
	}

	public async findByUserId(userId: string, pagination: PaginationParams) {
		const total = await db.$count(
			augmentations,
			eq(augmentations.userId, userId),
		);

		if (total === 0) return { data: [], total };

		const query = db.select().from(augmentations).$dynamic();

		const paginatedData = await withPagination(query, {
			mode: "cursor",
			where: eq(augmentations.userId, userId),
			options: {
				table: augmentations,
				primaryKey: "id",
				cursorFields: [],
				cursor: pagination.cursor,
				filters: queryParser(pagination.filter),
				orderBy: queryParser(pagination.orderBy),
				search: queryParser(pagination.search),
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
			.from(augmentations)
			.where(and(eq(augmentations.userId, userId), eq(augmentations.id, id)))
			.limit(1);
	}

	public async updateById(
		userId: string,
		id: string,
		data: Partial<typeof augmentations.$inferInsert>,
	) {
		return db
			.update(augmentations)
			.set(data)
			.where(and(eq(augmentations.userId, userId), eq(augmentations.id, id)))
			.returning();
	}

	public async deleteById(userId: string, id: string) {
		return db
			.delete(augmentations)
			.where(and(eq(augmentations.userId, userId), eq(augmentations.id, id)))
			.returning();
	}
}
