import { toMultipleResponse } from "@/utils/dto";
import { t } from "elysia";

export const createLogDto = t.Object({
  data: t.String(),
  trainingId: t.String({ maxLength: 255 }),
});

export const updateLogDto = t.Partial(createLogDto);

export const logResponseDto = t.Object({
  ...createLogDto.properties,
  id: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export const logsResponseDto = toMultipleResponse(logResponseDto);

export const deleteLogsResponseDto = t.Object({
  message: t.String(),
});

export type CreateLogDto = typeof createLogDto.static;
export type UpdateLogDto = typeof updateLogDto.static;
export type LogResponseDto = typeof logResponseDto.static;
export type LogsResponseDto = typeof logsResponseDto.static;
export type DeleteLogsResponseDto = typeof deleteLogsResponseDto.static;
