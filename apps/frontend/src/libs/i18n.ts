import { AppConfig } from "@/utils/appconfig";
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

export default getRequestConfig(async ({ locale }) => {
	if (!AppConfig.locales.includes(locale)) {
		notFound();
	}

	return {
		messages: (await import(`../locales/${locale}.json`)).default,
	};
});
