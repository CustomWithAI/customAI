import { type Column, and, eq, gt, or } from "drizzle-orm";
import type { PgSelect, PgTable } from "drizzle-orm/pg-core";

/* waring: `qb` need to dynamic first before use (`.$dynamic()`)
 */
function withPagination<T extends PgSelect>(
	qb: T,
	mode: "offset" | "cursor",
	options: {
		table: Record<string, Column<any>>;
		cursor: Partial<Record<string, unknown>> | undefined;
		page: number | undefined;
		pageSize?: number;
		primaryKey: keyof any | undefined;
	},
) {
	const { table, cursor, page = 1, pageSize = 10, primaryKey = "id" } = options;

	if (mode === "offset") {
		return qb.limit(pageSize).offset((page - 1) * pageSize);
	}

	if (mode === "cursor" && cursor) {
		const cursorFields = Object.keys(cursor);
		if (!cursorFields.length) return undefined;
		return qb
			.where(
				or(
					...cursorFields.map((field) =>
						or(
							gt(table[String(field)], cursor[String(field)]),
							and(
								eq(table[String(field)], cursor[String(field)]),
								gt(table[String(primaryKey)], cursor[String(primaryKey)]),
							),
						),
					),
				),
			)
			.limit(pageSize);
	}

	return qb.limit(pageSize);
}

export default withPagination;
