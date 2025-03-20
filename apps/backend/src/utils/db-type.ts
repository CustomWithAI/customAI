import type { db } from "@/infrastructures/database/connection";
import { customType } from "drizzle-orm/pg-core";

export type DatabaseType = typeof db;

export type PaginationParams = {
	limit: number;
	cursor?: string;
	search?: string;
	orderBy?: string;
	filter?: string;
};

export const tsvector = customType<{
	data: string;
}>({
	dataType() {
		return "tsvector";
	},
});
