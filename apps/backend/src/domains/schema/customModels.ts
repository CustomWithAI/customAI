import { user } from "@/domains/schema/auth";
import { jsonb, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { v7 } from "uuid";

export const customModels = pgTable("custom_models", {
	id: varchar("id", { length: 255 })
		.primaryKey()
		.$defaultFn(() => v7()),
	type: varchar("type", { length: 255 }).notNull(),
	data: jsonb("data").notNull(),
	name: varchar("name", { length: 255 }).notNull(),
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
});
