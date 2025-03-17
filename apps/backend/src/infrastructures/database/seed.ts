import { dataset } from "@/applications/controllers/datasetController";
import { config } from "@/config/env";
import { logger } from "@/config/logger";
import { augmentations } from "@/domains/schema/augmentations";
import { account, session, user, verification } from "@/domains/schema/auth";
import { datasets } from "@/domains/schema/datasets";
import { imagePreprocessings } from "@/domains/schema/imagePreprocessings";
import { images } from "@/domains/schema/images";
import { workflows } from "@/domains/schema/workflows";
import { cleanupDB } from "@/utils/db-utils";
import { randomUUIDv7 } from "bun";
import { drizzle } from "drizzle-orm/node-postgres";

const db = drizzle(
	`postgresql://${config.POSTGRES_USER}:${config.POSTGRES_PASSWORD}@${config.POSTGRES_LOCAL_HOST}:${config.POSTGRES_PORT}/${config.POSTGRES_DB}`,
);

export async function seedAuth(): Promise<void> {
	logger.info("🌱 Seeding auth data...");
	await db.transaction(async (context) => {
		await cleanupDB(context, session);
		await cleanupDB(context, verification);
		await cleanupDB(context, account);
		await cleanupDB(context, user);
		await cleanupDB(context, datasets);
		await cleanupDB(context, workflows);
		await cleanupDB(context, imagePreprocessings);
		await cleanupDB(context, augmentations);
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
		const id = randomUUIDv7();
		const sampleDatasets = [
			{
				id,
				name: "Dataset Orange Cat",
				description: "Dataset เพื่อแมวส้ม",
				annotationMethod: "classification",
				splitData: { text: "แมว", number: 200 },
				train: 80,
				test: 15,
				valid: 5,
				createdAt: new Date(),
				updatedAt: new Date(),
				userId: "nS2tgN5GuNguqywEy6yo1OIOVjhggrHQ",
			},
		];

		const sampleImages = [
			{
				path: "datasets/test/1.jpg",
				updatedAt: new Date(),
				createdAt: new Date(),
				datasetId: id,
			},
			{
				path: "datasets/test/2.jpg",
				updatedAt: new Date(),
				createdAt: new Date(),
				datasetId: id,
			},
			{
				path: "datasets/test/3.jpg",
				updatedAt: new Date(),
				createdAt: new Date(),
				datasetId: id,
			},
		];

		await context.insert(user).values(sampleUsers);
		await context.insert(account).values(sampleAccounts);
		await context.insert(datasets).values(sampleDatasets);
		await context.insert(images).values(sampleImages);
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
