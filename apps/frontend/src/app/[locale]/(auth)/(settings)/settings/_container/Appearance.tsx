import { Header } from "@/components/typography/text";
import { useTranslations } from "next-intl";

export const AppearancePage = () => {
	const t = useTranslations();
	return (
		<div className="flex flex-col gap-y-6">
			<Header className="w-full border-b">{t("Appearance.Language")}</Header>
		</div>
	);
};
