import { images } from "@/domains/schema/images";
import { db } from "@/infrastructures/database/connection";
import type { PaginationParams } from "@/utils/db-type";
import withPagination from "@/utils/pagination";
import { and, asc, desc, eq, gt, lt } from "drizzle-orm";

export class ImageRepository {
	public async create(data: (typeof images.$inferInsert)[]) {
		return db.insert(images).values(data).returning();
	}

	public async findByDatasetId(
		datasetId: string,
		pagination: PaginationParams,
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

	public async findSurroundingByPath(datasetId: string, filePath: string) {
		const currentImage = await db
			.select()
			.from(images)
			.where(and(eq(images.datasetId, datasetId), eq(images.path, filePath)))
			.limit(1);

		if (!currentImage.length) return null;

		const prevImage = await db
			.select()
			.from(images)
			.where(and(eq(images.datasetId, datasetId), lt(images.path, filePath)))
			.orderBy(desc(images.path))
			.limit(1);

		const nextImage = await db
			.select()
			.from(images)
			.where(and(eq(images.datasetId, datasetId), gt(images.path, filePath)))
			.orderBy(asc(images.path))
			.limit(1);

		return {
			prev: prevImage?.[0] || null,
			current: currentImage?.[0] || null,
			next: nextImage?.[0] || null,
		};
	}

	public async updateByPath(
		datasetId: string,
		filePath: string,
		data: Partial<typeof images.$inferInsert>,
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
