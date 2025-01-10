import { logger } from "@/config/logger";
import { account, session, user, verification } from "@/domains/schema/auth";
import { cleanupDB } from "@/utils/db-utils";
import { db } from "./connection";

export async function seedAuth(): Promise<void> {
	logger.info("🌱 Seeding auth data...");
	await db.transaction(async (context) => {
		await cleanupDB(context, user);
		await cleanupDB(context, session);
		await cleanupDB(context, verification);
		await cleanupDB(context, account);
		logger.info("🧹 Cleaned up the database...");

		const sampleUsers = [
			{
				id: "1",
				name: "John Doe",
				email: "user1@user.com",
				emailVerified: true,
				image: "http://example.com/image.jpg",
				createdAt: new Date(),
				updatedAt: new Date(),
				role: "user",
			},
			{
				id: "2",
				name: "Jane Smith",
				email: "user2@user.com",
				emailVerified: false,
				image: null,
				createdAt: new Date(),
				updatedAt: new Date(),
				role: "user",
			},
			{
				id: "3",
				name: "Robert crate",
				email: "admin@admin.com",
				emailVerified: false,
				image: null,
				createdAt: new Date(),
				updatedAt: new Date(),
				role: "user",
			},
		];
		await context.insert(user).values(sampleUsers);
		logger.info("🌱 Auth data has been seeded");
	});
}
