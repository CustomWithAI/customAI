import { nullable, z } from "zod";

export type ModelSetupDetails = z.infer<typeof modelSetupDetails>;

export const modelSetupDetails = z.object({
	name: z.string().min(1, { message: "name is required" }),
	model: z.object({
		preTrainedModel: z.string().nullable(),
		"custom-model-id": z.string().nullable(),
		machineLearningModel: z
			.object({
				type: z.string(),
				model: z.any(),
			})
			.nullable(),
	}),
});
