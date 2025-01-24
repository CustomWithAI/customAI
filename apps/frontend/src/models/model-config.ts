import { z } from "zod";

export type ModelConfigurationSchema = z.infer<typeof modelConfigurationSchema>;
export const modelConfigurationSchema = z.object({
	epochs: z.number().positive().default(1),
	batch_size: z.number().positive().default(32),
	learning_rate: z.number().default(0.01),
	early_stopping: z.boolean().default(false),
	loss_function: z.string().optional().nullable(),
	optimizer: z.string().optional().nullable(),
});
