import type { FormFieldInput } from "@/components/builder/form";
import {
	classificationSchema,
	objectDetectionSchema,
	segmentationSchema,
} from "@/models/model-config";
import type { ZodObject } from "zod";
import {
	ClassificationParams,
	ObjectDetectionParams,
	SegmentationParams,
} from "./hyperparameterField";
import { workflowEnum } from "./workflow-type";

export const hyperparameterByType: Record<
	string,
	{ formField: FormFieldInput<any>; schema: ZodObject<any> }
> = {
	[workflowEnum.ObjectDetection]: {
		formField: ObjectDetectionParams,
		schema: objectDetectionSchema,
	},
	[workflowEnum.Classification]: {
		formField: ClassificationParams,
		schema: classificationSchema,
	},
	[workflowEnum.Segmentation]: {
		formField: SegmentationParams,
		schema: segmentationSchema,
	},
};
