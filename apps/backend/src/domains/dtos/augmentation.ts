import { toMultipleResponse } from "@/utils/dto";
import { t } from "elysia";

export const createAugmentationDto = t.Object({
  name: t.String({ maxLength: 255 }),
  data: t.Record(t.String(), t.Any()),
});

export const updateAugmentationDto = t.Partial(createAugmentationDto);

export const augmentationResponseDto = t.Object({
  ...createAugmentationDto.properties,
  id: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  data: t.Unknown(),
});

export const augmentationsResponseDto = toMultipleResponse(
  augmentationResponseDto
);

export type CreateAugmentationDto = typeof createAugmentationDto.static;
export type UpdateAugmentationDto = typeof updateAugmentationDto.static;
export type AugmentationResponseDto = typeof augmentationResponseDto.static;
export type AugmentationsResponseDto = typeof augmentationsResponseDto.static;
