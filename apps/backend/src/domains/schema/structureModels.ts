import { jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { customModels } from "@/domains/schema/customModels";
import { user } from "@/domains/schema/auth";

export const structureModels = pgTable("structure_models", {
  id: uuid("id").defaultRandom().primaryKey(),
  preTrainedModel: jsonb("preTrainedModel"),
  customModelId: uuid("customModelId").references(() => customModels.id),
  userId: text("userId").references(() => user.id),
});
