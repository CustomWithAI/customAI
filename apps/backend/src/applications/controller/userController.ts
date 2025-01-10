import { Elysia, t } from "elysia";

export const UserController = new Elysia({ prefix: "/users" }).post(
	"/:id",
	async ({ body, cookie: { session } }) => {
		return true;
	},
	{
		body: t.Object({ email: t.String() }),
	},
);
