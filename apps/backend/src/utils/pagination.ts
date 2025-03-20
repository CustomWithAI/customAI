import {
	type InferSelectModel,
	type SQL,
	and,
	asc,
	desc,
	eq,
	gt,
	ilike,
	lt,
	or,
} from "drizzle-orm";
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

type DirectionCursor = "asc" | "desc";

export type TableColumns<TColumn extends PgTableWithColumns<TableConfig>> =
	TColumn["_"]["columns"];

type CursorOptions<TTable extends PgTableWithColumns<TableConfig>> = {
	table: TTable;
	primaryKey: keyof TableColumns<TTable>;
	cursorFields: Array<keyof TableColumns<TTable>>;
	limit?: number;
	direction?: DirectionCursor;
	cursor?: string;
	filters?: Record<string, string>;
	search?: Record<string, string>;
	orderBy?: Record<string, string>;
};

type OffsetOptions<TTable extends PgTableWithColumns<TableConfig>> = {
	table: TTable;
	page?: number;
	limit?: number;
	filters?: Record<string, string>;
	search?: Record<string, string>;
	orderBy?: Record<string, string>;
};

type withPaginationProperties<TTable extends PgTableWithColumns<TableConfig>> =
	| {
			mode: "offset";
			options: OffsetOptions<TTable>;
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
	return (a === aValue) === (b === bValue || bValue === undefined);
}

// Main functions
async function withPagination<
	TQuery extends PgSelectQueryBuilder = PgSelectQueryBuilder,
	TTable extends
		PgTableWithColumns<TableConfig> = PgTableWithColumns<TableConfig>,
	TResult extends object = TTable["$inferSelect"],
>(
	qb: TQuery,
	{
		mode,
		options,
		where: queryWhere,
	}: withPaginationProperties<TTable> & { where?: SQL },
): Promise<{
	data: TResult[];
	nextCursor?: string;
	prevCursor?: string;
}> {
	const optionsCause: (SQL | undefined)[] = [];
	if (options.filters) {
		for (const [key, value] of Object.entries(options.filters)) {
			optionsCause.push(eq(options.table[key], value));
		}
	}
	if (options.search) {
		for (const [key, value] of Object.entries(options.search)) {
			optionsCause.push(or(ilike(options.table[key], `%${value}%`)));
		}
	}
	switch (mode) {
		case "offset": {
			const { limit = 10, page = 1 } = options;
			const data = await (
				qb
					.where(and(...optionsCause))
					.limit(limit)
					.offset((page - 1) * limit)
					.orderBy(
						...(Object.entries(options.orderBy || {})?.map(([key, value]) =>
							value === "asc"
								? asc(options.table[key])
								: desc(options.table[key]),
						) ?? []),
					) as any
			).execute();
			return { data };
		}
		case "cursor": {
			const {
				cursorFields,
				direction = "asc",
				primaryKey,
				limit = 10,
				table,
				cursor,
			} = options;
			const decodedCursorFields = cursor ? decodeCursor(cursor) : null;
			const [comparatorFn, inverseComparatorFn, orderFn, inverseOrderFn] =
				compare("asc", direction, "next", decodedCursorFields?.direction)
					? [gt, lt, asc, desc]
					: [lt, gt, desc, asc];
			const isNext = decodedCursorFields?.direction !== "before";

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
					and(
						queryWhere,
						decodedCursorFields
							? or(
									cursorFields.length === 0
										? eq(table[primaryKey], decodedCursorFields[primaryKey])
										: undefined,
									generateConditions(comparatorFn),
								)
							: undefined,
						...optionsCause,
					),
				)
				.limit(limit + 1)
				.orderBy(
					...(Object.entries(options.orderBy || {})?.map(([key, value]) =>
						value === "asc" ? asc(table[key]) : desc(table[key]),
					) ?? []),
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
								{} as Record<string, unknown>,
							),
							[primaryKey]: data[data.length - 1][primaryKey],
							direction: isNext ? "next" : "before",
						})
					: undefined;

			const prevQuery = qb
				.where(
					and(
						queryWhere,
						data.length > 0
							? generateConditions(inverseComparatorFn, data[0])
							: undefined,
						...optionsCause,
					),
				)
				.limit(1)
				.orderBy(
					...(Object.entries(options.orderBy || {})?.map(([key, value]) =>
						value === "asc" ? desc(table[key]) : asc(table[key]),
					) ?? []),
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
							direction: isNext ? "before" : "next",
						})
					: undefined;

			return {
				data: isNext ? data.slice(0, limit) : data.slice(0, limit).reverse(),
				nextCursor: isNext ? nextCursor : prevCursor,
				prevCursor: isNext ? prevCursor : nextCursor,
			};
		}
	}
}

export default withPagination;
