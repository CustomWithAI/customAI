import { z } from "zod";
import { float } from "./common";

export type DecisionTreeSchema = z.infer<typeof decisionTreeSchema>;
export const decisionTreeSchema = z.object({
	max_depth: z.number().nullable(),
	min_samples_split: float.default("2").nullable(),
	min_samples_leaf: float.default("1").nullable(),
	max_features: z.union([z.string(), float.default("sqrt")]).nullable(),
	criterion: z.string().default("entropy").nullable(),
	unfreeze: z.boolean().default(false),
});

export type RandomForestSchema = z.infer<typeof randomForestSchema>;
export const randomForestSchema = z.object({
	n_estimators: z.number().nullable(),
	max_depth: z.number().nullable(),
	min_samples_split: float.nullable(),
	min_samples_leaf: float.nullable(),
	max_features: z.union([z.string(), float.default("sqrt")]).nullable(),
	unfreeze: z.boolean().default(false),
});

export type SVMSchema = z.infer<typeof svmSchema>;
export const svmSchema = z.object({
	kernel: z.string().nullable(),
	gamma: z.union([z.string(), float.default("scale")]).nullable(),
	degree: z.number(),
	unfreeze: z.boolean().default(false),
});

export type KNNSchema = z.infer<typeof knnSchema>;
export const knnSchema = z.object({
	n_neighbors: z.number().nullable(),
	weights: z.string().nullable(),
	algorithm: z.string().nullable(),
	leaf_size: z.number().nullable(),
	unfreeze: z.boolean().default(false),
});
