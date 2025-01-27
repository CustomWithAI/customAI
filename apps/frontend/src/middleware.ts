import { routing } from "@/i18n/routings";
import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "better-auth/types";
import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { guestRoutes } from "./configs/route";
import { env } from "./env.mjs";

const SUPPORTED_LANGUAGES = ["en", "th"];
const DEFAULT_LANGUAGE = "en";
const authAndLocaleMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
	const { nextUrl: url } = request;
	const [, locale, ...segments] = url.pathname.split("/");
	if (!SUPPORTED_LANGUAGES.includes(locale)) {
		const newUrl = new URL(request.url);
		newUrl.pathname = `/${DEFAULT_LANGUAGE}/${url.pathname.replace(/^\//, "")}`;
		return NextResponse.redirect(newUrl);
	}
	const pathname = `/${segments[0] || ""}`;
	if (guestRoutes.includes(pathname)) {
		return authAndLocaleMiddleware(request);
	}

	const { data: session } = await betterFetch<Session>(
		"/api/auth/get-session",
		{
			baseURL: env.NEXT_SERVER_BACKEND_URL,
			headers: {
				cookie: request.headers.get("cookie") || "",
			},
		},
	);

	if (!session) {
		request.nextUrl.pathname = `/${locale}/signin`;
	}

	return authAndLocaleMiddleware(request);
}

export const config = {
	matcher: ["/((?!_next|api|static|favicon.ico).*)"],
};
