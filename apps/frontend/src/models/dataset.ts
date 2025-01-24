import { z } from "zod";

export type DatasetDetailsSchema = z.infer<typeof datasetDetailsSchema>;

export const datasetDetailsSchema = z.object({
	name: z.string().min(1, { message: "name is required" }),
	description: z.string().min(1, { message: "description is required" }),
	pipeline_type: z.string().min(1, { message: "type is required" }),
});
