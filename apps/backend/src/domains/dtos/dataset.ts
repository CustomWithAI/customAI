import { t } from "elysia";

export const createDatasetDto = t.Object({
  name: t.String({ maxLength: 255 }),
  annotationMethod: t.String({ maxLength: 255 }),
  splitData: t.Object({}, { additionalProperties: true }),
});

export const updateDatasetDto = t.Partial(createDatasetDto);

export type CreateDatasetDto = typeof createDatasetDto.static;
export type UpdateDatasetDto = typeof updateDatasetDto.static;
