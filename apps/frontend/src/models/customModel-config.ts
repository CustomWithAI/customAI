import { z } from "zod";
import { float } from "./common";

export type ClassificationSchema = z.infer<typeof classificationSchema>;
export const classificationSchema = z.object({
	learning_rate: float.default("0.01"),
	optimizer_type: z.string().optional().nullable(),
	batch_size: z.number().positive().default(32),
	epochs: z.number().positive().default(1),
	loss_function: z.string().optional().nullable(),
});

export type ObjectDetectionSchema = z.infer<typeof objectDetectionSchema>;
export const objectDetectionSchema = z.object({
	learning_rate: float.default("0.01"),
	momentum: float.default("1"),
	optimizer_type: z.string().optional().nullable(),
	batch_size: z.number().positive().default(32),
	epochs: z.number().positive().default(1),
	weight_size: z.string(),
});

export type SegmentationSchema = z.infer<typeof segmentationSchema>;
export const segmentationSchema = z.object({
	batch_size: z.number().positive().default(32),
	epochs: z.number().positive().default(1),
	weight_size: z.string(),
});
