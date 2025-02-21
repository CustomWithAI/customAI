import { toMultipleResponse } from "@/utils/dto";
import { t } from "elysia";
import { datasetResponseDto } from "@/domains/dtos/dataset";
import { imagePreprocessingResponseDto } from "@/domains/dtos/imagePreprocessing";
import { featureExtractionResponseDto } from "@/domains/dtos/featureExtraction";
import { featureSelectionResponseDto } from "@/domains/dtos/featureSelection";
import { augmentationResponseDto } from "@/domains/dtos/augmentation";
import { customModelResponseDto } from "@/domains/dtos/customModel";

export const createTrainingDto = t.Object({
  datasetId: t.String({ maxLength: 255 }),
  pipeline: t.Record(t.String(), t.Any()),
});

export const updateTrainingDto = t.Partial(
  t.Object({
    ...createTrainingDto.properties,
    version: t.Number(),
    hyperparameter: t.Record(t.String(), t.Any()),
    imagePreprocessingId: t.String({ maxLength: 255 }),
    featureExtractionId: t.String({ maxLength: 255 }),
    featureSelectionId: t.String({ maxLength: 255 }),
    augmentationId: t.String({ maxLength: 255 }),
    preTrainedModel: t.Record(t.String(), t.Any()),
    customModelId: t.String({ maxLength: 255 }),
  })
);

export const trainingResponseDto = t.Object({
  id: t.String(),
  isDefault: t.Boolean(),
  version: t.Number(),
  hyperparameter: t.Unknown(),
  pipeline: t.Unknown(),
  status: t.String(),
  queueId: t.Optional(t.String()),
  retryCount: t.Number(),
  errorMessage: t.Optional(t.String()),
  trainedModelPath: t.Optional(t.String()),
  dataset: datasetResponseDto,
  imagePreprocessing: t.Optional(imagePreprocessingResponseDto),
  featureExtraction: t.Optional(featureExtractionResponseDto),
  featureSelection: t.Optional(featureSelectionResponseDto),
  augmentation: t.Optional(augmentationResponseDto),
  preTrainedModel: t.Optional(t.Unknown()),
  customModel: t.Optional(customModelResponseDto),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export const startTrainingResponseDto = t.Object({
  message: t.String(),
  queueId: t.String(),
});

export const trainingsResponseDto = toMultipleResponse(trainingResponseDto);

export type CreateTrainingDto = typeof createTrainingDto.static;
export type UpdateTrainingDto = typeof updateTrainingDto.static;
export type TrainingResponseDto = typeof trainingResponseDto.static;
export type TrainingsResponseDto = typeof trainingsResponseDto.static;
