import { toMultipleResponse } from "@/utils/dto";
import { t } from "elysia";

export const createImagesDto = t.Object({
  files: t.Files({
    minItems: 1,
    type: ["image/jpeg", "image/png", "image/svg", "image/webp"],
  }),
});

export const updateImageDto = t.Object({
  file: t.Optional(t.File()),
  annotation: t.Optional(t.Record(t.String(), t.Any())),
});

export const imageResponseDto = t.Object({
  path: t.String(),
  url: t.String(),
  annotation: t.Unknown(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  datasetId: t.String(),
});

export const deleteImageResponseDto = t.Object({
  message: t.String(),
});

export const imagesResponseDto = toMultipleResponse(imageResponseDto);

export type CreateImageDto = typeof createImagesDto.static;
export type UpdateImageDto = typeof updateImageDto.static;
export type ImageResponseDto = typeof imageResponseDto.static;
export type ImagesResponseDto = typeof imagesResponseDto.static;
export type DeleteImageResponseDto = typeof deleteImageResponseDto.static;
