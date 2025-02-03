import { HttpError } from "@/config/error";
import { auth } from "@/lib/auth";

export const userMiddleware = async (request: Request) => {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    throw HttpError.Unauthorized();
  }

  return {
    user: session.user,
    session: session.session,
  };
};
