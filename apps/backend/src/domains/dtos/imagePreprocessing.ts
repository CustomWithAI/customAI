import { toMultipleResponse } from "@/utils/dto";
import { t } from "elysia";

export const createImagePreprocessingDto = t.Object({
  name: t.String({ maxLength: 255 }),
  data: t.Record(t.String(), t.Any()),
});

export const updateImagePreprocessingDto = t.Partial(
  createImagePreprocessingDto
);

export const imagePreprocessingResponseDto = t.Object({
  ...createImagePreprocessingDto.properties,
  id: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  userId: t.String(),
  data: t.Unknown(),
});

export const imagePreprocessingsResponseDto = toMultipleResponse(
  imagePreprocessingResponseDto
);

export type CreateImagePreprocessingDto =
  typeof createImagePreprocessingDto.static;

export type UpdateImagePreprocessingDto =
  typeof updateImagePreprocessingDto.static;

export type ImagePreprocessingResponseDto =
  typeof imagePreprocessingResponseDto.static;

export type ImagePreprocessingsResponseDto =
  typeof imagePreprocessingsResponseDto.static;
