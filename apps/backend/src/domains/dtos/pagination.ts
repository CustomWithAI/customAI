import { t } from "elysia";

export const paginationDto = t.Object({
	limit: t.Integer({ default: 10 }),
	filter: t.Optional(t.String()),
	search: t.Optional(t.String()),
	orderBy: t.Optional(t.String()),
	cursor: t.Optional(t.String()),
});

export type PaginationDto = typeof paginationDto.static;
