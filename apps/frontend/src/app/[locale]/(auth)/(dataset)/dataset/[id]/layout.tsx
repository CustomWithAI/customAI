import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

type Props = {
	children: ReactNode;
	params: { locale: string; id: string };
};

export async function generateMetadata({
	params: { locale, id },
}: Omit<Props, "children">) {
	const t = await getTranslations({ locale, namespace: "LocaleLayout" });

	return {
		title: `${t("title")} | ${id}`,
	};
}

export default function RootPage({ children }: Props) {
	return children;
}
