import BaseLayout from "@/components/layout/baseLayout";
import { routing } from "@/i18n/routings";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

type Props = {
	children: ReactNode;
	params: { locale: string };
};

export async function generateMetadata({
	params: { locale },
}: Omit<Props, "children">) {
	const t = await getTranslations({ locale, namespace: "LocaleLayout" });

	return {
		title: t("title"),
	};
}

export default async function LocaleLayout({
	children,
	params: { locale },
}: Props) {
	console.log("params:", locale);
	setRequestLocale(locale);
	if (!routing.locales.includes(locale as "en-US" | "th-TH")) {
		notFound();
	}

	return <BaseLayout locale={locale}>{children}</BaseLayout>;
}
