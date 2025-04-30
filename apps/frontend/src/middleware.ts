import { routing } from "@/i18n/routings";
import { betterFetch } from "@better-fetch/fetch";
import type { Session, User } from "better-auth/types";
import Negotiator from "negotiator";
import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { guestRoutes } from "./configs/route";
import { env } from "./env.mjs";
import { AppConfig } from "./utils/appconfig";

const SUPPORTED_LANGUAGES = AppConfig.locales;
const DEFAULT_LANGUAGE = AppConfig.defaultLocale;
const authAndLocaleMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
	const { nextUrl: url } = request;
	console.log("in middleware", url.pathname);
	const [, locale, ...segments] = url.pathname.split("/");

	if (guestRoutes.includes(segments[0])) {
		return authAndLocaleMiddleware(request);
	}

	const { data: session } = await betterFetch<{
		session: Session;
		user: User & { lang: string; experience: string };
	}>("/api/auth/get-session", {
		baseURL: env.NEXT_SERVER_BACKEND_URL,
		headers: {
			cookie: request.headers.get("cookie") || "",
		},
		cache: "no-store",
	});

	if (!session && !url.pathname.startsWith(`/${DEFAULT_LANGUAGE}/signin`)) {
		return NextResponse.redirect(
			new URL(`/${DEFAULT_LANGUAGE}/signin`, request.url),
		);
	}

	const userLang =
		session && SUPPORTED_LANGUAGES.includes(session?.user.lang)
			? session?.user.lang
			: DEFAULT_LANGUAGE;
	if (!SUPPORTED_LANGUAGES.includes(locale)) {
		return NextResponse.redirect(
			new URL(`/${userLang}${url.pathname}`, request.url),
		);
	}

	return authAndLocaleMiddleware(request);
}

export const config = {
	matcher: [
		"/((?!api|_next/static|public/|.*\\..*|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
	],
};
