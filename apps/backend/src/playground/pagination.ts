import { user } from "@/domains/schema/auth";
import { db } from "@/infrastructures/database/connection";
import withPagination from "@/utils/pagination";
import { index, text, timestamp } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core/table";

// Example query
const users = pgTable(
	"users",
	{
		id: text("id").primaryKey(),
		name: text("name").notNull(),
		createdAt: timestamp("created_at").notNull(),
	},
	(t) => [
		index("first_name_index").on(t.name),
		index("first_name_and_id_index").on(t.name, t.id),
	],
);
/*
-- As of now drizzle-kit only supports index name and on() param, so you have to add order manually
CREATE INDEX IF NOT EXISTS "first_name_index" ON "users" ("first_name" ASC);
CREATE INDEX IF NOT EXISTS "first_name_and_id_index" ON "users" ("first_name" ASC,"id" ASC);
*/

const query = db.select().from(users).$dynamic();

withPagination(query, {
	mode: "cursor",
	options: {
		table: user,
		primaryKey: "id", // Primary key for tie-breaking
		cursor: { name: "Alex", id: 2 }, // Cursor values
		limit: 3, // Limit the results to 3 rows
		orderBy: [
			{ field: "name", direction: "asc" }, // Order by first_name ascending
			{ field: "id", direction: "asc" }, // Then order by id ascending
		],
	},
});

const result = await query.execute();
/*
result: {
    id: string;
    name: string;
    createdAt: Date;
}[] 
*/
