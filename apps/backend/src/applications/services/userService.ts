import type { Session, User } from "@/lib/auth";

export const userInfo = (user: User | null, session: Session | null) => {
  return {
    user: user,
    session: session,
  };
};
