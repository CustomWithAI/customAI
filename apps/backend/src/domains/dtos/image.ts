import { toMultipleResponse } from "@/utils/dto";
import { t } from "elysia";

export const createImagesDto = t.Object({
  files: t.Files({
    minItems: 1,
    type: ["image/jpeg", "image/png", "image/svg", "image/webp"],
  }),
});

export const classificationAnnotationDto = t.Object({
  labels: t.Array(t.String()),
});

export const objectDetectionAnnotationDto = t.Object({
  annotation: t.Array(
    t.Object({
      x: t.Number(),
      y: t.Number(),
      width: t.Number(),
      height: t.Number(),
      label: t.String(),
    })
  ),
  labels: t.Array(t.String()),
});

export const segmentationAnnotationDto = t.Object({
  annotation: t.Array(
    t.Object({
      points: t.Array(
        t.Object({
          x: t.Number(),
          y: t.Number(),
        })
      ),
      label: t.String(),
    })
  ),
  labels: t.Array(t.String()),
});

export const updateImageDto = t.Object({
  file: t.Optional(t.File()),
  annotation: t.Optional(
    t.Union([
      classificationAnnotationDto,
      objectDetectionAnnotationDto,
      segmentationAnnotationDto,
    ])
  ),
});

export const imageResponseDto = t.Object({
  path: t.String(),
  url: t.String(),
  annotation: t.Union([t.Unknown(), t.Null()]),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  datasetId: t.String(),
});

export const deleteImageResponseDto = t.Object({
  message: t.String(),
});

export const imagesResponseDto = toMultipleResponse(imageResponseDto);

export type CreateImageDto = typeof createImagesDto.static;
export type ClassificationAnnotationDto =
  typeof classificationAnnotationDto.static;
export type ObjectDetectionAnnotationDto =
  typeof objectDetectionAnnotationDto.static;
export type SegmentationAnnotationDto = typeof segmentationAnnotationDto.static;
export type UpdateImageDto = typeof updateImageDto.static;
export type ImageResponseDto = typeof imageResponseDto.static;
export type ImagesResponseDto = typeof imagesResponseDto.static;
export type DeleteImageResponseDto = typeof deleteImageResponseDto.static;
