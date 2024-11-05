import { userModel } from "@/domains/models/user";
import { Elysia, t } from "elysia";

export const UserController = new Elysia({ prefix: "/users" }).post(
  "/:id",
  async ({ body, cookie: { session } }) => {
    return true;
  },
  {
    body: t.Object(userModel.insert.user),
  }
);
