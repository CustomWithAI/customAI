import { getRequestConfig } from "next-intl/server";
import { routing } from "./routings";

export default getRequestConfig(async ({ requestLocale }) => {
	let locale = await requestLocale;
	if (!locale || !routing.locales.includes(locale as "en-US" | "th-TH")) {
		locale = routing.defaultLocale;
	}
	return {
		locale,
		messages: {
			...(await import(`@/locale/${locale}/common.json`)).default,
			...(await import(`@/locale/${locale}/home.json`)).default,
			...(await import(`@/locale/${locale}/settings.json`)).default,
		},
	};
});

export type Locale = (typeof routing.locales)[number];
