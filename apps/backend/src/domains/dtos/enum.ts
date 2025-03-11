import { t } from "elysia";

export const enumResponseDto = t.Object({
  annotationMethod: t.Array(t.String()),
  splitMethod: t.Array(t.String()),
  preTrainedModel: t.Object({
    deepLearning: t.Object({
      classification: t.Array(t.String()),
      object_detection: t.Array(t.String()),
      segmentation: t.Array(t.String()),
    }),
  }),
});

export type EnumResponseDto = typeof enumResponseDto.static;
