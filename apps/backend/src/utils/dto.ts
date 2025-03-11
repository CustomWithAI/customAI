import { type TSchema, t } from "elysia";

export const toMultipleResponse = <T extends TSchema>(singleResponse: T) => {
	return t.Object({
		data: t.Array(singleResponse),
		nextCursor: t.Optional(t.String()),
		prevCursor: t.Optional(t.String()),
		total: t.Number(),
	});
};
