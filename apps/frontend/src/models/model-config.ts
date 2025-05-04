import { z } from "zod";
import { float } from "./common";

export type ClassificationSchema = z.infer<typeof classificationSchema>;
export const classificationSchema = z.object({
	learning_rate: float.default("0.01"),
	learning_rate_scheduler: z.string().nullable().default(null),
	momentum: float.default("1"),
	optimizer_type: z.string().optional().nullable(),
	batch_size: z.number().positive().default(32),
	epochs: z.number().positive().default(1),
	loss_function: z.string().optional().nullable(),
	reduce_lr_on_plateau: z.boolean(),
	plateau_monitor: z.string().optional(),
	plateau_factor: float.optional(),
	plateau_patience: z.number().optional(),
	plateau_min_lr: float.optional(),
	early_stopping: z.boolean().optional(),
	early_stopping_monitor: z.string().optional(),
	early_stopping_patience: float.optional(),
});

export type ObjectDetectionSchema = z.infer<typeof objectDetectionSchema>;
export const objectDetectionSchema = z.object({
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
