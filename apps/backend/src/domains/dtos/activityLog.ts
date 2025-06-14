import { toMultipleResponse } from "@/utils/dto";
import { t } from "elysia";

export const activityTypeEnum = t.Union([
  t.Literal("training_start"),
  t.Literal("training_pending"),
  t.Literal("training_in_progress"),
  t.Literal("training_complete"),
  t.Literal("training_failed"),
  t.Literal("training_clone"),
  t.Literal("training_delete"),
  t.Literal("training_set_default"),
]);

export const createActivityLogDto = t.Object({
  type: activityTypeEnum,
  version: t.String({ maxLength: 255 }),
  fromVersion: t.Optional(t.String({ maxLength: 255 })),
  errorMessage: t.Optional(t.String({ maxLength: 255 })),
});

export const updateActivityLogDto = t.Partial(createActivityLogDto);

export const defaultActivityLogResponseDto = t.Object({
  ...createActivityLogDto.properties,
  id: t.String(),
  workflowId: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export const activityLogResponseDto = t.Object({
  id: t.String(),
  type: activityTypeEnum,
  version: t.String(),
  fromVersion: t.Union([t.String(), t.Null()]),
  errorMessage: t.Union([t.String(), t.Null()]),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export const deleteActivityLogResponseDto = t.Object({
  message: t.String(),
});

export const activityLogsResponseDto = toMultipleResponse(
  activityLogResponseDto
);

export type CreateActivityLogDto = typeof createActivityLogDto.static;
export type UpdateActivityLogDto = typeof updateActivityLogDto.static;
export type DefaultActivityLogResponseDto =
  typeof defaultActivityLogResponseDto.static;
export type ActivityLogResponseDto = typeof activityLogResponseDto.static;
export type ActivityLogsResponseDto = typeof activityLogsResponseDto.static;
export type DeleteActivityLogResponseDto =
  typeof deleteActivityLogResponseDto.static;
