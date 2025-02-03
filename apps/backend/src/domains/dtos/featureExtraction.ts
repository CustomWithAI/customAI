import { t } from "elysia";

export const createFeatureExtractionDto = t.Object({
  name: t.String({ maxLength: 255 }),
  data: t.Record(t.String(), t.Any()),
});

export const updateFeatureExtractionDto = t.Partial(createFeatureExtractionDto);

export type CreateFeatureExtractionDto =
  typeof createFeatureExtractionDto.static;
export type UpdateFeatureExtractionDto =
  typeof updateFeatureExtractionDto.static;
