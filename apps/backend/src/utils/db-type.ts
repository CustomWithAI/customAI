import type { db } from "@/infrastructures/database/connection";

export type DatabaseType = typeof db;

export type PaginationParams = {
  limit: number;
  cursor?: string;
};
