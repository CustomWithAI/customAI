import { config } from "@/config/env";
import { logger } from "@/config/logger";
import { account, session, user, verification } from "@/domains/schema/auth";
import { cleanupDB } from "@/utils/db-utils";
import { drizzle } from "drizzle-orm/node-postgres";

export async function seedAuth(): Promise<void> {
	const db = drizzle(
		`postgresql://${config.POSTGRES_USER}:${config.POSTGRES_PASSWORD}@${config.POSTGRES_LOCAL_HOST}:${config.POSTGRES_PORT}/${config.POSTGRES_DB}`,
	);
	logger.info("🌱 Seeding auth data...");
	await db.transaction(async (context) => {
		await cleanupDB(context, session);
		await cleanupDB(context, verification);
		await cleanupDB(context, account);
		await cleanupDB(context, user);
		logger.info("🧹 Cleaned up the database...");

		const sampleUsers = [
			{
				id: "nS2tgN5GuNguqywEy6yo1OIOVjhggrHQ",
				name: "Admin CustomAI",
				email: "admin@customai.com",
				emailVerified: false,
				image: null,
				createdAt: new Date(),
				updatedAt: new Date(),
				role: "user",
			},
		];

		const sampleAccounts = [
			{
				id: "8VFecYXIXy5sOsDEmT8OOswlMaz8ekuw",
				accountId: "nS2tgN5GuNguqywEy6yo1OIOVjhggrHQ",
				providerId: "credential",
				userId: "nS2tgN5GuNguqywEy6yo1OIOVjhggrHQ",
				// admin123
				password:
					"5f55c4c21a402477c290868ceb561741:892d56d7a200cd6e5a21c57bbfc9bd412d7b456e162a5b1837efdd0546dcdaf26875569213aaeaad269da2e084f023a39c89ed684295e9abd4e26fbab4d95286",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		];
		await context.insert(user).values(sampleUsers);
		await context.insert(account).values(sampleAccounts);
		logger.info("🌱 Auth data has been seeded");
		Promise.resolve();
	});
}

seedAuth()
	.catch((e): void => {
		logger.error(`Seeding error ${JSON.stringify(e)}`, e);
		process.exit(1);
	})
	.finally((): void => {
		logger.info("Seeding done!");
		process.exit(0);
	});
