import path from "node:path";
import {
	PostgreSqlContainer,
	StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

export async function setupDockerTestDB() {
	const POSTGRES_USER = "test";
	const POSTGRES_PASSWORD = "test";
	const POSTGRES_DB = "test";

	const container = new PostgreSqlContainer()
		.withEnvironment({
			POSTGRES_USER,
			POSTGRES_PASSWORD,
			POSTGRES_DB,
		})
		.withExposedPorts(5432)
		.start();

	const connectionString = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${(await container).getHost()}:${(await container).getFirstMappedPort()}//${POSTGRES_DB}`;
	const pool = new Pool({ connectionString });
	const db = drizzle(pool);
	const migrationPath = path.join(process.cwd(), "src/drizzle");
	await migrate(db, { migrationsFolder: migrationPath });
	const confirmDatabaseReady = await db.execute(sql`SELECT 1`);

	return { container, db, confirmDatabaseReady, pool };
}
