import { pgEnum, pgTable, varchar } from "drizzle-orm/pg-core";

export const typeEnum = pgEnum("type", ["type1", "type2", "type3"]);

export const workflows = pgTable("workflows", {
	id: varchar({ length: 255 }).primaryKey(),
	name: varchar({ length: 255 }),
	description: varchar({ length: 255 }),
	type: typeEnum().default("type1"),
	defaultId: varchar({ length: 255 }),
	userId: varchar({ length: 255 }),
});
