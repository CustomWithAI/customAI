import type { Session, User } from "@/lib/auth";

export const UserService = {
  userInfo: (user: User | null, session: Session | null) => {
    return {
      user: user,
      session: session,
    };
  },
};
