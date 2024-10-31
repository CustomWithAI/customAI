import Elysia from "elysia";

export const UserController = new Elysia({ prefix: "/users" }).post(
  "/:id",
  async ({ body, cookie: { session } }) => {
    return true;
  }
);
