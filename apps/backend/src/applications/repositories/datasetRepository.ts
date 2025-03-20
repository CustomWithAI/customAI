import type { DatasetResponseDto } from "@/domains/dtos/dataset";
import { datasets } from "@/domains/schema/datasets";
import { images } from "@/domains/schema/images";
import { db } from "@/infrastructures/database/connection";
import { generatePresignedUrl } from "@/infrastructures/s3/s3";
import type { PaginationParams } from "@/utils/db-type";
import withPagination from "@/utils/pagination";
import { queryParser } from "@/utils/query-parser";
import { and, eq, getTableColumns, sql } from "drizzle-orm";

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
				images: sql<string[]>`
        COALESCE(
          ARRAY_AGG(${images.path}) FILTER (WHERE ${images.path} IS NOT NULL), 
          '{}'::text[]
        )
      `,
			})
			.from(datasets)
			.leftJoin(images, eq(datasets.id, images.datasetId))
			.groupBy(datasets.id)
			.$dynamic();

		const paginatedData = await withPagination<
			typeof query,
			typeof datasets,
			DatasetResponseDto
		>(query, {
			mode: "cursor",
			where: eq(datasets.userId, userId),
			options: {
				table: datasets,
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
			data: paginatedData.data.map((data) => ({
				...data,
				images: data.images?.map((image: string) =>
					generatePresignedUrl(image),
				),
			})),
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
