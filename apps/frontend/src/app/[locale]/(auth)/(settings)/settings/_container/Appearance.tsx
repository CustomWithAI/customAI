import { Header } from "@/components/typography/text";
import { LanguageSwitcher } from "@/components/ui/languageSwitcher";
import { useTranslations } from "next-intl";

export const AppearancePage = () => {
	const t = useTranslations();
	return (
		<div className="flex flex-col gap-y-6">
			<Header className="w-full border-b border-gray-200">
				{t("Appearance.Language")}
			</Header>
			<div>
				<LanguageSwitcher />
			</div>
		</div>
	);
};
