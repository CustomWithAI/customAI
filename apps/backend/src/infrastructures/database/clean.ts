import { config } from "@/config/env";
import { logger } from "@/config/logger";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";

const db = drizzle(
  `postgresql://${config.POSTGRES_USER}:${config.POSTGRES_PASSWORD}@${config.POSTGRES_LOCAL_HOST}:${config.POSTGRES_PORT}/${config.POSTGRES_DB}`
);
async function emptyDBTables() {
  if (process.env.NODE_ENV === "production") return;
  console.log("🗑️ Emptying the entire database");

  const query = sql<string>`SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE';
    `;

  const tables = await db.execute(query);
  const tableNames = tables.rows
    .map(({ table_name }) => `"public"."${table_name}"`)
    .join(", ");
  const drop = sql.raw(`DROP TABLE ${tableNames} CASCADE;`);
  await db.execute(drop);

  console.log("✅ Database emptied");
}

emptyDBTables()
  .catch((e): void => {
    logger.error(`Cleaning error ${JSON.stringify(e)}`, e);
    process.exit(1);
  })
  .finally((): void => {
    logger.info("Cleaning done!");
    process.exit(0);
  });
