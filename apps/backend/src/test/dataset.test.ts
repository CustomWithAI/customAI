import { afterAll, beforeAll, describe } from "bun:test";
import { setupDockerTestDB } from "./utils/db-test";

let container: any;
let db: any;
let pool: any;

describe("unit testing dataset", () => {
	beforeAll(async () => {
		const setup = await setupDockerTestDB();
		container = setup.container;
		db = setup.db;
		pool = setup.pool;
	});

	afterAll(async () => {
		await pool.end();
		await container.stop();
	});
});
