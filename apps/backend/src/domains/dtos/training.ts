import { augmentationResponseDto } from "@/domains/dtos/augmentation";
import { customModelResponseDto } from "@/domains/dtos/customModel";
import { defaultDatasetResponseDto } from "@/domains/dtos/dataset";
import { featureExtractionResponseDto } from "@/domains/dtos/featureExtraction";
import { featureSelectionResponseDto } from "@/domains/dtos/featureSelection";
import { imagePreprocessingResponseDto } from "@/domains/dtos/imagePreprocessing";
import { workflowResponseDto } from "@/domains/dtos/workflow";
import { toMultipleResponse } from "@/utils/dto";
import { t } from "elysia";

export const createTrainingDto = t.Object({
	pipeline: t.Record(t.String(), t.Any()),
	version: t.Optional(t.String()),
});

export const updateTrainingDto = t.Partial(
	t.Object({
		...createTrainingDto.properties,
		hyperparameter: t.Record(t.String(), t.Any()),
		datasetId: t.String({ maxLength: 255 }),
		imagePreprocessingId: t.String({ maxLength: 255 }),
		featureExtractionId: t.Union([t.String({ maxLength: 255 }), t.Null()]),
		featureSelectionId: t.Union([t.String({ maxLength: 255 }), t.Null()]),
		augmentationId: t.Union([t.String({ maxLength: 255 }), t.Null()]),
		preTrainedModel: t.Union([t.String({ maxLength: 255 }), t.Null()]),
		machineLearningModel: t.Union([t.Record(t.String(), t.Any()), t.Null()]),
		customModelId: t.Union([t.String({ maxLength: 255 }), t.Null()]),
	}),
);

export const defaultTrainingResponseDto = t.Object({
	id: t.String(),
	isDefault: t.Boolean(),
	version: t.Union([t.String(), t.Null()]),
	hyperparameter: t.Union([t.Unknown(), t.Null()]),
	pipeline: t.Unknown(),
	status: t.String(),
	queueId: t.Union([t.String(), t.Null()]),
	retryCount: t.Number(),
	errorMessage: t.Union([t.String(), t.Null()]),
	trainedModelPath: t.Union([t.String(), t.Null()]),
	workflowId: t.String(),
	datasetId: t.Union([t.String(), t.Null()]),
	imagePreprocessingId: t.Union([t.String(), t.Null()]),
	featureExtractionId: t.Union([t.String(), t.Null()]),
	featureSelectionId: t.Union([t.String(), t.Null()]),
	augmentationId: t.Union([t.String(), t.Null()]),
	preTrainedModel: t.Union([t.String(), t.Null()]),
	machineLearningModel: t.Union([t.Unknown(), t.Null()]),
	customModelId: t.Union([t.String(), t.Null()]),
	createdAt: t.Date(),
	updatedAt: t.Date(),
});

export const trainingResponseDto = t.Object({
	id: t.String(),
	isDefault: t.Boolean(),
	version: t.Union([t.String(), t.Null()]),
	hyperparameter: t.Union([t.Unknown(), t.Null()]),
	pipeline: t.Unknown(),
	status: t.String(),
	queueId: t.Union([t.String(), t.Null()]),
	retryCount: t.Number(),
	errorMessage: t.Union([t.String(), t.Null()]),
	trainedModelPath: t.Union([t.String(), t.Null()]),
	dataset: t.Union([defaultDatasetResponseDto, t.Null()]),
	imagePreprocessing: t.Union([imagePreprocessingResponseDto, t.Null()]),
	featureExtraction: t.Union([featureExtractionResponseDto, t.Null()]),
	featureSelection: t.Union([featureSelectionResponseDto, t.Null()]),
	augmentation: t.Union([augmentationResponseDto, t.Null()]),
	workflow: workflowResponseDto,
	preTrainedModel: t.Union([t.String(), t.Null()]),
	machineLearningModel: t.Union([t.Unknown(), t.Null()]),
	customModel: t.Union([customModelResponseDto, t.Null()]),
	createdAt: t.Date(),
	updatedAt: t.Date(),
});

export const startTrainingResponseDto = t.Object({
	message: t.String(),
	queueId: t.String(),
	messagePending: t.Number(),
});

export const trainingsResponseDto = toMultipleResponse(trainingResponseDto);

export type CreateTrainingDto = typeof createTrainingDto.static;
export type UpdateTrainingDto = typeof updateTrainingDto.static;
export type DefaultTrainingResponseDto =
	typeof defaultTrainingResponseDto.static;
export type TrainingResponseDto = typeof trainingResponseDto.static;
export type TrainingsResponseDto = typeof trainingsResponseDto.static;
