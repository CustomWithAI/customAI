import { routing } from "@/i18n/routings";
import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "better-auth/types";
import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { guestRoutes } from "./configs/route";
import { env } from "./env";

const authAndLocaleMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { nextUrl: url } = request;
  const pathname = `/${url.pathname.split("/")?.[2] || ""}`;

  if (guestRoutes.includes(pathname)) {
    return authAndLocaleMiddleware(request);
  }

  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: env.NEXT_PUBLIC_BACKEND_URL,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    }
  );

  if (!session) {
    return NextResponse.redirect(new URL(`${url.locale}/signin`, request.url));
  }

  return authAndLocaleMiddleware(request);
}

export const config = {
  matcher: ["/(th|en)/:path*"],
};
