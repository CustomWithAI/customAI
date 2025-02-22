import { toMultipleResponse } from "@/utils/dto";
import { t } from "elysia";

export const createDatasetDto = t.Object({
  name: t.String({ maxLength: 255 }),
  description: t.String({ maxLength: 255 }),
  annotationMethod: t.String({ maxLength: 255 }),
  splitData: t.Record(t.String(), t.Any()),
});

export const updateDatasetDto = t.Partial(createDatasetDto);

export const defaultDatasetResponseDto = t.Object({
  ...createDatasetDto.properties,
  id: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  userId: t.String(),
  splitData: t.Unknown(),
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
