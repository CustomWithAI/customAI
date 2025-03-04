import { Elysia, t } from "elysia";
import { logger } from "@/config/logger";

export const mockTrainingController = new Elysia({ prefix: "/mock" }).post(
  "/train",
  async ({ body }) => {
    logger.info("🚀 Simulating training for:", body);

    // ⏳ Delay 30 Minitue
    await new Promise((resolve) => setTimeout(resolve, 10000));

    logger.info("✅ Mock training completed for:", body);
    return { message: "Training Completed" };
  },
  { body: t.Object({ message: t.String() }) }
);
