import { trainings } from "@/domains/schema/trainings";
import {
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	varchar,
} from "drizzle-orm/pg-core";
import { v7 } from "uuid";
import { user } from "./auth";
import { workflows } from "./workflows";

export const logs = pgTable(
	"activity",
	{
		id: varchar("id", { length: 255 })
			.primaryKey()
			.$defaultFn(() => v7()),
		event: text("event").notNull(),
		message: text("message").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date()),
		workflowId: varchar("workflow_id", { length: 255 })
			.notNull()
			.references(() => workflows.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
	},
	(table) => [uniqueIndex("activity_event").on(table.event)],
);
