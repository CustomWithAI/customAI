import { user } from "@/domains/schema/auth";
import { jsonb, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";

export const augmentations = pgTable("augmentations", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: varchar("name", { length: 255 }),
	data: jsonb("data"),
	userId: text("user_id")
		.notNull()
		.references(() => user.id),
});
