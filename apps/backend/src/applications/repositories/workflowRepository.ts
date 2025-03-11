import { workflows } from "@/domains/schema/workflows";
import { db } from "@/infrastructures/database/connection";
import type { PaginationParams } from "@/utils/db-type";
import withPagination from "@/utils/pagination";
import { and, eq } from "drizzle-orm";

export class WorkflowRepository {
	public async create(data: typeof workflows.$inferInsert) {
		return db.insert(workflows).values(data).returning();
	}

	public async findByUserId(userId: string, pagination: PaginationParams) {
		const total = await db.$count(workflows, eq(workflows.userId, userId));

		if (total === 0) return { data: [], total };

		const query = db.select().from(workflows).$dynamic();

		const paginatedData = await withPagination(query, {
			mode: "cursor",
			where: eq(workflows.userId, userId),
			options: {
				table: workflows,
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
			.from(workflows)
			.where(and(eq(workflows.userId, userId), eq(workflows.id, id)))
			.limit(1);
	}

	public async updateById(
		userId: string,
		id: string,
		data: Partial<typeof workflows.$inferInsert>,
	) {
		return db
			.update(workflows)
			.set(data)
			.where(and(eq(workflows.userId, userId), eq(workflows.id, id)))
			.returning();
	}

	public async deleteById(userId: string, id: string) {
		return db
			.delete(workflows)
			.where(and(eq(workflows.userId, userId), eq(workflows.id, id)))
			.returning();
	}
}
