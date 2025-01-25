import { t } from "elysia";

export const createImagePreprocessingDto = t.Object({
  name: t.String({ maxLength: 255 }),
  data: t.Object({}, { additionalProperties: true }),
});

export const updateImagePreprocessingDto = t.Partial(
  createImagePreprocessingDto
);

export type CreateImagePreprocessingDto =
  typeof createImagePreprocessingDto.static;

export type UpdateImagePreprocessingDto =
  typeof updateImagePreprocessingDto.static;
