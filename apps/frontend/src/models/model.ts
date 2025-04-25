import { z } from "zod";

export type ModelDetailsSchema = z.infer<typeof modelDetailsSchema>;

export const modelDetailsSchema = z.object({
	name: z.string().min(1, { message: "name is required" }),
});
