import { t } from "elysia";

export const createImageDto = t.Object({
  file: t.File(),
  annotation: t.Optional(t.Object({}, { additionalProperties: true })),
  datasetId: t.Optional(t.String({ maxLength: 255 })),
});

export const updateImageDto = t.Partial(createImageDto);

export type CreateImageDto = typeof createImageDto.static;
export type UpdateImageDto = typeof updateImageDto.static;
