import { t } from "elysia";

export const createFeatureSelectionDto = t.Object({
  name: t.String({ maxLength: 255 }),
  data: t.Object({}, { additionalProperties: true }),
});

export const updateFeatureSelectionDto = t.Partial(createFeatureSelectionDto);

export type CreateFeatureSelectionDto = typeof createFeatureSelectionDto.static;
export type UpdateFeatureSelectionDto = typeof updateFeatureSelectionDto.static;
