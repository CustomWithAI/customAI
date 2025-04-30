import { toMultipleResponse } from "@/utils/dto";
import { t } from "elysia";

const modelInferenceWorkflow = t.Union([
  t.Literal("classification"),
  t.Literal("object_detection"),
  t.Literal("segmentation"),
]);

const modelInferenceTraining = t.Union([
  t.Literal("machine_learning"),
  t.Literal("pre_trained"),
  t.Literal("custom"),
]);

const modelInferenceStatus = t.Union([
  t.Literal("pending"),
  t.Literal("running"),
  t.Literal("completed"),
  t.Literal("failed"),
]);

const modelInferenceVersion = t.Union([
  t.Literal("yolov5"),
  t.Literal("yolov8"),
  t.Literal("yolov11"),
]);

export const createModelInferenceDto = t.Object({
  image: t.File({
    type: ["image/jpeg", "image/png", "image/svg", "image/webp"],
  }),
});

export const createUploadModelInferenceDto = t.Object({
  ...createModelInferenceDto.properties,
  config: t.ObjectString({
    workflow: modelInferenceWorkflow,
    training: modelInferenceTraining,
    version: t.Optional(modelInferenceVersion),
  }),
  model: t.File(),
});

export const modelInferenceResponseDto = t.Object({
  id: t.String(),
  trainingId: t.Union([t.String(), t.Null()]),
  modelPath: t.Union([t.String(), t.Null()]),
  modelConfig: t.Union([t.Unknown(), t.Null()]),
  imagePath: t.String(),
  annotation: t.Union([t.Unknown(), t.Null()]),
  status: modelInferenceStatus,
  queueId: t.Union([t.String(), t.Null()]),
  retryCount: t.Number(),
  errorMessage: t.Union([t.String(), t.Null()]),
  userId: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export const deleteModelInferenceResponseDto = t.Object({
  message: t.String(),
});

export const modelInferencesResponseDto = toMultipleResponse(
  modelInferenceResponseDto
);

export type CreateModelInferenceDto = typeof createModelInferenceDto.static;
export type CreateUploadModelInferenceDto =
  typeof createUploadModelInferenceDto.static;
export type ModelInferenceResponseDto = typeof modelInferenceResponseDto.static;
export type ModelInferencesResponseDto =
  typeof modelInferencesResponseDto.static;
export type UploadModelConfigDto =
  typeof createUploadModelInferenceDto.properties.config.static;
