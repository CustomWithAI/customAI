import { Elysia, t } from "elysia";
import { UserService } from "@/applications/services/userService";
import { userDto } from "@/domains/dtos/auth";

export const UserController = new Elysia({ prefix: "/users" }).post(
  "/:id",
  async ({ body, cookie: { session } }) => {
    // return UserService.userInfo();
    return true;
  },
  {
    body: t.Object({ email: t.String() }),
  }
);
