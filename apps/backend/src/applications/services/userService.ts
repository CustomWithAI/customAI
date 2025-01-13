import type { Session, User } from "@/lib/auth";

export abstract class UserService {
  static userInfo(user: User | null, session: Session | null) {
    return {
      user: user,
      session: session,
    };
  }
}
