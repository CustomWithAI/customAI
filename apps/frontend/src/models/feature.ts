import { z } from "zod";

export type FeatureDetailsSchema = z.infer<typeof featureDetailsSchema>;

export const featureDetailsSchema = z.object({
	name: z.string().min(1, { message: "name is required" }),
});
