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

function getBrowserLocale(request: NextRequest): string {
	const headers = {
		"accept-language": request.headers.get("accept-language") || "",
	};
	const negotiator = new Negotiator({ headers });
	const browserLanguages = negotiator.languages();

	for (const lang of browserLanguages) {
		const matchedLang = SUPPORTED_LANGUAGES.find((supportedLang) =>
			lang.startsWith(supportedLang),
		);
		if (matchedLang) {
			return matchedLang;
		}
	}

	return DEFAULT_LANGUAGE;
}

export default async function middleware(request: NextRequest) {
	const { nextUrl: url } = request;
	const [, locale, ...segments] = url.pathname.split("/");
	const pathname = `/${segments[0] || ""}`;
	if (guestRoutes.includes(pathname)) {
		if (!SUPPORTED_LANGUAGES.includes(locale)) {
			request.nextUrl.pathname = `/${DEFAULT_LANGUAGE}/${url.pathname.replace(/^\//, "")}`;
		}
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
	});

	if (!session) {
		request.nextUrl.pathname = `/${locale}/signin`;
		return NextResponse.redirect(request.nextUrl);
	}

	if (
		session &&
		(!SUPPORTED_LANGUAGES.includes(locale) ||
			!SUPPORTED_LANGUAGES.includes(session.user.lang))
	) {
		const defaultLocale = SUPPORTED_LANGUAGES.includes(session.user.lang)
			? session.user.lang
			: getBrowserLocale(request);
		request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
		return NextResponse.redirect(request.nextUrl);
	}

	return authAndLocaleMiddleware(request);
}

export const config = {
	matcher: ["/((?!_next|api|static|favicon.ico).*)"],
};
