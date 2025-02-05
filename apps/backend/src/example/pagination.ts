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
		index("created_at_index").on(t.createdAt),
		index("created_at_and_id_index").on(t.createdAt, t.id),
	],
);
/*
-- As of now drizzle-kit only supports index name and on() param, so you have to add order manually
CREATE INDEX IF NOT EXISTS "first_name_index" ON "users" ("first_name" ASC);
CREATE INDEX IF NOT EXISTS "first_name_and_id_index" ON "users" ("first_name" ASC,"id" ASC);
*/

const query = db.select().from(users).$dynamic();

/* result: {
  data: T[]
  nextCursor?: string;
  prevCursor?: string;
}
*/
const result = await withPagination(query, {
	mode: "cursor",
	options: {
		table: user,
		primaryKey: "id", // Primary key for tie-breaking
		cursorFields: ["createdAt"], // Columns for cursor sorting
		cursor:
			"eyJjcmVhdGVkQXQiOiIyMDI1LTAyLTA1VDA0OjM5OjQ3LjYxM1oiLCJpZCI6ImQwZTgwNmRjLTkyZTktNDNjMy05ZmIxLTIwNjcxOTU1MTE5OSJ9",
		limit: 3, // Limit the results to 3 rows
		direction: "forward",
	},
});
