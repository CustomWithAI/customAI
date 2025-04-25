import { z } from "zod";

export type AugmentationDetailsSchema = z.infer<
	typeof augmentationDetailsSchema
>;

export const augmentationDetailsSchema = z.object({
	name: z.string().min(1, { message: "name is required" }),
});
