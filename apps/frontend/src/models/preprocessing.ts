import { z } from "zod";

export type PreprocessingDetailsSchema = z.infer<
	typeof preprocessingDetailsSchema
>;

export const preprocessingDetailsSchema = z.object({
	name: z.string().min(1, { message: "name is required" }),
});
