import { datasets } from "@/domains/schema/datasets";
import { images } from "@/domains/schema/images";
import { db } from "@/infrastructures/database/connection";
import type { PaginationParams } from "@/utils/db-type";
import withPagination from "@/utils/pagination";
import { and, eq, getTableColumns } from "drizzle-orm";

export class DatasetRepository {
	public async create(data: typeof datasets.$inferInsert) {
		return db.insert(datasets).values(data).returning();
	}

	public async findByUserId(userId: string, pagination: PaginationParams) {
		const total = await db.$count(datasets, eq(datasets.userId, userId));

		if (total === 0) return { data: [], total };

		const query = db
			.select({
				...getTableColumns(datasets),
				imageCount: db.$count(images, eq(images.datasetId, datasets.id)),
			})
			.from(datasets)
			.$dynamic();

		const paginatedData = await withPagination(query, {
			mode: "cursor",
			where: eq(datasets.userId, userId),
			options: {
				table: datasets,
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
			.select({
				...getTableColumns(datasets),
				imageCount: db.$count(images, eq(images.datasetId, id)),
			})
			.from(datasets)
			.where(and(eq(datasets.userId, userId), eq(datasets.id, id)))
			.limit(1);
	}

	public async updateById(
		userId: string,
		id: string,
		data: Partial<typeof datasets.$inferInsert>,
	) {
		return db
			.update(datasets)
			.set(data)
			.where(and(eq(datasets.userId, userId), eq(datasets.id, id)))
			.returning();
	}

	public async deleteById(userId: string, id: string) {
		return db
			.delete(datasets)
			.where(and(eq(datasets.userId, userId), eq(datasets.id, id)))
			.returning();
	}
}
