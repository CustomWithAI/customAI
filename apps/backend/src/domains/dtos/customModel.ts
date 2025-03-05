import { toMultipleResponse } from "@/utils/dto";
import { t } from "elysia";

export const createCustomModelDto = t.Object({
  name: t.String({ maxLength: 255 }),
  data: t.Record(t.String(), t.Any()),
});

export const updateCustomModelDto = t.Partial(createCustomModelDto);

export const customModelResponseDto = t.Object({
  ...createCustomModelDto.properties,
  id: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  data: t.Unknown(),
});

export const customModelsResponseDto = toMultipleResponse(
  customModelResponseDto
);

export type CreateCustomModelDto = typeof createCustomModelDto.static;
export type UpdateCustomModelDto = typeof updateCustomModelDto.static;
export type CustomModelResponseDto = typeof customModelResponseDto.static;
export type CustomModelsResponseDto = typeof customModelsResponseDto.static;
