import { user } from "@/domains/schema/auth";
import { tsvector } from "@/utils/db-type";
import { type SQL, sql } from "drizzle-orm";
import {
	index,
	jsonb,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	varchar,
} from "drizzle-orm/pg-core";
import { v7 } from "uuid";

export const augmentations = pgTable(
	"augmentations",
	{
		id: varchar("id", { length: 255 })
			.primaryKey()
			.$defaultFn(() => v7()),
		name: varchar("name", { length: 255 }).notNull(),
		data: jsonb("data").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date()),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		search: tsvector("search")
			.notNull()
			.generatedAlwaysAs(
				(): SQL =>
					sql`setweight(to_tsvector('english', ${augmentations.name}), 'A')
           ||
           setweight(to_tsvector('english', ${augmentations.data}), 'B')`,
			),
	},
	(table) => [
		uniqueIndex("id_idx").on(table.id),
		index("idx_name_search").using("gin", table.search),
	],
);
