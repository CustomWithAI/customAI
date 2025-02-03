import { t } from "elysia";

export const paginationDto = t.Object({
  limit: t.Integer({ default: 10 }),
  cursor: t.Optional(t.String()),
});

export type PaginationDto = typeof paginationDto.static;
