import { logger } from "@/config/logger";
import {
	AnyColumn,
	type BinaryOperator,
	type ColumnBaseConfig,
	type ColumnDataType,
	type SQL,
	and,
	asc,
	desc,
	eq,
	gt,
	lt,
	or,
} from "drizzle-orm";
import type {
	PgColumn,
	PgSelectBase,
	PgSelectDynamic,
	PgSelectQueryBuilder,
	PgTable,
	PgTableWithColumns,
} from "drizzle-orm/pg-core";
import { getCount } from "./db-utils";

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

type OrderField<TTable extends PgTableWithColumns<TableConfig>> = {
	field: keyof TableColumns<TTable>;
	direction: "asc" | "desc";
};

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
const encodeCursor = (cursor: any) =>
	Buffer.from(JSON.stringify(cursor)).toString("base64");

const decodeCursor = (cursor: string) => {
	const data = JSON.parse(Buffer.from(cursor, "base64").toString("utf-8"));
	if (data.createdAt) data.createdAt = new Date(data.createdAt);
	if (data.updatedAt) data.updatedAt = new Date(data.updatedAt);
	return data;
};

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
			const [compareFn, oppositeFn, directionFn, oppositeDirectionFn] =
				(direction || decodedCursorFields.direction) === "forward"
					? [gt, lt, asc, desc]
					: [lt, gt, desc, asc];

			let queryConditions: SQL | undefined;
			let reverseConditions: SQL | undefined;
			if (decodedCursorFields) {
				const generateConditions = (comparator: typeof compareFn) =>
					cursorFields.map((_, i) =>
						and(
							...cursorFields
								.slice(0, i)
								.map((field) => eq(table[field], decodedCursorFields[field])),
							comparator(
								table[cursorFields[i]],
								decodedCursorFields[cursorFields[i]],
							),
						),
					);
				queryConditions = or(
					...generateConditions(compareFn),
					and(
						...cursorFields.map((field) =>
							eq(table[field], decodedCursorFields[field]),
						),
						compareFn(table[primaryKey], decodedCursorFields[primaryKey]),
					),
				);

				reverseConditions = or(
					...generateConditions(oppositeFn),
					and(
						...cursorFields.map((field) =>
							eq(table[field], decodedCursorFields[field]),
						),
						oppositeFn(table[primaryKey], decodedCursorFields[primaryKey]),
					),
				);
			}
			const nextQuery = qb
				.where(queryConditions)
				.limit(limit + 1)
				.orderBy(
					...cursorFields.map((field) => directionFn(table[field])),
					directionFn(table[primaryKey]),
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
							direction: "forward",
						})
					: undefined;

			const prevQuery = qb
				.where(reverseConditions)
				.where(oppositeFn(table[primaryKey], data[0]?.[primaryKey]))
				.limit(1)
				.orderBy(
					...cursorFields.map((field) => oppositeDirectionFn(table[field])),
					oppositeDirectionFn(table[primaryKey]),
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
								{} as Record<string, any>,
							),
							[primaryKey]: prevData[0][primaryKey],
							direction: "backwards",
						})
					: undefined;

			return {
				data: data.slice(0, limit),
				nextCursor,
				prevCursor,
			};
		}
	}
}

export default withPagination;
