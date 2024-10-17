import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";

import { AppConfig } from "./utils/appconfig";

const intlMiddleware = createMiddleware({
	locales: AppConfig.locales,
	localePrefix: "as-needed",
	defaultLocale: AppConfig.defaultLocale,
});

export default function middleware(request: NextRequest) {
	return intlMiddleware(request);
}

export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next|monitoring).*)", "/", "/(api|trpc)(.*)"],
};
