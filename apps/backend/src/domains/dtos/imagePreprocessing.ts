import { t } from "elysia";

export const createImagePreprocessingDto = t.Object({
  name: t.String({ maxLength: 255 }),
  data: t.Record(t.String(), t.Any()),
});

export const updateImagePreprocessingDto = t.Partial(
  createImagePreprocessingDto
);

export type CreateImagePreprocessingDto =
  typeof createImagePreprocessingDto.static;

export type UpdateImagePreprocessingDto =
  typeof updateImagePreprocessingDto.static;
