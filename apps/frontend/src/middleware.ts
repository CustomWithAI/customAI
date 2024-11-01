import { routing } from "@/i18n/routings";
import createMiddleware from "next-intl/middleware";

export default createMiddleware(routing);

export const config = {
  matcher: ["/", "/(th|en)/:path*"],
};
