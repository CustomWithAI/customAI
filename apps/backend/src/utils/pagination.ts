import {
	type ColumnBaseConfig,
	type ColumnDataType,
	and,
	asc,
	desc,
	eq,
	gt,
	or,
} from "drizzle-orm";
import type {
	PgColumn,
	PgSelectQueryBuilder,
	PgTable,
	PgTableWithColumns,
} from "drizzle-orm/pg-core";

type TableConfig = {
	name: string;
	schema: string | undefined;
	columns: any;
	dialect: string;
};

type TableColumns<TColumn extends PgTableWithColumns<TableConfig>> =
	TColumn["_"]["columns"];

type OrderField<TTable extends PgTableWithColumns<TableConfig>> = {
	field: keyof TableColumns<TTable>;
	direction: "asc" | "desc";
};

type CursorOptions<TTable extends PgTableWithColumns<TableConfig>> = {
	table: TTable;
	primaryKey: keyof TableColumns<TTable>;
	cursor: Partial<Record<keyof TableColumns<TTable>, unknown>>;
	limit?: number;
	orderBy: OrderField<TTable>[];
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

function withPagination<
	TQuery extends PgSelectQueryBuilder,
	TTable extends PgTableWithColumns<TableConfig>,
>(
	qb: TQuery,
	{ mode, options }: withPaginationProperties<TTable>,
): TQuery | undefined {
	switch (mode) {
		case "offset": {
			const { limit = 10, page = 1 } = options;
			return qb.limit(limit).offset((page - 1) * limit);
		}
		case "cursor": {
			const { cursor, primaryKey, limit = 10, table, orderBy } = options;
			if (!cursor) return qb.limit(limit);
			const cursorFields = Object.keys(
				cursor,
			) as (keyof TableColumns<TTable>)[];

			const whereClause = or(
				...(cursorFields.length > 0
					? cursorFields.map((field) =>
							or(
								gt(table[field], cursor[field]),
								and(
									eq(table[field], cursor[field]),
									gt(table[primaryKey], cursor[primaryKey]),
								),
							),
						)
					: []),
			);

			const orderByClause = orderBy
				? orderBy.map(({ field, direction }) =>
						direction === "asc" ? asc(table[field]) : desc(table[field]),
					)
				: [asc(table[primaryKey])];

			return qb
				.where(whereClause)
				.limit(limit)
				.orderBy(...orderByClause);
		}
	}
}

export default withPagination;
