import { t } from "elysia";

export const createAugmentationDto = t.Object({
  name: t.String({ maxLength: 255 }),
  data: t.Object({}, { additionalProperties: true }),
});

export const updateAugmentationDto = t.Partial(createAugmentationDto);

export type CreateAugmentationDto = typeof createAugmentationDto.static;
export type UpdateAugmentationDto = typeof updateAugmentationDto.static;
