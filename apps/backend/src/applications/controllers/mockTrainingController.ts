import { logger } from "@/config/logger";
import { Elysia, t } from "elysia";

export const mockTrainingController = new Elysia({ prefix: "/mock" }).post(
	"/train",
	async ({ body }) => {
		logger.info("🚀 Simulating training for:");

		// ⏳ Delay 1 second for testing
		await new Promise((resolve) => setTimeout(resolve, 1000));

		logger.info("✅ Mock training completed for:", body);
		return { message: "Training Completed" };
	},
);
