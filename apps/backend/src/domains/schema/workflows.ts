import { pgEnum, pgTable, varchar } from "drizzle-orm/pg-core";

export const typeEnum = pgEnum("type", ["type1", "type2", "type3"]);

export const workflows = pgTable("workflows", {
	id: varchar("id", { length: 255 }).primaryKey(),
	name: varchar("name", { length: 255 }),
	description: varchar("description", { length: 255 }),
	type: typeEnum("type").default("type1"),
	defaultId: varchar("defaultId", { length: 255 }),
	userId: varchar("userId", { length: 255 }),
});
