import { t } from "elysia";

export const createImagesDto = t.Object({
  files: t.Files(),
});

export const updateImageDto = t.Object({
  file: t.Optional(t.File()),
  annotation: t.Optional(t.Record(t.String(), t.Any())),
});

export type CreateImageDto = typeof createImagesDto.static;
export type UpdateImageDto = typeof updateImageDto.static;
