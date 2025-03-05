import { toMultipleResponse } from "@/utils/dto";
import { t } from "elysia";

export const createFeatureExtractionDto = t.Object({
  name: t.String({ maxLength: 255 }),
  data: t.Record(t.String(), t.Any()),
});

export const updateFeatureExtractionDto = t.Partial(createFeatureExtractionDto);

export const featureExtractionResponseDto = t.Object({
  ...createFeatureExtractionDto.properties,
  id: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  data: t.Unknown(),
});

export const featureExtractionsResponseDto = toMultipleResponse(
  featureExtractionResponseDto
);

export type CreateFeatureExtractionDto =
  typeof createFeatureExtractionDto.static;
export type UpdateFeatureExtractionDto =
  typeof updateFeatureExtractionDto.static;
export type FeatureExtractionResponseDto =
  typeof featureExtractionResponseDto.static;
export type FeatureExtractionsResponseDto =
  typeof featureExtractionsResponseDto.static;
