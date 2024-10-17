import { logger } from "@/config/logger";
import {
  account,
  rateLimit,
  session,
  user,
  verification,
} from "@/domains/schema/auth";
import { db } from "./connection";
import { cleanupDB } from "./utils";

export async function seedAuth(): Promise<void> {
  logger.info("🌱 Seeding auth data...");
  await db.transaction(async (context) => {
    await cleanupDB(context, user);
    await cleanupDB(context, session);
    await cleanupDB(context, rateLimit);
    await cleanupDB(context, verification);
    await cleanupDB(context, account);
    logger.info("🧹 Cleaned up the database...");

    logger.info("🌱 Auth data has been seeded");
  });
}
