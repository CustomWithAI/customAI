import { t } from "elysia";

export const enumResponseDto = t.Object({
  annotationMethod: t.Array(t.String()),
  splitMethod: t.Array(t.String()),
  preTrainedModel: t.Object({
    machineLearning: t.Object({
      classification: t.Array(
        t.Object({
          key: t.String(),
          value: t.Record(t.String(), t.Any()),
        })
      ),
    }),
    deepLearning: t.Object({
      classification: t.Array(t.String()),
      object_detection: t.Array(t.String()),
      segmentation: t.Array(t.String()),
    }),
  }),
  inferenceWorkflow: t.Array(t.String()),
  inferenceTraining: t.Array(t.String()),
  inferenceVersion: t.Array(t.String()),
});

export type EnumResponseDto = typeof enumResponseDto.static;
