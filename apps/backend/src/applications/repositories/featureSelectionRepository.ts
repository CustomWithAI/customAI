import { featureSelections } from "@/domains/schema/featureSelections";
import { db } from "@/infrastructures/database/connection";
import type { PaginationParams } from "@/utils/db-type";
import withPagination from "@/utils/pagination";
import { queryParser } from "@/utils/query-parser";
import { and, eq } from "drizzle-orm";

export class FeatureSelectionRepository {
	public async create(data: typeof featureSelections.$inferInsert) {
		return db.insert(featureSelections).values(data).returning();
	}

	public async findByUserId(userId: string, pagination: PaginationParams) {
		const total = await db.$count(
			featureSelections,
			eq(featureSelections.userId, userId),
		);

		if (total === 0) return { data: [], total };

		const query = db.select().from(featureSelections).$dynamic();

		const paginatedData = await withPagination(query, {
			mode: "cursor",
			where: eq(featureSelections.userId, userId),
			options: {
				table: featureSelections,
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
			.from(featureSelections)
			.where(
				and(eq(featureSelections.userId, userId), eq(featureSelections.id, id)),
			)
			.limit(1);
	}

	public async updateById(
		userId: string,
		id: string,
		data: Partial<typeof featureSelections.$inferInsert>,
	) {
		return db
			.update(featureSelections)
			.set(data)
			.where(
				and(eq(featureSelections.userId, userId), eq(featureSelections.id, id)),
			)
			.returning();
	}

	public async deleteById(userId: string, id: string) {
		return db
			.delete(featureSelections)
			.where(
				and(eq(featureSelections.userId, userId), eq(featureSelections.id, id)),
			)
			.returning();
	}
}
