import { setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

export default async function LearningLayout({
	children,
	params,
}: { children: ReactNode; params: { slug: string; locale: string } }) {
	const { locale } = params;
	if (!locale) {
		throw new Error("Locale not found");
	}
	setRequestLocale(locale);
	return <>{children}</>;
}
