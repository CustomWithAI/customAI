import { toMultipleResponse } from "@/utils/dto";
import { t } from "elysia";

export const createDatasetDto = t.Object({
  name: t.String({ maxLength: 255 }),
  description: t.String({ maxLength: 255 }),
  annotationMethod: t.String({ maxLength: 255 }),
});

export const updateDatasetDto = t.Partial(
  t.Object({
    ...createDatasetDto.properties,
    splitMethod: t.String({ maxLength: 255 }),
    labels: t.Array(
      t.Object({
        name: t.String(),
        color: t.String(),
      })
    ),
    train: t.Integer(),
    test: t.Integer(),
    valid: t.Integer(),
  })
);

export const defaultDatasetResponseDto = t.Object({
  ...createDatasetDto.properties,
  id: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  splitMethod: t.Union([t.String(), t.Null()]),
  labels: t.Union([t.Unknown(), t.Null()]),
  train: t.Union([t.Integer(), t.Null()]),
  test: t.Union([t.Integer(), t.Null()]),
  valid: t.Union([t.Integer(), t.Null()]),
});

export const datasetResponseDto = t.Object({
  ...defaultDatasetResponseDto.properties,
  images: t.Optional(t.Array(t.String())),
  imageCount: t.Optional(t.Integer()),
});

export const datasetsResponseDto = toMultipleResponse(datasetResponseDto);

export type CreateDatasetDto = typeof createDatasetDto.static;
export type UpdateDatasetDto = typeof updateDatasetDto.static;
export type DatasetResponseDto = typeof datasetResponseDto.static;
export type DatasetsResponseDto = typeof datasetsResponseDto.static;
