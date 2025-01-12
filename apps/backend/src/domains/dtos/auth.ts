import { type Static, t } from "elysia";

export const UserDto = t.Object({
	id: t.String(),
	name: t.String(),
	email: t.String({ format: "email" }),
	emailVerified: t.Boolean(),
	image: t.String({ format: "uri" }),
	createdAt: t.Optional(t.String({ format: "date-time" })),
	updatedAt: t.Optional(t.String({ format: "date-time" })),
	role: t.String(),
	banned: t.Boolean(),
	banReason: t.Optional(t.String()),
	banExpires: t.Optional(t.String({ format: "date-time" })),
});

export type UserDtoType = Static<typeof UserDto>;
