import { config } from "@/config/env";
import { postgresLogger } from "@/config/logger";
import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm/sql";
import { Pool } from "pg";

export const pool = new Pool({
  connectionString: `postgresql://${config.POSTGRES_USER}:${config.POSTGRES_PASSWORD}@${config.POSTGRES_HOST}:${config.POSTGRES_PORT}/${config.POSTGRES_DB}`,
});

export const db = drizzle(pool, {
  logger: config.DATABASE_DEBUG,
});

export const connectDatabase = async (): Promise<void> => {
  try {
    await db.execute(sql`SELECT 1`);
    postgresLogger.info("✅  Database connected successfully");
  } catch (error) {
    postgresLogger.error("❌  Database connection failed:", error);
  }
};
