import { z } from "zod";

export type DatasetDetailsSchema = z.infer<typeof datasetDetailsSchema>;

export const datasetDetailsSchema = z.object({
	name: z.string().min(1, { message: "name is required" }),
	description: z.string().min(1, { message: "description is required" }),
	annotationMethod: z
		.string()
		.min(1, { message: "annotation method is required" }),
	splitData: z.string().min(1, { message: "split data is required" }),
});
