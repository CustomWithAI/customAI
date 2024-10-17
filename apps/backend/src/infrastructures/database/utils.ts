import { sql, type AnyColumn, type TableConfig } from "drizzle-orm";
import type {
	PgQueryResultHKT,
	PgTableWithColumns,
	PgTransaction,
} from "drizzle-orm/pg-core";

export async function cleanupDB<T extends TableConfig>(
	schema: PgTransaction<
		PgQueryResultHKT,
		Record<string, unknown>,
		Record<string, any>
	>,
	table: PgTableWithColumns<T>,
): Promise<void> {
	await schema.delete(table);
}

export const customCount = (column?: AnyColumn) => {
	if (column) {
		return sql<number>`cast(count(${column}) as integer)`;
	}
	return sql<number>`cast(count(*) as integer)`;
};

export const getCount = (data: { count: number }[]) => {
	return data[0]?.count ?? 0;
};
