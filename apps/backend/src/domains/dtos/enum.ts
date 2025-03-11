import { t } from "elysia";

export const enumResponseDto = t.Object({
  annotationMethod: t.Array(t.String()),
});

export type EnumResponseDto = typeof enumResponseDto.static;
