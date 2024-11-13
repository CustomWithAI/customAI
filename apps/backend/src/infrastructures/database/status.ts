import { postgresLogger } from "@/config/logger";
import { formatSize } from "@/utils/size";
import { sql } from "drizzle-orm";
import { db } from "./connection";

export async function checkPostgresDbSize() {
  try {
    const result = await db.execute(sql
      `SELECT pg_size_pretty(pg_database_size(current_database())) AS db_size`
    );
    const rows = (result as unknown as { rows: { db_size: string }[] }).rows || [];
    
    const parseSize = (size: string): number => {
      const [value, unit] = size.split(" ");
      const numValue = Number.parseFloat(value);
      switch (unit) {
        case "kB": return numValue * 1024;
        case "MB": return numValue * 1024 ** 2;
        case "GB": return numValue * 1024 ** 3;
        case "TB": return numValue * 1024 ** 4;
        default: return numValue; 
      }
    };

    const totalSizeInBytes = rows.reduce((sum, row) => sum + parseSize(row.db_size), 0);
    return formatSize(totalSizeInBytes) || "Unknown";
  } catch (error) {
    postgresLogger.error("❌  Failed to get PostgreSQL database size:", error);
    return "Error";
  }
}

export const connectDatabase = async (): Promise<void> => {
  try {
    await db.execute(sql`SELECT 1`);
    postgresLogger.info("✅  Database connected successfully");
  } catch (error) {
    postgresLogger.error("❌  Database connection failed:", error);
  }
};