import { toMultipleResponse } from "@/utils/dto";
import { t } from "elysia";

export const createFeatureSelectionDto = t.Object({
  name: t.String({ maxLength: 255 }),
  data: t.Record(t.String(), t.Any()),
});

export const updateFeatureSelectionDto = t.Partial(createFeatureSelectionDto);

export const featureSelectionResponseDto = t.Object({
  ...createFeatureSelectionDto.properties,
  id: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  userId: t.String(),
  data: t.Unknown(),
});

export const featureSelectionsResponseDto = toMultipleResponse(
  featureSelectionResponseDto
);

export type CreateFeatureSelectionDto = typeof createFeatureSelectionDto.static;
export type UpdateFeatureSelectionDto = typeof updateFeatureSelectionDto.static;
export type FeatureSelectionResponseDto =
  typeof featureSelectionResponseDto.static;
export type FeatureSelectionsResponseDto =
  typeof featureSelectionsResponseDto.static;
