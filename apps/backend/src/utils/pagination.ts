import { and, asc, desc, eq, gt, lt, or } from "drizzle-orm";
import type {
	PgSelectQueryBuilder,
	PgTableWithColumns,
} from "drizzle-orm/pg-core";

// Types

export type TableConfig = {
	name: string;
	schema: string | undefined;
	columns: any;
	dialect: string;
};

type DirectionCursor = "forward" | "backward";

export type TableColumns<TColumn extends PgTableWithColumns<TableConfig>> =
	TColumn["_"]["columns"];

type CursorOptions<TTable extends PgTableWithColumns<TableConfig>> = {
	table: TTable;
	primaryKey: keyof TableColumns<TTable>;
	cursorFields: Array<keyof TableColumns<TTable>>;
	limit?: number;
	direction?: DirectionCursor;
	cursor?: string;
};

type OffsetOptions = {
	page?: number;
	limit?: number;
};

type withPaginationProperties<TTable extends PgTableWithColumns<TableConfig>> =
	| {
			mode: "offset";
			options: OffsetOptions;
	  }
	| {
			mode: "cursor";
			options: CursorOptions<TTable>;
	  };

// Helper functions
const encodeCursor = (cursor: Record<string, unknown>) =>
	Buffer.from(JSON.stringify(cursor)).toString("base64");

const decodeCursor = (cursor: string) => {
	const data = JSON.parse(Buffer.from(cursor, "base64").toString("utf-8"));
	if (data.createdAt) data.createdAt = new Date(data.createdAt);
	if (data.updatedAt) data.updatedAt = new Date(data.updatedAt);
	return data;
};

function compare<T, K>(a: T, aValue: T, b: K, bValue: K | undefined): boolean {
	return (a === aValue) === (b === bValue || b === undefined);
}

// Main functions
async function withPagination<
	TQuery extends PgSelectQueryBuilder,
	TTable extends PgTableWithColumns<TableConfig>,
>(
	qb: TQuery,
	{ mode, options }: withPaginationProperties<TTable>,
): Promise<
	| { data: TTable["$inferInsert"]; nextCursor?: string; prevCursor?: string }
	| undefined
> {
	switch (mode) {
		case "offset": {
			const { limit = 10, page = 1 } = options;
			const data = await (
				qb.limit(limit).offset((page - 1) * limit) as any
			).execute();
			return { data };
		}
		case "cursor": {
			const {
				cursorFields,
				direction = "forward",
				primaryKey,
				limit = 10,
				table,
				cursor,
			} = options;
			const decodedCursorFields = cursor ? decodeCursor(cursor) : null;
			const [comparatorFn, inverseComparatorFn, orderFn, inverseOrderFn] =
				compare("forward", direction, "next", decodedCursorFields?.direction)
					? [gt, lt, asc, desc]
					: [lt, gt, desc, asc];

			const generateConditions = (
				comparator: typeof comparatorFn,
				ref?: TTable["$inferSelect"],
			) => {
				return or(
					...cursorFields.map((_, i) =>
						and(
							...cursorFields
								.slice(0, i)
								.map((field) =>
									eq(table[field], ref?.[field] ?? decodedCursorFields[field]),
								),
							comparator(
								table[cursorFields[i]],
								ref?.[cursorFields[i]] ?? decodedCursorFields[cursorFields[i]],
							),
						),
					),
					and(
						...cursorFields.map((field) =>
							eq(table[field], ref?.[field] ?? decodedCursorFields[field]),
						),
						comparator(
							table[primaryKey],
							ref?.[primaryKey] ?? decodedCursorFields[primaryKey],
						),
					),
				);
			};

			const nextQuery = qb
				.where(
					decodedCursorFields ? generateConditions(comparatorFn) : undefined,
				)
				.limit(limit + 1)
				.orderBy(
					...cursorFields.map((field) => orderFn(table[field])),
					orderFn(table[primaryKey]),
				);

			const data: TTable["$inferInsert"] = await nextQuery;

			const nextCursor =
				data.length > limit
					? encodeCursor({
							...cursorFields.reduce(
								(acc, field) => {
									acc[field as string] = data[data.length - 1][field];
									return acc;
								},
								{} as Record<string, any>,
							),
							[primaryKey]: data[data.length - 1][primaryKey],
							direction: "next",
						})
					: undefined;

			const prevQuery = qb
				.where(generateConditions(inverseComparatorFn, data[0]))
				.limit(1)
				.orderBy(
					...cursorFields.map((field) => inverseOrderFn(table[field])),
					inverseOrderFn(table[primaryKey]),
				);

			const prevData: TTable["$inferInsert"] = await prevQuery;

			const prevCursor =
				prevData.length > 0
					? encodeCursor({
							...cursorFields.reduce(
								(acc, field) => {
									acc[field as string] = prevData[0][field];
									return acc;
								},
								{} as Record<string, unknown>,
							),
							[primaryKey]: prevData[0][primaryKey],
							direction: "before",
						})
					: undefined;

			return {
				data:
					decodedCursorFields?.direction !== "before"
						? data.slice(0, limit)
						: data.reverse().slice(0, limit),
				nextCursor,
				prevCursor,
			};
		}
	}
}

export default withPagination;
